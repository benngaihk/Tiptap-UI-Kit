/**
 * Document Agent Loop - 文档编辑 AI Agent 循环
 * @description 基于 OpenAI function-calling 格式的 tool-use 循环：
 * 模型收到用户的自然语言指令 → 调用 documentTools 修改文档 → 直到给出最终答复。
 * 所有已支持的 provider（OpenAI/Anthropic/DeepSeek/阿里云/Ollama/自定义）都走
 * OpenAI 兼容的 /chat/completions（Anthropic 官方提供 OpenAI 兼容层）。
 */

import type { Editor } from '@tiptap/core'
import { getAiConfig, getBaseUrl } from '@/api/ai'
import { getProviderInfo, type AiProvider } from '@/ai/config/types'
import { documentTools, toOpenAiTools, type DocumentTool } from './documentTools'

// ============================================================================
// 类型
// ============================================================================

/** 对话消息（OpenAI chat 格式的子集） */
export interface AgentChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: { name: string; arguments: string }
  }>
  tool_call_id?: string
}

/** agent 过程事件回调（驱动 UI 展示步骤） */
export interface AgentCallbacks {
  /** 模型请求执行某个工具（执行前触发） */
  onToolCall?: (name: string, args: Record<string, unknown>) => void
  /** 工具执行完成（成功或失败） */
  onToolResult?: (name: string, result: string, isError: boolean) => void
  /** 模型输出了最终文本答复 */
  onAssistantMessage?: (text: string) => void
}

export interface RunDocumentAgentOptions {
  editor: Editor
  /** 用户的自然语言指令 */
  instruction: string
  /** 既往对话（仅 user/assistant 文本轮次，用于多轮上下文） */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  /** 中断信号（停止按钮） */
  signal?: AbortSignal
  /** 最大工具调用轮数，默认 12 */
  maxTurns?: number
  /** 界面语言，用于提示模型用同语言答复 */
  locale?: string
  /** 自定义工具集（默认 documentTools 全集） */
  tools?: DocumentTool[]
  callbacks?: AgentCallbacks
}

export interface DocumentAgentResult {
  /** 模型的最终文字答复 */
  finalText: string
  /** 执行过的工具调用数 */
  toolCallCount: number
}

/** AI 未配置（无 API Key）时抛出，UI 捕获后引导用户去配置 */
export class AgentNotConfiguredError extends Error {
  constructor() {
    super('AI is not configured: missing API key.')
    this.name = 'AgentNotConfiguredError'
  }
}

// ============================================================================
// 系统提示词
// ============================================================================

function buildSystemPrompt(locale?: string): string {
  return [
    'You are a document editing assistant embedded in a rich-text editor.',
    'The user gives natural-language instructions; you edit the document by calling tools.',
    '',
    'Workflow:',
    '1. Call read_document first to see the document structure and block indexes.',
    '2. Make edits with the editing tools. Block indexes change after every edit — rely on the "Document now" outline returned by each tool, or call read_document again.',
    '3. When done, reply with a brief summary of what you changed (no raw HTML in the reply).',
    '',
    'Rules:',
    '- Keep HTML simple: p, h1-h6, ul/ol/li, table/tr/th/td, blockquote, pre/code, strong, em, u, s, a, hr.',
    '- Prefer edit_text/format_text for small inline changes; replace_blocks for structural rewrites.',
    '- Never fabricate document content you have not read.',
    '- If the instruction is ambiguous, make a reasonable choice and mention it in your summary.',
    `- Reply to the user in ${locale === 'zh-CN' ? 'Simplified Chinese' : locale === 'zh-TW' ? 'Traditional Chinese' : 'the same language as their instruction'}.`,
  ].join('\n')
}

// ============================================================================
// 主循环
// ============================================================================

const DEFAULT_MAX_TURNS = 12

/** 工具结果里文档概要的起始标记（与 documentTools 的 okWithOutline 对齐） */
const OUTLINE_MARKER = '\nDocument now:\n'

/** 把历史 tool 消息中已过期的文档概要截断，避免每轮重复携带旧概要导致上下文膨胀 */
function supersedeOldOutlines(messages: AgentChatMessage[]): void {
  for (const m of messages) {
    if (m.role !== 'tool' || typeof m.content !== 'string') continue
    const idx = m.content.indexOf(OUTLINE_MARKER)
    if (idx === -1) continue
    m.content = `${m.content.slice(0, idx)}\n(outline superseded by a later edit)`
  }
}

/**
 * 运行文档编辑 agent
 * @description 阻塞直到模型给出最终答复、达到轮数上限或被 signal 中断。
 * 编辑通过 editor 事务实时生效（用户可随时 Cmd+Z 撤销）。
 */
export async function runDocumentAgent(options: RunDocumentAgentOptions): Promise<DocumentAgentResult> {
  const {
    editor,
    instruction,
    history = [],
    signal,
    maxTurns = DEFAULT_MAX_TURNS,
    locale,
    tools = documentTools,
    callbacks = {},
  } = options

  const config = getAiConfig()
  // 仅当 provider 必需 API Key 而用户未配置时才算「未配置」（如 Ollama 本地无需 key）
  const providerInfo = getProviderInfo(config.provider as AiProvider)
  if ((providerInfo?.requiresApiKey ?? true) && !config.apiKey) {
    throw new AgentNotConfiguredError()
  }

  const baseUrl = getBaseUrl(config.provider, config.baseUrl)
  const timeout = config.timeout || 60000
  const openAiTools = toOpenAiTools(tools)

  // apiKey 为空（如 Ollama）时省略 Authorization header
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`

  const messages: AgentChatMessage[] = [
    { role: 'system', content: buildSystemPrompt(locale) },
    ...history.map((m) => ({ role: m.role, content: m.content }) as AgentChatMessage),
    { role: 'user', content: instruction },
  ]

  let toolCallCount = 0

  for (let turn = 0; turn < maxTurns; turn++) {
    if (editor.isDestroyed) throw new Error('Editor was destroyed while the agent was running.')

    // 超时兜底：手动组合外部 signal 与超时信号（AbortSignal.any 的兼容写法）
    const timeoutController = new AbortController()
    const timer = setTimeout(() => timeoutController.abort(), timeout)
    const onExternalAbort = () => timeoutController.abort()
    if (signal?.aborted) timeoutController.abort()
    else signal?.addEventListener('abort', onExternalAbort)

    let data: { choices?: Array<{ message?: Record<string, unknown> }> }
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages,
          tools: openAiTools,
          tool_choice: 'auto',
        }),
        signal: timeoutController.signal,
      })

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        throw new Error(`AI API error ${response.status}: ${body.slice(0, 300) || response.statusText}`)
      }

      data = await response.json()
    } catch (error) {
      // 用户主动停止：让 AbortError 冒泡；否则 abort 只可能来自超时
      if ((error as Error | null)?.name === 'AbortError' && !signal?.aborted) {
        throw new Error('AI request timeout')
      }
      throw error
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onExternalAbort)
    }

    const message = data.choices?.[0]?.message as
      | { content?: unknown; tool_calls?: AgentChatMessage['tool_calls'] }
      | undefined
    if (!message) throw new Error('AI API returned no message.')

    const toolCalls = message.tool_calls

    if (!toolCalls || toolCalls.length === 0) {
      // 最终答复
      const finalText = typeof message.content === 'string' ? message.content : ''
      if (finalText) callbacks.onAssistantMessage?.(finalText)
      return { finalText, toolCallCount }
    }

    // 记录 assistant 的工具调用消息
    messages.push({
      role: 'assistant',
      content: typeof message.content === 'string' ? message.content : null,
      tool_calls: toolCalls,
    })

    // 逐个执行工具
    for (const call of toolCalls) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      if (editor.isDestroyed) throw new Error('Editor was destroyed while the agent was running.')

      const name = call.function?.name || ''
      let args: Record<string, unknown> = {}
      try {
        args = call.function?.arguments ? JSON.parse(call.function.arguments) : {}
      } catch {
        // 参数解析失败也要回传给模型让它重试
      }

      callbacks.onToolCall?.(name, args)
      toolCallCount++

      let result: string
      let isError = false
      const tool = tools.find((t) => t.name === name)
      if (!tool) {
        result = `Error: unknown tool "${name}". Available: ${tools.map((t) => t.name).join(', ')}`
        isError = true
      } else {
        try {
          result = tool.execute(editor, args)
        } catch (error) {
          result = `Error: ${error instanceof Error ? error.message : String(error)}`
          isError = true
        }
      }

      callbacks.onToolResult?.(name, result, isError)
      // 控制历史膨胀：旧工具结果里的文档概要已过期，截断为占位说明，
      // 每轮请求只携带最新一份概要
      supersedeOldOutlines(messages)
      messages.push({ role: 'tool', tool_call_id: call.id, content: result })
    }
  }

  // 达到轮数上限：让模型知道并收尾会更好，但为控制成本直接返回
  return {
    finalText: '',
    toolCallCount,
  }
}

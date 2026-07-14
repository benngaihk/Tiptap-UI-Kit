/**
 * Simulated Document Agent - AI 文档助手演示模式
 * @description 未配置真实 AI 时的本地模拟：轻量关键词匹配用户指令，
 * 调用真实的 documentTools 编辑文档并逐步回调步骤，让访客先体验「文字指令改文档」。
 * 与其他 AI 功能未配置时的 simulateAiStream 演示惯例保持一致；
 * 真实 API Key 应由集成方在工程中配置（VITE_AI_* 或 AI 设置弹窗）。
 */

import type { Editor } from '@tiptap/core'
import { t } from '@/locales'
import { getDocumentTool } from './documentTools'
import type { AgentCallbacks, DocumentAgentResult } from './agentLoop'

export interface RunSimulatedAgentOptions {
  editor: Editor
  instruction: string
  signal?: AbortSignal
  callbacks?: AgentCallbacks
}

interface SimulatedStep {
  tool: string
  args: Record<string, unknown>
}

/** 可中断的延时（模拟网络节奏，让步骤展示有真实感） */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(() => resolve(), ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true }
    )
  })
}

/** 取文档第一个有文本的顶层块的前若干字符（用于加粗演示的查找目标） */
function firstTextSnippet(editor: Editor, maxLen: number): string {
  let snippet = ''
  editor.state.doc.forEach((node) => {
    if (!snippet) {
      const text = node.textContent.trim()
      if (text) snippet = text.slice(0, maxLen)
    }
  })
  return snippet
}

/** 取文档前两个有文本块的内容拼一段「像总结」的文本 */
function summarySource(editor: Editor, maxLen: number): string {
  const parts: string[] = []
  editor.state.doc.forEach((node) => {
    if (parts.length < 2) {
      const text = node.textContent.trim()
      if (text) parts.push(text)
    }
  })
  return parts.join(' · ').slice(0, maxLen)
}

/** 关键词匹配用户指令 → 演示编辑脚本（真实修改文档） */
function planSteps(editor: Editor, instruction: string): SimulatedStep[] {
  const zhTable = t('aiChat.demo.tableCaption')
  const demoParagraph = t('aiChat.demo.paragraph')
  const end = (html: string): SimulatedStep => ({
    tool: 'insert_blocks',
    args: { position: 'documentEnd', html },
  })

  // 每类指令拆成 2-3 步编辑：光标多次飞行、高亮多次闪烁，接管过程看得清楚
  if (/表格|table/i.test(instruction)) {
    return [
      end(`<h3>${t('aiChat.demo.sectionTitle')}</h3>`),
      end(
        `<table><tr><th>${t('aiChat.demo.colA')}</th><th>${t('aiChat.demo.colB')}</th><th>${t('aiChat.demo.colC')}</th></tr>` +
          `<tr><td>${zhTable} 1</td><td>—</td><td>—</td></tr>` +
          `<tr><td>${zhTable} 2</td><td>—</td><td>—</td></tr></table>`
      ),
      end(`<p>${demoParagraph}</p>`),
    ]
  }

  if (/总结|總結|摘要|summar/i.test(instruction)) {
    const source = summarySource(editor, 120)
    return [
      end(`<h2>${t('aiChat.demo.summaryTitle')}</h2>`),
      end(`<p>${source || demoParagraph}</p>`),
      end(`<p>${demoParagraph}</p>`),
    ]
  }

  if (/列表|清单|清單|list/i.test(instruction)) {
    return [
      end(`<h3>${t('aiChat.demo.sectionTitle')}</h3>`),
      end(
        `<ul><li>${t('aiChat.demo.listItem')} 1</li><li>${t('aiChat.demo.listItem')} 2</li><li>${t('aiChat.demo.listItem')} 3</li></ul>`
      ),
      end(`<p>${demoParagraph}</p>`),
    ]
  }

  if (/加粗|粗体|粗體|bold/i.test(instruction)) {
    const snippet = firstTextSnippet(editor, 8)
    if (snippet) {
      return [
        { tool: 'format_text', args: { find: snippet, occurrence: 1, formats: ['bold'] } },
        end(`<p>${demoParagraph}</p>`),
      ]
    }
  }

  if (/标题|標題|heading|章节|章節/i.test(instruction)) {
    return [
      end(`<h2>${t('aiChat.demo.sectionTitle')}</h2>`),
      end(`<p>${demoParagraph}</p>`),
      end(`<ul><li>${t('aiChat.demo.listItem')} 1</li><li>${t('aiChat.demo.listItem')} 2</li></ul>`),
    ]
  }

  // 默认：标题 + 段落 + 列表 三步演示
  return [
    end(`<h3>${t('aiChat.demo.sectionTitle')}</h3>`),
    end(`<p>${demoParagraph}</p>`),
    end(`<ul><li>${t('aiChat.demo.listItem')} 1</li><li>${t('aiChat.demo.listItem')} 2</li></ul>`),
  ]
}

/**
 * 运行演示模式 agent：真实编辑文档（可 Cmd/Ctrl+Z 撤销），
 * 步骤经 callbacks 回调渲染，最终返回带「如何接入真实 AI」说明的答复。
 */
export async function runSimulatedDocumentAgent(
  options: RunSimulatedAgentOptions
): Promise<DocumentAgentResult> {
  const { editor, instruction, signal, callbacks = {} } = options

  // 先「读取文档」一步，观感与真实 agent 一致
  await sleep(900, signal)
  const read = getDocumentTool('read_document')!
  callbacks.onToolCall?.('read_document', {})
  const readResult = read.execute(editor, {})
  callbacks.onToolResult?.('read_document', readResult, false)

  let toolCallCount = 1
  const steps = planSteps(editor, instruction)

  for (const step of steps) {
    await sleep(1300, signal)
    if (editor.isDestroyed) throw new Error('Editor was destroyed while the agent was running.')
    const tool = getDocumentTool(step.tool)
    if (!tool) continue
    callbacks.onToolCall?.(step.tool, step.args)
    toolCallCount++
    try {
      const result = tool.execute(editor, step.args)
      callbacks.onToolResult?.(step.tool, result, false)
    } catch (error) {
      // 演示模式尽量不失败：任何脚本失败都回退为插入演示段落
      callbacks.onToolResult?.(step.tool, String(error), true)
      const fallback = getDocumentTool('insert_blocks')!
      const result = fallback.execute(editor, {
        position: 'documentEnd',
        html: `<p>${t('aiChat.demo.paragraph')}</p>`,
      })
      callbacks.onToolCall?.('insert_blocks', {})
      toolCallCount++
      callbacks.onToolResult?.('insert_blocks', result, false)
    }
  }

  // 编辑完成后稍作停留，让接管遮罩/光标的收尾观感自然
  await sleep(1200, signal)
  const finalText = t('aiChat.demo.done')
  callbacks.onAssistantMessage?.(finalText)
  return { finalText, toolCallCount }
}

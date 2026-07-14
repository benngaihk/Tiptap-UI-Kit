<template>
  <Teleport to="body">
    <!-- 悬浮启动按钮 -->
    <button
      v-if="!open"
      class="ai-chat-launcher"
      type="button"
      :title="t('aiChat.title')"
      :aria-label="t('aiChat.title')"
      @click="open = true"
    >
      <ThunderboltOutlined />
      <span class="ai-chat-launcher__label">AI</span>
    </button>

    <!-- 聊天面板 -->
    <Transition name="ai-chat-slide">
      <div v-if="open" class="ai-chat-panel" role="dialog" :aria-label="t('aiChat.title')">
        <div class="ai-chat-panel__header">
          <span class="ai-chat-panel__title">
            <ThunderboltOutlined />
            {{ t('aiChat.title') }}
          </span>
          <div class="ai-chat-panel__actions">
            <button
              class="ai-chat-panel__icon-btn"
              type="button"
              :title="t('aiChat.settings')"
              @click="showSettings = true"
            >
              <SettingOutlined />
            </button>
            <button
              class="ai-chat-panel__icon-btn"
              type="button"
              :title="t('aiChat.close')"
              @click="open = false"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>

        <div ref="messagesRef" class="ai-chat-panel__messages">
          <div v-if="messages.length === 0" class="ai-chat-panel__welcome">
            {{ t('aiChat.welcome') }}
          </div>

          <template v-for="(msg, i) in messages" :key="i">
            <div v-if="msg.type === 'user'" class="ai-chat-msg ai-chat-msg--user">
              {{ msg.text }}
            </div>
            <div v-else-if="msg.type === 'assistant'" class="ai-chat-msg ai-chat-msg--assistant">
              {{ msg.text }}
              <button
                v-if="msg.showConfigure"
                class="ai-chat-panel__configure-btn"
                type="button"
                @click="showSettings = true"
              >
                {{ t('aiChat.configure') }}
              </button>
            </div>
            <div
              v-else-if="msg.type === 'tool'"
              class="ai-chat-step"
              :class="{ 'ai-chat-step--error': msg.isError }"
            >
              <component :is="msg.isError ? CloseCircleOutlined : CheckCircleOutlined" />
              {{ msg.text }}
            </div>
            <div v-else class="ai-chat-msg ai-chat-msg--error">
              {{ msg.text }}
              <button
                v-if="msg.showConfigure"
                class="ai-chat-panel__configure-btn"
                type="button"
                @click="showSettings = true"
              >
                {{ t('aiChat.configure') }}
              </button>
            </div>
          </template>

          <div v-if="running" class="ai-chat-step ai-chat-step--running">
            <LoadingOutlined spin />
            {{ t('aiChat.running') }}
          </div>
        </div>

        <div class="ai-chat-panel__input-area">
          <textarea
            ref="inputRef"
            v-model="input"
            class="ai-chat-panel__input"
            :placeholder="t('aiChat.placeholder')"
            :disabled="running"
            rows="2"
            @keydown.enter.exact="onEnterKey"
          />
          <button
            v-if="running"
            class="ai-chat-panel__send ai-chat-panel__send--stop"
            type="button"
            @click="stop"
          >
            {{ t('aiChat.stop') }}
          </button>
          <button
            v-else
            class="ai-chat-panel__send"
            type="button"
            :disabled="!input.trim() || !editor"
            @click="send"
          >
            {{ t('aiChat.send') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- AI 设置弹窗（复用现有组件） -->
    <AiSettingsModal v-model:open="showSettings" />
  </Teleport>
</template>

<script setup lang="ts">
/**
 * AiChatPanel - AI 文档助手聊天面板
 * @description 用户以自然语言描述需求（「帮我在末尾加一个 3x3 表格」「把第二段润色一下」），
 * AI 通过 tool-use 循环直接编辑当前文档。悬浮于编辑器右下角，自带启动按钮。
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Editor } from '@tiptap/core'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue'
import { t, useI18n } from '@/locales'
import AiSettingsModal from '../components/AiSettingsModal.vue'
import { runDocumentAgent, AgentNotConfiguredError } from './agentLoop'
import { runSimulatedDocumentAgent } from './simulatedAgent'

interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

const { locale } = useI18n()

// ===== 面板状态 =====
const open = ref(false)
const showSettings = ref(false)
const running = ref(false)
const input = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

interface ChatItem {
  type: 'user' | 'assistant' | 'tool' | 'error'
  text: string
  isError?: boolean
  showConfigure?: boolean
}

const messages = ref<ChatItem[]>([])

let abortController: AbortController | null = null

// ===== 工具名 → 本地化步骤文案 =====
function toolLabel(name: string): string {
  const key = `aiChat.tools.${name}`
  const label = t(key)
  return label === key ? name : label
}

// ===== 自动滚动到底部 =====
async function scrollToBottom() {
  await nextTick()
  const el = messagesRef.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await scrollToBottom()
    inputRef.value?.focus()
  }
})

/**
 * 演示模式回退：未配置真实 AI 时本地模拟执行指令
 * （真实编辑文档 + 步骤回放），结尾附「如何接入真实 AI」的指引与配置入口
 */
async function runDemoFallback(instruction: string) {
  if (!editor.value) {
    messages.value.push({ type: 'error', text: t('aiChat.notConfigured'), showConfigure: true })
    return
  }
  try {
    const demo = await runSimulatedDocumentAgent({
      editor: editor.value,
      instruction,
      signal: abortController?.signal,
      callbacks: {
        onToolResult: (name, _result, isError) => {
          messages.value.push({ type: 'tool', text: toolLabel(name), isError })
          scrollToBottom()
        },
      },
    })
    messages.value.push({ type: 'assistant', text: demo.finalText, showConfigure: true })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      messages.value.push({ type: 'error', text: t('aiChat.stopped') })
    } else {
      messages.value.push({ type: 'error', text: t('aiChat.notConfigured'), showConfigure: true })
    }
  }
}

// ===== 发送 =====
async function send() {
  const instruction = input.value.trim()
  if (!instruction || running.value || !editor.value) return

  // 多轮上下文：只带 user/assistant 文本轮次，最近 8 条（在 push 本次指令前构造，不含本条）
  const history = messages.value
    .filter((m) => m.type === 'user' || m.type === 'assistant')
    .slice(-8)
    .map((m) => ({ role: m.type as 'user' | 'assistant', content: m.text }))

  input.value = ''
  messages.value.push({ type: 'user', text: instruction })
  running.value = true
  abortController = new AbortController()
  await scrollToBottom()

  try {
    const result = await runDocumentAgent({
      editor: editor.value,
      instruction,
      history,
      signal: abortController.signal,
      locale: locale.value,
      callbacks: {
        onToolResult: (name, _result, isError) => {
          messages.value.push({ type: 'tool', text: toolLabel(name), isError })
          scrollToBottom()
        },
      },
    })

    if (result.finalText) {
      messages.value.push({ type: 'assistant', text: result.finalText })
    } else if (result.toolCallCount > 0) {
      messages.value.push({ type: 'assistant', text: t('aiChat.doneNoSummary') })
    } else {
      messages.value.push({ type: 'error', text: t('aiChat.emptyResponse') })
    }
  } catch (error) {
    if (error instanceof AgentNotConfiguredError) {
      // 未配置真实 AI：走演示模式（与续写/润色等功能的 simulate 惯例一致）——
      // 用本地脚本真实编辑文档，让访客先体验效果；真实 Key 由集成方在工程中绑定
      await runDemoFallback(instruction)
    } else if (error instanceof DOMException && error.name === 'AbortError') {
      messages.value.push({ type: 'error', text: t('aiChat.stopped') })
    } else {
      const detail = error instanceof Error ? error.message : String(error)
      messages.value.push({ type: 'error', text: `${t('aiChat.error')}: ${detail}` })
    }
  } finally {
    running.value = false
    abortController = null
    await scrollToBottom()
    inputRef.value?.focus()
  }
}

function stop() {
  abortController?.abort()
}

// 面板卸载（编辑器销毁/路由切换）时中止仍在运行的 agent，避免后台继续消耗 API
onBeforeUnmount(() => {
  abortController?.abort()
})

/** Enter 发送；中文/日文输入法组合期间的回车（选词确认）不触发 */
function onEnterKey(e: KeyboardEvent) {
  if (e.isComposing || e.keyCode === 229) return
  e.preventDefault()
  send()
}
</script>

<style scoped>
/* ===== 启动按钮 ===== */
.ai-chat-launcher {
  position: fixed;
  right: 20px;
  bottom: 72px;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 999px;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.ai-chat-launcher:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.24);
}

/* ===== 面板 ===== */
.ai-chat-panel {
  position: fixed;
  right: 20px;
  bottom: 72px;
  z-index: 950;
  display: flex;
  flex-direction: column;
  width: 360px;
  max-width: calc(100vw - 40px);
  height: 480px;
  max-height: calc(100vh - 120px);
  border: 1px solid var(--tiptap-border, #e5e7eb);
  border-radius: 12px;
  background: var(--tiptap-bg, #ffffff);
  color: var(--tiptap-text, #1f2937);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.ai-chat-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--tiptap-border, #e5e7eb);
  background: var(--tiptap-bg-secondary, #f9fafb);
}

.ai-chat-panel__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.ai-chat-panel__actions {
  display: flex;
  gap: 4px;
}

.ai-chat-panel__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--tiptap-text-secondary, #6b7280);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.ai-chat-panel__icon-btn:hover {
  background: var(--tiptap-toolbar-btn-hover, #e8e8e8);
  color: var(--tiptap-text, #1f2937);
}

/* ===== 消息区 ===== */
.ai-chat-panel__messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
}

.ai-chat-panel__welcome {
  padding: 12px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--tiptap-text-secondary, #6b7280);
  white-space: pre-line;
}

.ai-chat-msg {
  max-width: 90%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-chat-msg--user {
  align-self: flex-end;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
}

.ai-chat-msg--assistant {
  align-self: flex-start;
  background: var(--tiptap-bg-secondary, #f3f4f6);
}

.ai-chat-msg--error {
  align-self: flex-start;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.ai-chat-step {
  display: flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 2px 8px;
  font-size: 12px;
  color: var(--tiptap-text-secondary, #6b7280);
}

.ai-chat-step--error {
  color: #dc2626;
}

.ai-chat-step--running {
  color: var(--tiptap-primary, #3b82f6);
}

.ai-chat-panel__configure-btn {
  display: block;
  margin-top: 6px;
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

/* ===== 输入区 ===== */
.ai-chat-panel__input-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--tiptap-border, #e5e7eb);
}

.ai-chat-panel__input {
  flex: 1;
  resize: none;
  border: 1px solid var(--tiptap-border, #e5e7eb);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  line-height: 1.5;
  background: var(--tiptap-bg, #fff);
  color: var(--tiptap-text, #1f2937);
  outline: none;
  transition: border-color 0.15s ease;
}

.ai-chat-panel__input:focus {
  border-color: var(--tiptap-primary, #3b82f6);
}

.ai-chat-panel__send {
  flex-shrink: 0;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.ai-chat-panel__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-chat-panel__send--stop {
  background: #dc2626;
}

/* ===== 出入场动画 ===== */
.ai-chat-slide-enter-active,
.ai-chat-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ai-chat-slide-enter-from,
.ai-chat-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* 暗色模式无需单独覆盖：面板全部取 --tiptap-* 变量，
   变量在 :root[data-theme="dark"] 上已翻转，Teleport 到 body 后仍继承生效 */
</style>

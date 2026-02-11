<template>
  <div class="auto-demo" v-if="visible">
    <!-- 半透明遮罩 + 控制按钮 -->
    <div class="auto-demo__controls">
      <button v-if="!isRunning && !isFinished" class="auto-demo__btn auto-demo__btn--play" @click="startDemo">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
        <span>{{ playLabel }}</span>
      </button>
      <button v-if="isRunning" class="auto-demo__btn auto-demo__btn--stop" @click="stopDemo">
        <svg viewBox="0 0 24 24" width="16" height="16"><rect fill="currentColor" x="6" y="6" width="12" height="12" rx="1"/></svg>
        <span>{{ stopLabel }}</span>
      </button>
      <button v-if="isFinished" class="auto-demo__btn auto-demo__btn--replay" @click="replayDemo">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        <span>{{ replayLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * EditorAutoDemo - 编辑器自动化演示组件
 * @description 模拟用户操作编辑器的完整工作流，用于产品展示
 */
import { ref, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/core'

interface Props {
  /** 编辑器实例获取函数 */
  getEditor: () => Editor | null
  /** 是否显示 */
  visible?: boolean
  /** 打字速度（毫秒/字符） */
  typingSpeed?: number
  /** 按钮文案 */
  playLabel?: string
  stopLabel?: string
  replayLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  typingSpeed: 40,
  playLabel: 'Watch Demo',
  stopLabel: 'Stop',
  replayLabel: 'Replay',
})

const emit = defineEmits<{
  start: []
  stop: []
  finish: []
}>()

const isRunning = ref(false)
const isFinished = ref(false)
let abortController: AbortController | null = null

// ===== 核心工具函数 =====

/** 延迟 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

/** 逐字输入文本 */
async function typeText(editor: Editor, text: string, speed: number, signal: AbortSignal) {
  for (const char of text) {
    signal.throwIfAborted()
    editor.commands.insertContent(char)
    await delay(speed, signal)
  }
}

/** 等待一小段时间（模拟思考） */
async function pause(ms: number, signal: AbortSignal) {
  await delay(ms, signal)
}

// ===== 演示脚本：写一篇工作日报 =====

async function runDemoScript(editor: Editor, signal: AbortSignal) {
  const speed = props.typingSpeed

  // 清空编辑器
  editor.commands.clearContent()
  await pause(500, signal)

  // 1. 输入标题
  editor.commands.setHeading({ level: 1 })
  await typeText(editor, 'Work Daily Report - Feb 11, 2026', speed, signal)
  await pause(400, signal)

  // 换行 → 正文
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  // 2. 工作概述
  editor.commands.setHeading({ level: 2 })
  await typeText(editor, 'Summary', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()

  await typeText(editor, 'Today was a productive day. Completed the frontend feature development and fixed 3 bugs reported by QA team.', speed, signal)
  await pause(400, signal)
  editor.commands.enter()
  editor.commands.enter()

  // 3. 已完成工作（有序列表）
  editor.commands.setHeading({ level: 2 })
  await typeText(editor, 'Completed Tasks', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  // 切换到有序列表
  editor.commands.toggleOrderedList()
  await typeText(editor, 'Implemented user authentication module', speed, signal)
  await pause(200, signal)

  // 选中 "authentication" 并加粗
  const authPos = editor.state.doc.textContent.lastIndexOf('authentication')
  if (authPos >= 0) {
    const from = authPos + 1
    editor.commands.setTextSelection({ from, to: from + 'authentication'.length })
    editor.commands.toggleBold()
    await pause(300, signal)
    // 取消选区，移到行尾
    editor.commands.setTextSelection(editor.state.doc.content.size - 1)
  }

  editor.commands.enter()
  await typeText(editor, 'Fixed responsive layout issues on mobile devices', speed, signal)
  await pause(200, signal)

  editor.commands.enter()
  await typeText(editor, 'Code review for pull request #42', speed, signal)
  await pause(200, signal)

  editor.commands.enter()
  await typeText(editor, 'Updated API documentation', speed, signal)
  await pause(300, signal)

  // 退出列表
  editor.commands.enter()
  editor.commands.enter()

  // 4. 遇到的问题（引用块）
  editor.commands.setHeading({ level: 2 })
  await typeText(editor, 'Issues & Blockers', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  editor.commands.setBlockquote()
  await typeText(editor, 'Performance bottleneck found in the data table component when rendering 10,000+ rows. Need to implement virtual scrolling.', speed, signal)
  await pause(400, signal)

  // 退出引用块
  editor.commands.enter()
  editor.commands.enter()

  // 5. 明日计划（任务列表）
  editor.commands.setHeading({ level: 2 })
  await typeText(editor, 'Tomorrow Plan', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  // 无序列表
  editor.commands.toggleBulletList()

  await typeText(editor, 'Implement virtual scrolling for data tables', speed, signal)
  await pause(200, signal)

  editor.commands.enter()
  await typeText(editor, 'Write unit tests for auth module', speed, signal)
  await pause(200, signal)

  editor.commands.enter()
  await typeText(editor, 'Sprint planning meeting at 10:00 AM', speed, signal)
  await pause(200, signal)

  // 退出列表
  editor.commands.enter()
  editor.commands.enter()

  // 6. 添加一个分隔线
  editor.commands.setHorizontalRule()
  await pause(300, signal)

  // 7. 添加代码片段
  editor.commands.setHeading({ level: 2 })
  await typeText(editor, 'Code Snippet', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  await typeText(editor, 'Key code change today:', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.enter()

  // 插入代码块
  editor.commands.setCodeBlock({ language: 'typescript' })
  const codeSnippet = `export async function authenticate(token: string) {
  const user = await verifyToken(token)
  if (!user) throw new AuthError('Invalid token')
  return { userId: user.id, role: user.role }
}`
  // 代码块里快速输入
  await typeText(editor, codeSnippet, speed / 2, signal)
  await pause(500, signal)

  // 退出代码块
  editor.commands.exitCode()
  editor.commands.enter()

  // 8. 结尾
  await typeText(editor, 'Overall progress: ', speed, signal)
  editor.commands.toggleBold()
  await typeText(editor, 'On Track', speed, signal)
  editor.commands.toggleBold()
  await typeText(editor, ' ✅', speed, signal)
  await pause(300, signal)
}

// ===== 控制函数 =====

async function startDemo() {
  const editor = props.getEditor()
  if (!editor) return

  isRunning.value = true
  isFinished.value = false
  abortController = new AbortController()
  emit('start')

  try {
    await runDemoScript(editor, abortController.signal)
    isFinished.value = true
    emit('finish')
  } catch (e: any) {
    if (e.name !== 'AbortError') {
      console.error('[EditorAutoDemo] Script error:', e)
    }
  } finally {
    isRunning.value = false
  }
}

function stopDemo() {
  abortController?.abort()
  isRunning.value = false
  emit('stop')
}

async function replayDemo() {
  isFinished.value = false
  await startDemo()
}

onBeforeUnmount(() => {
  abortController?.abort()
})

defineExpose({ startDemo, stopDemo, replayDemo })
</script>

<style scoped>
.auto-demo {
  position: relative;
}

.auto-demo__controls {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  justify-content: center;
}

.auto-demo__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.auto-demo__btn--play {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.auto-demo__btn--play:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.auto-demo__btn--stop {
  background: #ff4d4f;
  color: white;
}

.auto-demo__btn--stop:hover {
  background: #ff7875;
}

.auto-demo__btn--replay {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.3);
}

.auto-demo__btn--replay:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.4);
}
</style>

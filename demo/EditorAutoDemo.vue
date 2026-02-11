<template>
  <div class="auto-demo" v-if="visible">
    <!-- 控制按钮 -->
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

    <!-- 动画光标 (page-agent 风格: 平滑移动 + 点击涟漪) -->
    <Teleport to="body">
      <div v-show="cursorVisible" class="demo-cursor" :style="cursorStyle">
        <svg class="demo-cursor__arrow" width="16" height="22" viewBox="0 0 16 22" fill="none">
          <path d="M0.5 0.5L0.5 18L5 13L8.5 20.5L11 19.5L7.5 12L13 12L0.5 0.5Z"
                fill="black" stroke="white" stroke-width="1" stroke-linejoin="round"/>
        </svg>
        <div class="demo-cursor__ripple" :class="{ 'is-active': rippleActive }" :key="rippleKey"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * EditorAutoDemo - 增强版编辑器自动化演示
 * @description 结合 page-agent 的动画光标 + Maestro 的声明式动作，
 *              模拟真实用户操作编辑器的完整工作流
 */
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
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

// ===== 光标状态 (page-agent 风格) =====

const cursorVisible = ref(false)
const cursorX = ref(0)
const cursorY = ref(0)
const rippleActive = ref(false)
const rippleKey = ref(0)

const cursorStyle = computed(() => ({
  transform: `translate(${cursorX.value}px, ${cursorY.value}px)`,
}))

// ===== 基础工具 =====

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }, { once: true })
  })
}

async function pause(ms: number, signal: AbortSignal) {
  await delay(ms, signal)
}

// ===== 光标动画引擎 (参考 page-agent 的 easing + requestAnimationFrame) =====

/**
 * 平滑移动光标到目标位置
 * 使用 ease-in-out 缓动，距离自适应时长
 */
function moveCursorTo(x: number, y: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const startX = cursorX.value
    const startY = cursorY.value
    const dist = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2)
    // 距离越远时长越长，但限制在合理范围
    const duration = Math.min(Math.max(dist * 1.5, 200), 800)
    const startTime = performance.now()

    let rafId: number
    const onAbort = () => {
      cancelAnimationFrame(rafId)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal.addEventListener('abort', onAbort, { once: true })

    // ease-in-out cubic
    function ease(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
    }

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const e = ease(progress)

      cursorX.value = startX + (x - startX) * e
      cursorY.value = startY + (y - startY) * e

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        signal.removeEventListener('abort', onAbort)
        resolve()
      }
    }

    rafId = requestAnimationFrame(animate)
  })
}

/** 触发点击涟漪效果 */
async function triggerRipple(signal: AbortSignal) {
  rippleActive.value = false
  rippleKey.value++
  await nextTick()
  rippleActive.value = true
  await delay(350, signal)
  rippleActive.value = false
}

// ===== DOM 查询 (Maestro 风格的元素定位) =====

/** 图标名 → anticon class 映射 */
const ICON_MAP: Record<string, string> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strikethrough',
  orderedList: 'ordered-list',
  bulletList: 'unordered-list',
  code: 'code',
}

/**
 * 查找工具栏按钮
 * - 'h1'/'h2'/'h3' → 按文本内容查找 heading 按钮
 * - 'bold'/'italic'/... → 按图标 class 查找
 * - 其他 → 作为 CSS 选择器查找
 */
function findToolbarButton(id: string): HTMLElement | null {
  // Heading 按钮: 按 data-level 或文本内容
  if (/^h[1-6]$/.test(id)) {
    const level = id.slice(1)
    // 先尝试 data-level
    const byData = document.querySelector(`[data-level="${level}"] .tt-toolbar-button`) as HTMLElement
      || document.querySelector(`.tt-toolbar-button[data-level="${level}"]`) as HTMLElement
    if (byData) return byData

    // 回退: 按文本内容查找
    const buttons = document.querySelectorAll('.tt-toolbar-button')
    for (const btn of buttons) {
      if (btn.textContent?.trim() === `H${level}`) return btn as HTMLElement
    }
    return null
  }

  // 图标按钮
  if (ICON_MAP[id]) {
    const icon = document.querySelector(`.anticon-${ICON_MAP[id]}`)
    return icon?.closest('.tt-toolbar-button') as HTMLElement | null
  }

  // CSS 选择器
  return document.querySelector(id) as HTMLElement | null
}

/** 获取元素中心的视口坐标 */
function getCenter(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

// ===== 声明式动作 (Maestro 风格 API) =====

/**
 * tapOn - 移动光标到工具栏按钮 → 悬停效果 → 点击涟漪 → 执行命令
 * @param buttonId 按钮标识 (如 'h1', 'bold', 'orderedList')
 * @param signal AbortSignal
 * @param action 实际执行的编辑器命令 (保证可靠性)
 */
async function tapOn(buttonId: string, signal: AbortSignal, action?: () => void) {
  signal.throwIfAborted()
  const el = findToolbarButton(buttonId)

  if (el) {
    const { x, y } = getCenter(el)
    await moveCursorTo(x, y, signal)

    // 悬停效果
    el.style.setProperty('background', 'var(--menu-btn-hover-bg, #f5f5f5)')
    await pause(120, signal)

    // 按下效果 + 涟漪
    el.style.setProperty('background', '#ddd')
    await triggerRipple(signal)
    el.style.removeProperty('background')
  }

  // 执行实际命令
  action?.()
  await pause(100, signal)
}

/**
 * moveToEditor - 移动光标到编辑器当前光标位置附近
 */
async function moveToEditor(editor: Editor, signal: AbortSignal) {
  try {
    const { from } = editor.state.selection
    const coords = editor.view.coordsAtPos(from)
    await moveCursorTo(coords.left + 4, coords.top - 4, signal)
  } catch {
    // 回退: 移到编辑器中心
    const editorEl = editor.view.dom
    const { x, y } = getCenter(editorEl)
    await moveCursorTo(x, y, signal)
  }
}

/**
 * typeText - 逐字输入并让光标跟随
 */
async function typeText(editor: Editor, text: string, speed: number, signal: AbortSignal) {
  for (let i = 0; i < text.length; i++) {
    signal.throwIfAborted()
    editor.commands.insertContent(text[i])

    // 每 8 个字符让光标跟随编辑器光标
    if (i % 8 === 0) {
      try {
        const { from } = editor.state.selection
        const coords = editor.view.coordsAtPos(from)
        cursorX.value += (coords.left + 4 - cursorX.value) * 0.25
        cursorY.value += (coords.top - 4 - cursorY.value) * 0.25
      } catch { /* ignore */ }
    }

    await delay(speed, signal)
  }
}

/**
 * selectText - 选中文本并移动光标到选区位置
 */
async function selectText(editor: Editor, searchText: string, signal: AbortSignal) {
  const pos = editor.state.doc.textContent.lastIndexOf(searchText)
  if (pos < 0) return

  const from = pos + 1
  const to = from + searchText.length

  // 移动光标到文本位置
  try {
    const coords = editor.view.coordsAtPos(from)
    await moveCursorTo(coords.left, coords.top, signal)
    await pause(150, signal)
  } catch { /* ignore */ }

  editor.commands.setTextSelection({ from, to })
  await pause(200, signal)
}

// ===== 演示脚本 =====

async function runDemoScript(editor: Editor, signal: AbortSignal) {
  const speed = props.typingSpeed

  // 初始化: 显示光标
  editor.commands.clearContent()
  cursorX.value = window.innerWidth / 2
  cursorY.value = window.innerHeight / 2
  cursorVisible.value = true
  await pause(300, signal)

  // ===== 1. 标题 =====
  await tapOn('h1', signal, () => editor.commands.setHeading({ level: 1 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Work Daily Report - Feb 11, 2026', speed, signal)
  await pause(400, signal)

  // ===== 2. Summary =====
  editor.commands.enter()
  await tapOn('h2', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Summary', speed, signal)
  await pause(300, signal)

  editor.commands.enter()
  editor.commands.setParagraph()
  await moveToEditor(editor, signal)
  await typeText(editor, 'Today was a productive day. Completed the frontend feature development and fixed 3 bugs reported by QA team.', speed, signal)
  await pause(400, signal)
  editor.commands.enter()
  editor.commands.enter()

  // ===== 3. Completed Tasks (有序列表) =====
  await tapOn('h2', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Completed Tasks', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  // 点击有序列表按钮
  await tapOn('orderedList', signal, () => editor.commands.toggleOrderedList())
  await moveToEditor(editor, signal)
  await typeText(editor, 'Implemented user authentication module', speed, signal)
  await pause(200, signal)

  // 选中 "authentication" → 点击加粗按钮
  await selectText(editor, 'authentication', signal)
  await tapOn('bold', signal, () => editor.commands.toggleBold())
  await pause(200, signal)

  // 取消选区，继续输入
  editor.commands.setTextSelection(editor.state.doc.content.size - 1)
  editor.commands.enter()
  await moveToEditor(editor, signal)
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

  // ===== 4. Issues & Blockers (引用块) =====
  await tapOn('h2', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Issues & Blockers', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  editor.commands.setBlockquote()
  await moveToEditor(editor, signal)
  await typeText(editor, 'Performance bottleneck found in the data table component when rendering 10,000+ rows. Need to implement virtual scrolling.', speed, signal)
  await pause(400, signal)

  // 退出引用块
  editor.commands.enter()
  editor.commands.enter()

  // ===== 5. Tomorrow Plan (无序列表) =====
  await tapOn('h2', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Tomorrow Plan', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  // 点击无序列表按钮
  await tapOn('bulletList', signal, () => editor.commands.toggleBulletList())
  await moveToEditor(editor, signal)
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

  // ===== 6. 分隔线 =====
  editor.commands.setHorizontalRule()
  await pause(300, signal)

  // ===== 7. 代码片段 =====
  await tapOn('h2', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Code Snippet', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.setParagraph()
  await pause(200, signal)

  await moveToEditor(editor, signal)
  await typeText(editor, 'Key code change today:', speed, signal)
  await pause(300, signal)
  editor.commands.enter()
  editor.commands.enter()

  // 代码块
  editor.commands.setCodeBlock({ language: 'typescript' })
  await moveToEditor(editor, signal)
  const codeSnippet = `export async function authenticate(token: string) {
  const user = await verifyToken(token)
  if (!user) throw new AuthError('Invalid token')
  return { userId: user.id, role: user.role }
}`
  await typeText(editor, codeSnippet, speed / 2, signal)
  await pause(500, signal)

  // 退出代码块
  editor.commands.exitCode()
  editor.commands.enter()

  // ===== 8. 结尾 =====
  await moveToEditor(editor, signal)
  await typeText(editor, 'Overall progress: ', speed, signal)

  // 点击加粗 → 输入 "On Track" → 再点击取消加粗
  await tapOn('bold', signal, () => editor.commands.toggleBold())
  await moveToEditor(editor, signal)
  await typeText(editor, 'On Track', speed, signal)
  await tapOn('bold', signal, () => editor.commands.toggleBold())

  await moveToEditor(editor, signal)
  await typeText(editor, ' ✅', speed, signal)
  await pause(500, signal)

  // 演示完成，隐藏光标
  cursorVisible.value = false
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
    cursorVisible.value = false
    rippleActive.value = false
  }
}

function stopDemo() {
  abortController?.abort()
  isRunning.value = false
  cursorVisible.value = false
  emit('stop')
}

async function replayDemo() {
  isFinished.value = false
  await startDemo()
}

onBeforeUnmount(() => {
  abortController?.abort()
  cursorVisible.value = false
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

<style>
/* 光标样式 (不使用 scoped，因为 Teleport 到 body) */
.demo-cursor {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999;
  will-change: transform;
}

.demo-cursor__arrow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}

.demo-cursor__ripple {
  position: absolute;
  top: -12px;
  left: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.3) 100%);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.demo-cursor__ripple.is-active {
  animation: demo-cursor-ripple 0.35s ease-out forwards;
}

@keyframes demo-cursor-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>

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
 *              模拟真实用户操作编辑器，展示所有特色功能（含 AI 写作演示）
 */
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/core'

interface Props {
  getEditor: () => Editor | null
  visible?: boolean
  typingSpeed?: number
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

// ===== 光标状态 =====

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

// ===== 光标动画引擎 =====

function moveCursorTo(x: number, y: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const startX = cursorX.value
    const startY = cursorY.value
    const dist = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2)
    const duration = Math.min(Math.max(dist * 1.5, 200), 800)
    const startTime = performance.now()

    let rafId: number
    const onAbort = () => {
      cancelAnimationFrame(rafId)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal.addEventListener('abort', onAbort, { once: true })

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

async function triggerRipple(signal: AbortSignal) {
  rippleActive.value = false
  rippleKey.value++
  await nextTick()
  rippleActive.value = true
  await delay(350, signal)
  rippleActive.value = false
}

// ===== DOM 查询 =====

/** 图标名 → anticon class */
const ICON_MAP: Record<string, string> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strikethrough',
  orderedList: 'ordered-list',
  bulletList: 'unordered-list',
  code: 'code',
  undo: 'undo',
  redo: 'redo',
  link: 'link',
  table: 'table',
  superscript: 'sort-descending',
  subscript: 'sort-ascending',
  heading: 'font-size',
  math: 'function',
}

/**
 * 查找工具栏按钮 (支持直接按钮 + 下拉按钮 + AI 按钮)
 */
function findToolbarButton(id: string): HTMLElement | null {
  // AI 按钮
  if (id === 'ai') {
    return document.querySelector('.ai-toolbar-trigger') as HTMLElement | null
  }

  // Heading 按钮: 按 data-level 或文本内容
  if (/^h[1-6]$/.test(id)) {
    const level = id.slice(1)
    const byData = document.querySelector(`[data-level="${level}"] .tt-toolbar-button`)
      || document.querySelector(`.tt-toolbar-button[data-level="${level}"]`)
    if (byData) return byData as HTMLElement
    const buttons = document.querySelectorAll('.tt-toolbar-button')
    for (const btn of buttons) {
      if (btn.textContent?.trim() === `H${level}`) return btn as HTMLElement
    }
    return null
  }

  // Align 下拉按钮 (图标随状态变化)
  if (id === 'align') {
    for (const cls of ['align-left', 'align-center', 'align-right', 'menu']) {
      const icon = document.querySelector(`.anticon-${cls}`)
      const btn = icon?.closest('.tt-dropdown-btn') as HTMLElement
      if (btn) return btn
    }
    return null
  }

  // 图标按钮 (同时搜索直接按钮和下拉按钮)
  if (ICON_MAP[id]) {
    const icon = document.querySelector(`.anticon-${ICON_MAP[id]}`)
    if (icon) {
      return (icon.closest('.tt-toolbar-button') || icon.closest('.tt-dropdown-btn')) as HTMLElement | null
    }
    return null
  }

  return document.querySelector(id) as HTMLElement | null
}

function getCenter(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

// ===== 文本位置查找 (ProseMirror) =====

/**
 * 在文档中查找文本的最后一次出现位置
 */
function findLastTextPos(editor: Editor, searchText: string): { from: number; to: number } | null {
  let lastMatch: { from: number; to: number } | null = null
  editor.state.doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      let idx = -1
      let start = 0
      while ((idx = node.text.indexOf(searchText, start)) !== -1) {
        lastMatch = { from: pos + idx, to: pos + idx + searchText.length }
        start = idx + 1
      }
    }
  })
  return lastMatch
}

// ===== 声明式动作 (Maestro 风格) =====

async function tapOn(buttonId: string, signal: AbortSignal, action?: () => void) {
  signal.throwIfAborted()
  const el = findToolbarButton(buttonId)

  if (el) {
    const { x, y } = getCenter(el)
    await moveCursorTo(x, y, signal)

    el.style.setProperty('background', 'var(--menu-btn-hover-bg, #f5f5f5)')
    await pause(120, signal)

    el.style.setProperty('background', '#ddd')
    await triggerRipple(signal)
    el.style.removeProperty('background')
  }

  action?.()
  await pause(100, signal)
}

async function moveToEditor(editor: Editor, signal: AbortSignal) {
  try {
    const { from } = editor.state.selection
    const coords = editor.view.coordsAtPos(from)
    await moveCursorTo(coords.left + 4, coords.top - 4, signal)
  } catch {
    const editorEl = editor.view.dom
    const { x, y } = getCenter(editorEl)
    await moveCursorTo(x, y, signal)
  }
}

async function typeText(editor: Editor, text: string, speed: number, signal: AbortSignal) {
  for (let i = 0; i < text.length; i++) {
    signal.throwIfAborted()
    editor.commands.insertContent(text[i])

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
 * 模拟 AI 流式输出 (变速打字 + 句尾停顿)
 */
async function simulateAiStream(editor: Editor, text: string, signal: AbortSignal) {
  for (let i = 0; i < text.length; i++) {
    signal.throwIfAborted()
    editor.commands.insertContent(text[i])

    const char = text[i]
    let charDelay = 10 + Math.random() * 15
    if (char === '.' || char === '!' || char === '?') charDelay = 50
    else if (char === ',') charDelay = 25
    else if (char === ' ') charDelay = 5

    // 偶尔突发 (无延迟)
    if (Math.random() < 0.3) charDelay = 0

    if (i % 12 === 0) {
      try {
        const { from } = editor.state.selection
        const coords = editor.view.coordsAtPos(from)
        cursorX.value += (coords.left + 4 - cursorX.value) * 0.25
        cursorY.value += (coords.top - 4 - cursorY.value) * 0.25
      } catch { /* ignore */ }
    }

    if (charDelay > 0) await delay(charDelay, signal)
  }
}

/**
 * 选择文本 (基于 ProseMirror 节点精准查找)
 */
async function selectText(editor: Editor, searchText: string, signal: AbortSignal) {
  const match = findLastTextPos(editor, searchText)
  if (!match) return

  try {
    const coords = editor.view.coordsAtPos(match.from)
    await moveCursorTo(coords.left, coords.top, signal)
    await pause(150, signal)
  } catch { /* ignore */ }

  editor.commands.setTextSelection(match)
  await pause(200, signal)
}

/**
 * 在上下文中选择子文本 (例如: 在 "mc2" 中选中 "2")
 */
async function selectSubtext(editor: Editor, context: string, target: string, signal: AbortSignal) {
  let lastMatch: { from: number; to: number } | null = null
  editor.state.doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      const ctxIdx = node.text.lastIndexOf(context)
      if (ctxIdx !== -1) {
        const tgtIdx = context.indexOf(target)
        if (tgtIdx !== -1) {
          const from = pos + ctxIdx + tgtIdx
          lastMatch = { from, to: from + target.length }
        }
      }
    }
  })

  if (!lastMatch) return

  try {
    const coords = editor.view.coordsAtPos(lastMatch.from)
    await moveCursorTo(coords.left, coords.top, signal)
    await pause(150, signal)
  } catch { /* ignore */ }

  editor.commands.setTextSelection(lastMatch)
  await pause(200, signal)
}

function newLine(editor: Editor) {
  editor.commands.enter()
  editor.commands.setParagraph()
}

function exitBlock(editor: Editor) {
  editor.commands.enter()
  editor.commands.enter()
}

function moveCursorToEnd(editor: Editor) {
  editor.commands.setTextSelection(editor.state.doc.content.size - 1)
}

// ===== 演示脚本: 全功能展示 (含 AI) =====

async function runDemoScript(editor: Editor, signal: AbortSignal) {
  const speed = props.typingSpeed
  const fast = Math.max(Math.floor(speed / 2), 15)

  editor.commands.clearContent()
  cursorX.value = window.innerWidth / 2
  cursorY.value = window.innerHeight / 2
  cursorVisible.value = true
  await pause(400, signal)

  // ===== 1. 标题 + 居中对齐 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 1 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Tiptap UI Kit - Feature Showcase', speed, signal)
  await pause(300, signal)

  await tapOn('align', signal, () => editor.commands.setTextAlign('center'))
  await pause(400, signal)

  editor.commands.enter()
  editor.commands.setParagraph()
  editor.commands.setTextAlign('left')
  await pause(200, signal)

  // ===== 2. 文本格式 (先输入，再选中格式化) =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Rich Text Formatting', speed, signal)
  await pause(300, signal)
  newLine(editor)

  await moveToEditor(editor, signal)
  await typeText(editor, 'This editor supports bold, italic, underline and strikethrough styles.', speed, signal)
  await pause(400, signal)

  // 选中每个关键词并格式化
  await selectText(editor, 'bold', signal)
  await tapOn('bold', signal, () => editor.commands.toggleBold())

  await selectText(editor, 'italic', signal)
  await tapOn('italic', signal, () => editor.commands.toggleItalic())

  await selectText(editor, 'underline', signal)
  await tapOn('underline', signal, () => {
    ;(editor.chain().focus() as any).toggleUnderline().run()
  })

  await selectText(editor, 'strikethrough', signal)
  await tapOn('strike', signal, () => editor.commands.toggleStrike())

  await pause(400, signal)
  moveCursorToEnd(editor)
  exitBlock(editor)

  // ===== 3. 有序列表 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Feature Highlights', speed, signal)
  await pause(300, signal)
  newLine(editor)

  await tapOn('orderedList', signal, () => editor.commands.toggleOrderedList())
  await moveToEditor(editor, signal)
  await typeText(editor, '20+ pluggable toolbar features', speed, signal)
  editor.commands.enter()
  await typeText(editor, '5 theme presets: Word, Notion, GitHub, Typora, Default', speed, signal)
  editor.commands.enter()
  await typeText(editor, 'AI-powered writing with streaming support', speed, signal)
  await pause(300, signal)

  // 选中 "AI-powered" 并加粗
  await selectText(editor, 'AI-powered', signal)
  await tapOn('bold', signal, () => editor.commands.toggleBold())
  await pause(200, signal)
  moveCursorToEnd(editor)
  exitBlock(editor)

  // ===== 4. 上标 / 下标 (先输入，再选中格式化) =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Scientific Notation', speed, signal)
  await pause(300, signal)
  newLine(editor)

  // 输入公式文本
  await moveToEditor(editor, signal)
  await typeText(editor, "Einstein's equation: E = mc2", speed, signal)
  await pause(200, signal)

  // 选中 "mc2" 中的 "2"，应用上标
  await selectSubtext(editor, 'mc2', '2', signal)
  await tapOn('superscript', signal, () => editor.chain().focus().toggleSuperscript().run())

  moveCursorToEnd(editor)
  await moveToEditor(editor, signal)
  await typeText(editor, '    Water molecule: H2O', speed, signal)
  await pause(200, signal)

  // 选中 "H2O" 中的 "2"，应用下标
  await selectSubtext(editor, 'H2O', '2', signal)
  await tapOn('subscript', signal, () => editor.chain().focus().toggleSubscript().run())

  moveCursorToEnd(editor)
  await pause(400, signal)
  exitBlock(editor)

  // ===== 5. 表格 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Data Table', speed, signal)
  await pause(300, signal)
  newLine(editor)

  await tapOn('table', signal, () => {
    editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
  })
  await pause(400, signal)

  // 填充表头
  await moveToEditor(editor, signal)
  await typeText(editor, 'Feature', fast, signal)
  editor.commands.goToNextCell()
  await typeText(editor, 'Status', fast, signal)
  editor.commands.goToNextCell()
  await typeText(editor, 'Description', fast, signal)

  // 第 1 行
  editor.commands.goToNextCell()
  await moveToEditor(editor, signal)
  await typeText(editor, 'Rich Text', fast, signal)
  editor.commands.goToNextCell()
  await typeText(editor, '✅ Ready', fast, signal)
  editor.commands.goToNextCell()
  await typeText(editor, '20+ formats', fast, signal)

  // 第 2 行
  editor.commands.goToNextCell()
  await moveToEditor(editor, signal)
  await typeText(editor, 'AI Writing', fast, signal)
  editor.commands.goToNextCell()
  await typeText(editor, '✅ Ready', fast, signal)
  editor.commands.goToNextCell()
  await typeText(editor, 'Streaming output', fast, signal)
  await pause(500, signal)

  // 退出表格
  try {
    moveCursorToEnd(editor)
    editor.commands.enter()
  } catch { /* ignore */ }
  await pause(200, signal)

  // ===== 6. 代码块 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Code Block', speed, signal)
  await pause(300, signal)
  newLine(editor)

  await tapOn('code', signal, () => {
    editor.commands.setCodeBlock({ language: 'typescript' })
  })
  await moveToEditor(editor, signal)

  const codeSnippet = `import { Editor } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'

const editor = new Editor({
  extensions: [StarterKit],
  content: '<p>Hello Tiptap!</p>'
})`
  await typeText(editor, codeSnippet, fast, signal)
  await pause(500, signal)

  editor.commands.exitCode()
  editor.commands.enter()

  // ===== 7. 引用块 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Blockquote', speed, signal)
  await pause(300, signal)
  newLine(editor)

  editor.commands.setBlockquote()
  await moveToEditor(editor, signal)
  await typeText(editor, 'The best editor is one that gets out of your way and lets creativity flow.', speed, signal)
  await pause(400, signal)
  exitBlock(editor)

  // ===== 8. AI 写作演示 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'AI-Powered Writing', speed, signal)
  await pause(300, signal)
  newLine(editor)

  // 用户输入部分文本
  await moveToEditor(editor, signal)
  await typeText(editor, 'AI can enhance your writing workflow. Here is a live demo:', speed, signal)
  newLine(editor)
  await pause(200, signal)

  await moveToEditor(editor, signal)
  await typeText(editor, 'The future of content editing is', speed, signal)
  await pause(400, signal)

  // 移动到 AI 按钮并点击 (视觉效果)
  await tapOn('ai', signal)
  await pause(1200, signal) // AI "思考中"

  // 模拟 AI 流式输出
  await moveToEditor(editor, signal)
  const aiResponse = ' intelligent and adaptive. With AI integration, writers can generate content on the fly, polish their prose for clarity and style, translate seamlessly between languages, and get instant summaries of lengthy documents — all without leaving the editor.'
  await simulateAiStream(editor, aiResponse, signal)
  await pause(600, signal)

  newLine(editor)
  await pause(200, signal)
  await moveToEditor(editor, signal)
  await typeText(editor, 'AI features include: ', speed, signal)

  // 用粗体列出 AI 功能
  const aiFeatures = ['Continue Writing', 'Polish', 'Translate', 'Summarize', 'Custom Prompts']
  for (let i = 0; i < aiFeatures.length; i++) {
    const feature = aiFeatures[i]
    await typeText(editor, feature, fast, signal)
    if (i < aiFeatures.length - 1) {
      await typeText(editor, ' · ', fast, signal)
    }
  }
  await pause(300, signal)

  // 选中每个功能名加粗
  for (const feature of aiFeatures) {
    await selectText(editor, feature, signal)
    await tapOn('bold', signal, () => editor.commands.toggleBold())
  }

  await pause(400, signal)
  moveCursorToEnd(editor)
  exitBlock(editor)

  // ===== 9. 无序列表 =====
  await tapOn('heading', signal, () => editor.commands.setHeading({ level: 2 }))
  await moveToEditor(editor, signal)
  await typeText(editor, 'Tech Stack', speed, signal)
  await pause(300, signal)
  newLine(editor)

  await tapOn('bulletList', signal, () => editor.commands.toggleBulletList())
  await moveToEditor(editor, signal)
  await typeText(editor, 'Vue 3 + Tiptap 3 + TypeScript', speed, signal)
  editor.commands.enter()
  await typeText(editor, 'Light / Dark mode with 5 theme presets', speed, signal)
  editor.commands.enter()
  await typeText(editor, 'i18n: English, 简体中文, 繁體中文', speed, signal)
  editor.commands.enter()
  await typeText(editor, 'AI: Continue Writing, Polish, Translate, Summarize', speed, signal)
  await pause(300, signal)
  exitBlock(editor)

  // ===== 10. 分隔线 + 结尾 =====
  editor.commands.setHorizontalRule()
  await pause(300, signal)

  await moveToEditor(editor, signal)
  await typeText(editor, 'All features production-ready and fully customizable! ✅', speed, signal)
  await pause(300, signal)

  // 选中 "production-ready" 加粗
  await selectText(editor, 'production-ready', signal)
  await tapOn('bold', signal, () => editor.commands.toggleBold())
  await pause(600, signal)

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
/* 光标样式 (Teleport 到 body，不使用 scoped) */
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

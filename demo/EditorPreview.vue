<template>
  <div class="editor-preview" :data-theme="theme" ref="rootRef">
    <!-- Animated glow backdrop -->
    <div class="editor-preview__glow"></div>

    <div class="editor-preview__window" :class="{ 'is-entered': entered }">
      <!-- Window Title Bar -->
      <div class="editor-preview__titlebar">
        <div class="editor-preview__dots">
          <span class="dot dot--red"></span>
          <span class="dot dot--yellow"></span>
          <span class="dot dot--green"></span>
        </div>
        <div class="editor-preview__filename">
          <svg viewBox="0 0 16 16" width="12" height="12" style="opacity:0.5">
            <path fill="currentColor" d="M1 3.5A1.5 1.5 0 012.5 2h3.879a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 009.62 4H13.5A1.5 1.5 0 0115 5.5v7a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 12.5v-9z"/>
          </svg>
          document.docx
        </div>
        <div class="editor-preview__spacer"></div>
      </div>

      <!-- Fake Toolbar -->
      <div class="editor-preview__toolbar">
        <div class="toolbar-group">
          <span class="toolbar-btn" :class="{ 'glow': activeFormat === 'bold' }">B</span>
          <span class="toolbar-btn" :class="{ 'glow': activeFormat === 'italic' }">I</span>
          <span class="toolbar-btn">U</span>
          <span class="toolbar-btn">S</span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group">
          <span class="toolbar-btn" :class="{ 'glow': activeFormat === 'h1' }">H1</span>
          <span class="toolbar-btn" :class="{ 'glow': activeFormat === 'h2' }">H2</span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group">
          <span class="toolbar-btn icon-btn" :class="{ 'glow': activeFormat === 'list' }">
            <svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M2.5 4a.5.5 0 100-1 .5.5 0 000 1zM4 3.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM4 7.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM4 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM2.5 8a.5.5 0 100-1 .5.5 0 000 1zM2.5 12a.5.5 0 100-1 .5.5 0 000 1z"/></svg>
          </span>
          <span class="toolbar-btn icon-btn" :class="{ 'glow': activeFormat === 'quote' }">
            <svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M2 3h12v1H2V3zm2 3h8v1H4V6zm-2 3h12v1H2V9zm2 3h8v1H4v-1z"/></svg>
          </span>
          <span class="toolbar-btn icon-btn" :class="{ 'glow': activeFormat === 'code' }">
            <svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M5.854 4.146a.5.5 0 010 .708L2.707 8l3.147 3.146a.5.5 0 01-.708.708l-3.5-3.5a.5.5 0 010-.708l3.5-3.5a.5.5 0 01.708 0zm4.292 0a.5.5 0 00 0 .708L13.293 8l-3.147 3.146a.5.5 0 00.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 00-.708 0z"/></svg>
          </span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group">
          <span class="toolbar-btn ai-btn" :class="{ 'ai-pulse': activeFormat === 'ai' }">
            <svg viewBox="0 0 16 16" width="11" height="11"><path fill="currentColor" d="M8 1l1.545 4.955L14.5 7.5l-4.955 1.545L8 14l-1.545-4.955L1.5 7.5l4.955-1.545z"/></svg>
            AI
          </span>
        </div>
      </div>

      <!-- Editor Content Area -->
      <div class="editor-preview__content">
        <div class="content-inner">
          <TransitionGroup name="line-enter">
            <div
              v-for="(line, index) in visibleLines"
              :key="'line-' + line.id"
              class="content-line"
              :class="line.class"
            >
              <component :is="line.tag || 'div'" v-html="line.html"></component>
            </div>
          </TransitionGroup>
          <span class="cursor" :class="{ 'cursor--blink': !isTyping }"></span>
        </div>
      </div>
    </div>

    <!-- Floating Labels - Desktop -->
    <div class="editor-preview__labels editor-preview__labels--desktop">
      <div class="floating-label label--themes" :class="{ 'pop-in': entered }">
        <span class="floating-label__icon">
          <svg viewBox="0 0 16 16" width="14" height="14"><path fill="currentColor" d="M8 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm4.5 3a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3.5 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2 4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
        </span>
        <span class="floating-label__text">5 Themes</span>
      </div>
      <div class="floating-label label--ai" :class="{ 'pop-in': entered }" style="animation-delay: 0.2s">
        <span class="floating-label__icon">
          <svg viewBox="0 0 16 16" width="14" height="14"><path fill="currentColor" d="M8 1l1.545 4.955L14.5 7.5l-4.955 1.545L8 14l-1.545-4.955L1.5 7.5l4.955-1.545z"/></svg>
        </span>
        <span class="floating-label__text">AI Powered</span>
      </div>
      <div class="floating-label label--collab" :class="{ 'pop-in': entered }" style="animation-delay: 0.4s">
        <span class="floating-label__icon">
          <svg viewBox="0 0 16 16" width="14" height="14"><path fill="currentColor" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 100-6 3 3 0 000 6zM5.216 14A2.238 2.238 0 015 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 005 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>
        </span>
        <span class="floating-label__text">Realtime Collab</span>
      </div>
      <div class="floating-label label--word" :class="{ 'pop-in': entered }" style="animation-delay: 0.6s">
        <span class="floating-label__icon">
          <svg viewBox="0 0 16 16" width="14" height="14"><path fill="currentColor" d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zM9.5 3A1.5 1.5 0 008 1.5V3h1.5zm-2.394 6.966a.492.492 0 00-.062.037L5.5 13.25l-1.544-3.247a.497.497 0 00-.062-.037L3 6h1.073l.858 3.076L6.323 6h1.354l1.392 3.076L9.927 6H11l-.894 3.966a.492.492 0 00-.062.037L8.5 13.25l-1.394-3.284z"/></svg>
        </span>
        <span class="floating-label__text">Word Export</span>
      </div>
    </div>

    <!-- Floating Labels - Mobile (horizontal strip below editor) -->
    <div class="editor-preview__labels editor-preview__labels--mobile">
      <div class="mobile-label" v-for="label in mobileLabels" :key="label.text">
        <span class="mobile-label__dot" :style="{ background: label.color }"></span>
        <span class="mobile-label__text">{{ label.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{
  theme: 'light' | 'dark'
}>()

interface ContentLine {
  id: number
  html: string
  class?: string
  tag?: string
}

const rootRef = ref<HTMLElement | null>(null)
const visibleLines = ref<ContentLine[]>([])
const isTyping = ref(false)
const activeFormat = ref('')
const entered = ref(false)

let lineIdCounter = 0
let animationTimer: ReturnType<typeof setTimeout> | null = null
let aborted = false

const mobileLabels = [
  { text: '5 Themes', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { text: 'AI Powered', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { text: 'Collab', color: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { text: 'Word', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
]

interface DemoStep {
  action: 'type' | 'addLine' | 'pause' | 'clear' | 'format'
  line?: Omit<ContentLine, 'id'>
  text?: string
  lineIndex?: number
  duration?: number
  format?: string
}

const demoScript: DemoStep[] = [
  // Title
  { action: 'format', format: 'h1' },
  { action: 'addLine', line: { html: '', class: 'line-h1', tag: 'h1' } },
  { action: 'type', text: 'Tiptap UI Kit', lineIndex: 0, duration: 70 },
  { action: 'pause', duration: 300 },
  { action: 'format', format: '' },

  // Subtitle
  { action: 'addLine', line: { html: '', class: 'line-subtitle', tag: 'p' } },
  { action: 'type', text: 'Production-ready rich text editor for Vue 3', lineIndex: 1, duration: 35 },
  { action: 'pause', duration: 400 },

  // H2
  { action: 'format', format: 'h2' },
  { action: 'addLine', line: { html: '', class: 'line-h2', tag: 'h2' } },
  { action: 'type', text: 'Features', lineIndex: 2, duration: 55 },
  { action: 'pause', duration: 200 },
  { action: 'format', format: 'list' },

  // Bullet list items with formatting
  { action: 'addLine', line: { html: '', class: 'line-bullet', tag: 'div' } },
  { action: 'format', format: 'bold' },
  { action: 'type', text: '<strong>5 beautiful themes</strong> with dark mode support', lineIndex: 3, duration: 28 },
  { action: 'format', format: 'list' },
  { action: 'pause', duration: 100 },

  { action: 'addLine', line: { html: '', class: 'line-bullet', tag: 'div' } },
  { action: 'format', format: 'italic' },
  { action: 'type', text: '<em>AI-powered</em> writing: continue, polish, translate, summarize', lineIndex: 4, duration: 25 },
  { action: 'format', format: 'list' },
  { action: 'pause', duration: 100 },

  { action: 'addLine', line: { html: '', class: 'line-bullet', tag: 'div' } },
  { action: 'type', text: 'Real-time collaboration with <strong>cursor sync</strong>', lineIndex: 5, duration: 28 },
  { action: 'format', format: '' },
  { action: 'pause', duration: 300 },

  // Blockquote
  { action: 'format', format: 'quote' },
  { action: 'addLine', line: { html: '', class: 'line-blockquote', tag: 'blockquote' } },
  { action: 'type', text: '"The best open-source editor UI kit for Vue 3."', lineIndex: 6, duration: 28 },
  { action: 'format', format: '' },
  { action: 'pause', duration: 400 },

  // Code block
  { action: 'format', format: 'code' },
  { action: 'addLine', line: { html: '', class: 'line-code', tag: 'pre' } },
  { action: 'type', text: '<span class="code-kw">import</span> { TiptapEditor } <span class="code-kw">from</span> <span class="code-str">\'tiptap-ui-kit\'</span>', lineIndex: 7, duration: 25 },
  { action: 'format', format: '' },
  { action: 'pause', duration: 300 },

  // AI sparkle moment
  { action: 'format', format: 'ai' },
  { action: 'addLine', line: { html: '', class: 'line-ai', tag: 'div' } },
  { action: 'type', text: '<span class="ai-tag">AI</span> Generated summary: This editor kit offers enterprise-grade features...', lineIndex: 8, duration: 22 },
  { action: 'format', format: '' },
  { action: 'pause', duration: 2000 },

  // Reset and loop
  { action: 'clear' },
  { action: 'pause', duration: 600 },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    animationTimer = setTimeout(resolve, ms)
  })
}

async function typeTextInLine(lineIndex: number, fullHtml: string, speed: number) {
  isTyping.value = true
  const chars = parseHtmlChars(fullHtml)
  let current = ''

  for (let i = 0; i < chars.length; i++) {
    if (aborted) return
    current += chars[i]
    if (visibleLines.value[lineIndex]) {
      visibleLines.value[lineIndex].html = current
    }
    if (!chars[i].startsWith('<')) {
      await delay(speed)
    }
  }
  isTyping.value = false
}

function parseHtmlChars(html: string): string[] {
  const chunks: string[] = []
  let i = 0
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i)
      if (end !== -1) {
        chunks.push(html.substring(i, end + 1))
        i = end + 1
      } else {
        chunks.push(html[i])
        i++
      }
    } else if (html[i] === '&') {
      const end = html.indexOf(';', i)
      if (end !== -1 && end - i < 10) {
        chunks.push(html.substring(i, end + 1))
        i = end + 1
      } else {
        chunks.push(html[i])
        i++
      }
    } else {
      chunks.push(html[i])
      i++
    }
  }
  return chunks
}

async function runDemo() {
  while (!aborted) {
    lineIdCounter = 0
    for (const step of demoScript) {
      if (aborted) return

      switch (step.action) {
        case 'addLine':
          if (step.line) {
            visibleLines.value.push({ ...step.line, id: lineIdCounter++ })
          }
          break

        case 'type':
          if (step.text !== undefined && step.lineIndex !== undefined) {
            await typeTextInLine(step.lineIndex, step.text, step.duration || 40)
          }
          break

        case 'pause':
          isTyping.value = false
          await delay(step.duration || 300)
          break

        case 'format':
          activeFormat.value = step.format || ''
          break

        case 'clear':
          visibleLines.value = []
          activeFormat.value = ''
          break
      }
    }
  }
}

onMounted(() => {
  // Entrance animation
  requestAnimationFrame(() => {
    entered.value = true
  })
  // Start typing demo
  animationTimer = setTimeout(() => {
    runDemo()
  }, 800)
})

onBeforeUnmount(() => {
  aborted = true
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})
</script>

<style scoped>
.editor-preview {
  position: relative;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  perspective: 1200px;
}

/* Animated gradient glow behind the window */
.editor-preview__glow {
  position: absolute;
  inset: -20px;
  background: conic-gradient(
    from 0deg,
    #667eea33, #764ba233, #f093fb33, #f5576c33,
    #43e97b33, #38f9d733, #4facfe33, #667eea33
  );
  border-radius: 24px;
  filter: blur(40px);
  opacity: 0.6;
  animation: glow-rotate 8s linear infinite;
  z-index: 0;
}

.editor-preview[data-theme="dark"] .editor-preview__glow {
  opacity: 0.4;
  filter: blur(50px);
}

@keyframes glow-rotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

/* Window */
.editor-preview__window {
  position: relative;
  z-index: 1;
  background: var(--ep-bg, #ffffff);
  border-radius: 14px;
  overflow: hidden;
  transform: translateY(30px) rotateX(4deg) scale(0.96);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid var(--ep-border-outer, rgba(0, 0, 0, 0.08));
  box-shadow:
    0 25px 60px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.editor-preview__window.is-entered {
  transform: translateY(0) rotateX(0deg) scale(1);
  opacity: 1;
}

.editor-preview:hover .editor-preview__window.is-entered {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 35px 80px -12px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Dark theme vars */
.editor-preview[data-theme="dark"] .editor-preview__window {
  --ep-bg: #1a1b26;
  --ep-toolbar-bg: #1f2029;
  --ep-border: #2e303e;
  --ep-border-outer: rgba(255, 255, 255, 0.06);
  --ep-text: #c0caf5;
  --ep-text-secondary: #787c99;
  --ep-btn-bg: #2a2b3d;
  --ep-code-bg: #24253a;
  --ep-quote-border: #7aa2f7;
  --ep-quote-bg: rgba(122, 162, 247, 0.06);
  --ep-h1: #c0caf5;
  --ep-h2: #a9b1d6;
  box-shadow:
    0 25px 60px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.editor-preview[data-theme="light"] .editor-preview__window {
  --ep-bg: #ffffff;
  --ep-toolbar-bg: #fafbfc;
  --ep-border: #eaecf0;
  --ep-border-outer: rgba(0, 0, 0, 0.08);
  --ep-text: #1f2937;
  --ep-text-secondary: #6b7280;
  --ep-btn-bg: #f3f4f6;
  --ep-code-bg: #f8fafc;
  --ep-quote-border: #667eea;
  --ep-quote-bg: rgba(102, 126, 234, 0.04);
  --ep-h1: #111827;
  --ep-h2: #374151;
}

/* Title Bar */
.editor-preview__titlebar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--ep-toolbar-bg);
  border-bottom: 1px solid var(--ep-border);
}

.editor-preview__dots {
  display: flex;
  gap: 7px;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  transition: transform 0.2s;
}

.editor-preview:hover .dot { transform: scale(1.15); }

.dot--red { background: #ff5f57; }
.dot--yellow { background: #febc2e; }
.dot--green { background: #28c840; }

.editor-preview__filename {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: var(--ep-text-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.editor-preview__spacer {
  width: 50px;
}

/* Toolbar */
.editor-preview__toolbar {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 5px 12px;
  background: var(--ep-toolbar-bg);
  border-bottom: 1px solid var(--ep-border);
}

.toolbar-group {
  display: flex;
  gap: 1px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--ep-text-secondary);
  cursor: default;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.3s ease;
  position: relative;
}

.toolbar-btn.glow {
  color: var(--ep-text, #333);
  background: var(--ep-btn-bg);
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.3);
}

.toolbar-btn.icon-btn {
  padding: 0 5px;
}

.toolbar-btn.ai-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 10px;
  letter-spacing: 0.5px;
  gap: 3px;
  padding: 0 8px;
  transition: all 0.3s ease;
}

.toolbar-btn.ai-btn.ai-pulse {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5), 0 0 40px rgba(118, 75, 162, 0.3);
  transform: scale(1.08);
}

.toolbar-sep {
  width: 1px;
  height: 18px;
  background: var(--ep-border);
  margin: 0 5px;
}

/* Content Area */
.editor-preview__content {
  padding: 24px 32px 24px;
  min-height: 300px;
  max-height: 340px;
  overflow: hidden;
  color: var(--ep-text);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.7;
}

.content-inner {
  position: relative;
}

/* Line enter animation */
.line-enter-enter-active {
  animation: line-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes line-slide-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Content Lines */
.content-line {
  margin-bottom: 3px;
  min-height: 1em;
}

.content-line h1 {
  font-size: 28px;
  font-weight: 800;
  color: var(--ep-h1);
  margin: 0 0 2px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.content-line h2 {
  font-size: 19px;
  font-weight: 700;
  color: var(--ep-h2);
  margin: 10px 0 4px;
  line-height: 1.3;
}

.content-line p {
  margin: 0 0 2px;
}

.content-line.line-subtitle p {
  color: var(--ep-text-secondary);
  font-size: 14px;
}

.content-line.line-bullet :deep(div) {
  padding-left: 22px;
  position: relative;
  margin: 3px 0;
}

.content-line.line-bullet :deep(div)::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.content-line blockquote {
  margin: 8px 0;
  padding: 10px 16px;
  border-left: 3px solid var(--ep-quote-border);
  color: var(--ep-text-secondary);
  font-style: italic;
  font-size: 13.5px;
  background: var(--ep-quote-bg);
  border-radius: 0 8px 8px 0;
}

.content-line pre {
  margin: 4px 0;
  padding: 14px 18px;
  background: var(--ep-code-bg);
  border-radius: 8px;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 13px;
  border: 1px solid var(--ep-border);
}

.content-line :deep(.code-kw) {
  color: #c678dd;
}

.content-line :deep(.code-str) {
  color: #98c379;
}

.content-line.line-ai :deep(div) {
  font-size: 13.5px;
  color: var(--ep-text-secondary);
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.06), rgba(118, 75, 162, 0.06));
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.12);
}

.content-line :deep(.ai-tag) {
  display: inline-block;
  padding: 1px 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-right: 6px;
  vertical-align: middle;
}

/* Cursor */
.cursor {
  display: inline-block;
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  vertical-align: text-bottom;
  margin-left: 1px;
  border-radius: 1px;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
}

.cursor--blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Floating Labels - Desktop */
.editor-preview__labels--desktop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  opacity: 0;
  transform: translateY(10px) scale(0.9);
  transition: none;
}

.floating-label.pop-in {
  animation: pop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
             float-label 5s ease-in-out 0.5s infinite;
}

@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.floating-label__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  color: #fff;
}

.floating-label__text {
  font-size: 13px;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.label--themes {
  top: 15%;
  right: -75px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15), 0 0 0 1px rgba(102, 126, 234, 0.1);
}

.label--themes .floating-label__icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.label--ai {
  bottom: 35%;
  left: -70px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.15), 0 0 0 1px rgba(240, 147, 251, 0.1);
}

.label--ai .floating-label__icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.label--collab {
  top: 55%;
  right: -85px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.15), 0 0 0 1px rgba(67, 233, 123, 0.1);
}

.label--collab .floating-label__icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.label--word {
  bottom: 10%;
  left: -65px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  box-shadow: 0 4px 20px rgba(79, 172, 254, 0.15), 0 0 0 1px rgba(79, 172, 254, 0.1);
}

.label--word .floating-label__icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.editor-preview[data-theme="dark"] .floating-label {
  background: rgba(26, 27, 38, 0.85);
  color: #c0caf5;
}

.editor-preview[data-theme="dark"] .label--themes {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(102, 126, 234, 0.15);
}

.editor-preview[data-theme="dark"] .label--ai {
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.2), 0 0 0 1px rgba(240, 147, 251, 0.15);
}

.editor-preview[data-theme="dark"] .label--collab {
  box-shadow: 0 4px 20px rgba(67, 233, 123, 0.2), 0 0 0 1px rgba(67, 233, 123, 0.15);
}

.editor-preview[data-theme="dark"] .label--word {
  box-shadow: 0 4px 20px rgba(79, 172, 254, 0.2), 0 0 0 1px rgba(79, 172, 254, 0.15);
}

@keyframes float-label {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Mobile Labels */
.editor-preview__labels--mobile {
  display: none;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.mobile-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--ep-mobile-label-bg, rgba(0, 0, 0, 0.04));
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ep-mobile-label-text, #555);
  animation: fade-in-up 0.5s ease forwards;
  opacity: 0;
}

.mobile-label:nth-child(1) { animation-delay: 0.3s; }
.mobile-label:nth-child(2) { animation-delay: 0.45s; }
.mobile-label:nth-child(3) { animation-delay: 0.6s; }
.mobile-label:nth-child(4) { animation-delay: 0.75s; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.editor-preview[data-theme="dark"] .mobile-label {
  --ep-mobile-label-bg: rgba(255, 255, 255, 0.06);
  --ep-mobile-label-text: #a9b1d6;
}

.mobile-label__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ===== Responsive ===== */

/* Large screens - more room for labels */
@media (min-width: 1100px) {
  .editor-preview {
    max-width: 820px;
  }
  .label--themes { right: -90px; }
  .label--collab { right: -100px; }
  .label--ai { left: -85px; }
  .label--word { left: -80px; }
}

/* Medium - hide desktop labels, show mobile labels */
@media (max-width: 900px) {
  .editor-preview__labels--desktop {
    display: none;
  }
  .editor-preview__labels--mobile {
    display: flex;
  }
  .editor-preview__window.is-entered {
    transform: translateY(0) scale(1);
  }
  .editor-preview:hover .editor-preview__window.is-entered {
    transform: translateY(0) scale(1);
  }
  .editor-preview__glow {
    inset: -15px;
    filter: blur(30px);
  }
}

/* Small phones */
@media (max-width: 480px) {
  .editor-preview__content {
    padding: 16px 18px;
    min-height: 240px;
    max-height: 280px;
    font-size: 13px;
  }

  .content-line h1 {
    font-size: 22px;
  }

  .content-line h2 {
    font-size: 16px;
  }

  .editor-preview__toolbar {
    padding: 4px 8px;
    gap: 2px;
    overflow-x: auto;
  }

  .toolbar-btn {
    min-width: 24px;
    height: 24px;
    font-size: 10px;
  }

  .toolbar-sep {
    margin: 0 3px;
    height: 14px;
  }

  .editor-preview__glow {
    inset: -10px;
    filter: blur(25px);
  }

  .mobile-label {
    padding: 5px 10px;
    font-size: 11px;
  }
}
</style>

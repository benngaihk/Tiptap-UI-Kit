<template>
  <div class="editor-preview" :data-theme="theme">
    <div class="editor-preview__window">
      <!-- Window Title Bar -->
      <div class="editor-preview__titlebar">
        <div class="editor-preview__dots">
          <span class="dot dot--red"></span>
          <span class="dot dot--yellow"></span>
          <span class="dot dot--green"></span>
        </div>
        <div class="editor-preview__filename">document.docx</div>
        <div class="editor-preview__spacer"></div>
      </div>

      <!-- Fake Toolbar -->
      <div class="editor-preview__toolbar">
        <div class="toolbar-group">
          <span class="toolbar-btn active">B</span>
          <span class="toolbar-btn">I</span>
          <span class="toolbar-btn">U</span>
          <span class="toolbar-btn">S</span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group">
          <span class="toolbar-btn">H1</span>
          <span class="toolbar-btn">H2</span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group">
          <span class="toolbar-btn icon-btn">
            <svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h8v1H2v-1z"/></svg>
          </span>
          <span class="toolbar-btn icon-btn">
            <svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M2 4h12v1H2V4zm2 3h8v1H4V7zm2 3h4v1H6v-1z"/></svg>
          </span>
        </div>
        <div class="toolbar-sep"></div>
        <div class="toolbar-group">
          <span class="toolbar-btn ai-btn">AI</span>
        </div>
      </div>

      <!-- Editor Content Area -->
      <div class="editor-preview__content">
        <div class="content-inner" ref="contentRef">
          <!-- Lines are rendered dynamically -->
          <div
            v-for="(line, index) in visibleLines"
            :key="index"
            class="content-line"
            :class="line.class"
            :style="line.style"
          >
            <component :is="line.tag || 'div'" v-html="line.html"></component>
          </div>
          <span class="cursor" :class="{ 'cursor--blink': !isTyping }"></span>
        </div>
      </div>
    </div>

    <!-- Floating Labels -->
    <div class="editor-preview__labels">
      <div class="floating-label label--themes">
        <span class="floating-label__icon">5</span>
        <span class="floating-label__text">Themes</span>
      </div>
      <div class="floating-label label--ai">
        <span class="floating-label__icon">AI</span>
        <span class="floating-label__text">Powered</span>
      </div>
      <div class="floating-label label--collab">
        <span class="floating-label__icon">RT</span>
        <span class="floating-label__text">Collab</span>
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
  html: string
  class?: string
  tag?: string
  style?: Record<string, string>
}

const contentRef = ref<HTMLElement | null>(null)
const visibleLines = ref<ContentLine[]>([])
const isTyping = ref(false)

let animationTimer: ReturnType<typeof setTimeout> | null = null
let aborted = false

// Demo script - each step adds content
interface DemoStep {
  action: 'type' | 'addLine' | 'pause' | 'clear'
  line?: ContentLine
  text?: string
  lineIndex?: number
  duration?: number
}

const demoScript: DemoStep[] = [
  // Title
  { action: 'addLine', line: { html: '', class: 'line-h1', tag: 'h1' } },
  { action: 'type', text: 'Project Status Report', lineIndex: 0, duration: 60 },
  { action: 'pause', duration: 400 },

  // Subtitle paragraph
  { action: 'addLine', line: { html: '', class: 'line-subtitle', tag: 'p' } },
  { action: 'type', text: 'Q1 2026 — Engineering Team Weekly Update', lineIndex: 1, duration: 45 },
  { action: 'pause', duration: 300 },

  // Blank line
  { action: 'addLine', line: { html: '&nbsp;', class: 'line-spacer', tag: 'div' } },

  // H2
  { action: 'addLine', line: { html: '', class: 'line-h2', tag: 'h2' } },
  { action: 'type', text: 'Highlights', lineIndex: 3, duration: 55 },
  { action: 'pause', duration: 200 },

  // Bullet list items
  { action: 'addLine', line: { html: '', class: 'line-bullet', tag: 'div' } },
  { action: 'type', text: 'Shipped <strong>v3.0 editor</strong> with AI integration', lineIndex: 4, duration: 35 },
  { action: 'pause', duration: 150 },

  { action: 'addLine', line: { html: '', class: 'line-bullet', tag: 'div' } },
  { action: 'type', text: 'Added <em>5 theme presets</em> — Word, Notion, GitHub, Typora, Default', lineIndex: 5, duration: 30 },
  { action: 'pause', duration: 150 },

  { action: 'addLine', line: { html: '', class: 'line-bullet', tag: 'div' } },
  { action: 'type', text: 'Real-time collaboration now supports <strong>50+ users</strong>', lineIndex: 6, duration: 30 },
  { action: 'pause', duration: 300 },

  // Blockquote
  { action: 'addLine', line: { html: '', class: 'line-blockquote', tag: 'blockquote' } },
  { action: 'type', text: '"The best open-source editor kit for Vue 3 we\'ve tested so far."', lineIndex: 7, duration: 30 },
  { action: 'pause', duration: 500 },

  // Code block
  { action: 'addLine', line: { html: '', class: 'line-h2', tag: 'h2' } },
  { action: 'type', text: 'Quick Start', lineIndex: 8, duration: 55 },
  { action: 'pause', duration: 200 },

  { action: 'addLine', line: { html: '', class: 'line-code', tag: 'pre' } },
  { action: 'type', text: 'npm install tiptap-ui-kit', lineIndex: 9, duration: 40 },
  { action: 'pause', duration: 800 },

  // Bold ending
  { action: 'addLine', line: { html: '', class: 'line-p', tag: 'p' } },
  { action: 'type', text: 'Status: <strong style="color:#10b981">On Track</strong> ✅', lineIndex: 10, duration: 40 },
  { action: 'pause', duration: 2000 },

  // Reset and loop
  { action: 'clear' },
  { action: 'pause', duration: 800 },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    animationTimer = setTimeout(resolve, ms)
  })
}

async function typeTextInLine(lineIndex: number, fullHtml: string, speed: number) {
  isTyping.value = true
  // For HTML content, we extract plain text portions and type them
  // Simple approach: add characters one by one, inserting HTML tags instantly
  const chars = parseHtmlChars(fullHtml)
  let current = ''

  for (let i = 0; i < chars.length; i++) {
    if (aborted) return
    current += chars[i]
    if (visibleLines.value[lineIndex]) {
      visibleLines.value[lineIndex].html = current
    }
    // Only delay for visible characters (not HTML tags)
    if (!chars[i].startsWith('<')) {
      await delay(speed)
    }
  }
  isTyping.value = false
}

/**
 * Parse HTML string into typeable chunks.
 * HTML tags are returned as single chunks, regular characters individually.
 */
function parseHtmlChars(html: string): string[] {
  const chunks: string[] = []
  let i = 0
  while (i < html.length) {
    if (html[i] === '<') {
      // Find closing >
      const end = html.indexOf('>', i)
      if (end !== -1) {
        chunks.push(html.substring(i, end + 1))
        i = end + 1
      } else {
        chunks.push(html[i])
        i++
      }
    } else if (html[i] === '&') {
      // HTML entity
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
    for (const step of demoScript) {
      if (aborted) return

      switch (step.action) {
        case 'addLine':
          if (step.line) {
            visibleLines.value.push({ ...step.line })
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

        case 'clear':
          visibleLines.value = []
          break
      }
    }
  }
}

onMounted(() => {
  // Small delay before starting
  animationTimer = setTimeout(() => {
    runDemo()
  }, 1000)
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
  max-width: 720px;
  margin: 0 auto;
  perspective: 1000px;
}

.editor-preview__window {
  background: var(--ep-bg, #ffffff);
  border-radius: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transform: rotateX(2deg) rotateY(-1deg);
  transition: transform 0.5s ease;
}

.editor-preview:hover .editor-preview__window {
  transform: rotateX(0deg) rotateY(0deg);
}

.editor-preview[data-theme="dark"] .editor-preview__window {
  --ep-bg: #1e1e1e;
  --ep-toolbar-bg: #2d2d2d;
  --ep-border: #3d3d3d;
  --ep-text: #e0e0e0;
  --ep-text-secondary: #999;
  --ep-btn-bg: #3a3a3a;
  --ep-btn-hover: #4a4a4a;
  --ep-code-bg: #2d2d2d;
  --ep-quote-border: #555;
  --ep-h1: #fff;
  --ep-h2: #ddd;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.editor-preview[data-theme="light"] .editor-preview__window {
  --ep-bg: #ffffff;
  --ep-toolbar-bg: #f8f9fa;
  --ep-border: #e9ecef;
  --ep-text: #333;
  --ep-text-secondary: #666;
  --ep-btn-bg: #e9ecef;
  --ep-btn-hover: #dee2e6;
  --ep-code-bg: #f1f3f5;
  --ep-quote-border: #667eea;
  --ep-h1: #1a1a1a;
  --ep-h2: #333;
}

/* Title Bar */
.editor-preview__titlebar {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--ep-toolbar-bg);
  border-bottom: 1px solid var(--ep-border);
}

.editor-preview__dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot--red { background: #ff5f57; }
.dot--yellow { background: #febc2e; }
.dot--green { background: #28c840; }

.editor-preview__filename {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: var(--ep-text-secondary);
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.editor-preview__spacer {
  width: 50px;
}

/* Toolbar */
.editor-preview__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--ep-toolbar-bg);
  border-bottom: 1px solid var(--ep-border);
}

.toolbar-group {
  display: flex;
  gap: 2px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ep-text-secondary);
  cursor: default;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.toolbar-btn.active {
  background: var(--ep-btn-bg);
  color: var(--ep-text);
}

.toolbar-btn.icon-btn {
  padding: 0 4px;
}

.toolbar-btn.ai-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.toolbar-sep {
  width: 1px;
  height: 18px;
  background: var(--ep-border);
  margin: 0 4px;
}

/* Content Area */
.editor-preview__content {
  padding: 24px 32px;
  min-height: 280px;
  max-height: 320px;
  overflow: hidden;
  color: var(--ep-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

.content-inner {
  position: relative;
}

/* Content Lines */
.content-line {
  margin-bottom: 4px;
  min-height: 1em;
}

.content-line h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--ep-h1);
  margin: 0 0 4px;
  line-height: 1.3;
}

.content-line h2 {
  font-size: 19px;
  font-weight: 600;
  color: var(--ep-h2);
  margin: 8px 0 4px;
  line-height: 1.3;
}

.content-line p {
  margin: 0 0 2px;
  color: var(--ep-text-secondary);
}

.content-line.line-subtitle p {
  color: var(--ep-text-secondary);
  font-size: 13px;
}

.content-line.line-spacer {
  height: 8px;
}

.content-line.line-bullet div {
  padding-left: 20px;
  position: relative;
  margin: 2px 0;
}

.content-line.line-bullet div::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ep-text-secondary);
}

.content-line blockquote {
  margin: 8px 0;
  padding: 8px 16px;
  border-left: 3px solid var(--ep-quote-border);
  color: var(--ep-text-secondary);
  font-style: italic;
  font-size: 13px;
  background: rgba(102, 126, 234, 0.04);
  border-radius: 0 6px 6px 0;
}

.content-line pre {
  margin: 4px 0;
  padding: 12px 16px;
  background: var(--ep-code-bg);
  border-radius: 6px;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  color: #e06c75;
}

/* Cursor */
.cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: #667eea;
  vertical-align: text-bottom;
  margin-left: 1px;
}

.cursor--blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Floating Labels */
.editor-preview__labels {
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
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: float-label 4s ease-in-out infinite;
}

.floating-label__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
}

.floating-label__text {
  font-size: 12px;
  white-space: nowrap;
}

.label--themes {
  top: 20%;
  right: -60px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  animation-delay: 0s;
}

.label--themes .floating-label__icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.label--ai {
  bottom: 30%;
  left: -50px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  animation-delay: 1.3s;
}

.label--ai .floating-label__icon {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.label--collab {
  top: 60%;
  right: -55px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  animation-delay: 2.6s;
}

.label--collab .floating-label__icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.editor-preview[data-theme="dark"] .floating-label {
  background: rgba(30, 30, 30, 0.95);
  color: #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@keyframes float-label {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Responsive */
@media (max-width: 900px) {
  .editor-preview__labels {
    display: none;
  }

  .editor-preview__window {
    transform: none;
  }

  .editor-preview:hover .editor-preview__window {
    transform: none;
  }
}

@media (max-width: 600px) {
  .editor-preview__content {
    padding: 16px 20px;
    min-height: 220px;
    max-height: 260px;
  }

  .content-line h1 {
    font-size: 20px;
  }

  .content-line h2 {
    font-size: 16px;
  }
}
</style>

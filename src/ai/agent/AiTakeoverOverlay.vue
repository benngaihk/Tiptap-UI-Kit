<template>
  <Teleport to="body">
    <Transition name="ai-takeover-fade">
      <div v-if="active && rect" class="ai-takeover" :style="overlayStyle" aria-hidden="true">
        <!-- 顶部徽标：AI 正在接管 -->
        <div class="ai-takeover__chip">
          <ThunderboltOutlined />
          {{ t('aiChat.takeover') }}
        </div>

        <!-- 变更区域高亮（每次编辑闪烁一次） -->
        <div
          v-if="highlight"
          :key="highlight.key"
          class="ai-takeover__highlight"
          :style="{
            left: `${highlight.left - (rect?.left ?? 0)}px`,
            top: `${highlight.top - (rect?.top ?? 0)}px`,
            width: `${highlight.width}px`,
            height: `${highlight.height}px`,
          }"
        />

        <!-- 大 AI 光标：跟随修改位置平滑移动 -->
        <div
          v-if="cursor"
          class="ai-takeover__cursor"
          :style="{
            left: `${cursor.left - (rect?.left ?? 0)}px`,
            top: `${cursor.top - (rect?.top ?? 0)}px`,
            height: `${cursor.height}px`,
          }"
        >
          <span class="ai-takeover__cursor-flag">
            <ThunderboltOutlined />
            AI
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * AiTakeoverOverlay - AI 接管遮罩与编辑光标
 * @description AI agent 编辑文档期间：
 * 1. 在编辑区上盖一层带呼吸描边的遮罩（拦截用户输入，避免与 AI 并发编辑冲突）
 * 2. 用一个带 ⚡AI 旗标的大光标跟随每次修改的位置平滑移动，并自动滚动跟随、闪烁高亮变更区域
 * 视觉参考 Operator 类「AI 接管浏览器」的 takeover 交互。
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Editor } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import { ThunderboltOutlined } from '@ant-design/icons-vue'
import { t } from '@/locales'

interface Props {
  editor: Editor | null | undefined
  active: boolean
}

const props = defineProps<Props>()

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

const rect = ref<Rect | null>(null)
const cursor = ref<{ left: number; top: number; height: number } | null>(null)
const highlight = ref<{ left: number; top: number; width: number; height: number; key: number } | null>(null)

const overlayStyle = computed(() =>
  rect.value
    ? {
        left: `${rect.value.left}px`,
        top: `${rect.value.top}px`,
        width: `${rect.value.width}px`,
        height: `${rect.value.height}px`,
      }
    : undefined
)

// ===== 遮罩位置跟踪（AI 运行期间每帧同步编辑区几何，内容增长/滚动都跟随） =====
let rafId: number | null = null

function trackRect() {
  const view = props.editor && !props.editor.isDestroyed ? props.editor.view : null
  if (!view) {
    rect.value = null
    return
  }
  const r = view.dom.getBoundingClientRect()
  rect.value = { left: r.left, top: r.top, width: r.width, height: r.height }
  rafId = requestAnimationFrame(trackRect)
}

function stopTracking() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

// ===== 修改位置 → 光标/高亮/滚动 =====
let highlightKey = 0

function onTransaction({ transaction }: { transaction: Transaction }) {
  if (!transaction.docChanged || !props.editor || props.editor.isDestroyed) return
  const view = props.editor.view

  // 取本次事务最后一个 step 的落点作为「AI 正在修改」的位置
  let from: number | null = null
  let to: number | null = null
  transaction.mapping.maps.forEach((stepMap) => {
    stepMap.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
      from = from === null ? newStart : Math.min(from, newStart)
      to = to === null ? newEnd : Math.max(to, newEnd)
    })
  })
  if (from === null || to === null) return

  const docSize = view.state.doc.content.size
  const safeFrom = Math.max(0, Math.min(from, docSize))
  const safeTo = Math.max(0, Math.min(to, docSize))

  try {
    const fromCoords = view.coordsAtPos(safeFrom)
    const toCoords = view.coordsAtPos(safeTo)

    // 大光标停在修改终点
    cursor.value = {
      left: toCoords.left,
      top: toCoords.top,
      height: Math.max(toCoords.bottom - toCoords.top, 18),
    }

    // 变更区域闪烁高亮（key 变化重启 CSS 动画）
    const editorRect = view.dom.getBoundingClientRect()
    highlight.value = {
      left: editorRect.left + 8,
      top: fromCoords.top,
      width: editorRect.width - 16,
      height: Math.max(toCoords.bottom - fromCoords.top, 20),
      key: ++highlightKey,
    }

    // 平滑滚动跟随修改位置
    const domAt = view.domAtPos(safeTo)
    const el = domAt.node instanceof HTMLElement ? domAt.node : domAt.node.parentElement
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } catch {
    // coordsAtPos 在极端位置可能抛错，忽略即可（纯视觉增强）
  }
}

// ===== 生命周期 =====
watch(
  () => [props.active, props.editor] as const,
  ([active, editor], _, onCleanup) => {
    stopTracking()
    cursor.value = null
    highlight.value = null
    if (active && editor && !editor.isDestroyed) {
      trackRect()
      editor.on('transaction', onTransaction)
      onCleanup(() => {
        editor.off('transaction', onTransaction)
      })
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stopTracking()
})
</script>

<style scoped>
.ai-takeover {
  position: fixed;
  z-index: 940; /* 低于聊天面板(950)，高于编辑器内容 */
  pointer-events: auto; /* 拦截用户输入，AI 编辑期间避免并发冲突 */
  cursor: progress;
  background: color-mix(in srgb, var(--tiptap-primary, #3b82f6) 4%, transparent);
  border-radius: 8px;
  overflow: hidden;
  animation: ai-takeover-breathe 2.4s ease-in-out infinite;
}

@keyframes ai-takeover-breathe {
  0%,
  100% {
    box-shadow:
      inset 0 0 0 2px color-mix(in srgb, var(--tiptap-primary, #3b82f6) 55%, transparent),
      inset 0 0 32px color-mix(in srgb, var(--tiptap-primary, #3b82f6) 12%, transparent);
  }
  50% {
    box-shadow:
      inset 0 0 0 2px color-mix(in srgb, var(--tiptap-primary, #3b82f6) 25%, transparent),
      inset 0 0 12px color-mix(in srgb, var(--tiptap-primary, #3b82f6) 5%, transparent);
  }
}

.ai-takeover__chip {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.ai-takeover__highlight {
  position: absolute;
  border-radius: 6px;
  background: color-mix(in srgb, var(--tiptap-primary, #3b82f6) 18%, transparent);
  pointer-events: none;
  animation: ai-takeover-flash 1.1s ease-out forwards;
}

@keyframes ai-takeover-flash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.ai-takeover__cursor {
  position: absolute;
  width: 3px;
  border-radius: 2px;
  background: var(--tiptap-primary, #3b82f6);
  pointer-events: none;
  transition: left 0.35s cubic-bezier(0.22, 1, 0.36, 1), top 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.2s ease;
  animation: ai-takeover-cursor-pulse 1s ease-in-out infinite;
}

.ai-takeover__cursor-flag {
  position: absolute;
  top: -22px;
  left: 2px;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: 6px 6px 6px 0;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

@keyframes ai-takeover-cursor-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.ai-takeover-fade-enter-active,
.ai-takeover-fade-leave-active {
  transition: opacity 0.25s ease;
}

.ai-takeover-fade-enter-from,
.ai-takeover-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ai-takeover,
  .ai-takeover__cursor {
    animation: none;
  }
}
</style>

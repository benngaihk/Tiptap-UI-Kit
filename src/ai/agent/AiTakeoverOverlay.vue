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

/** 向上找最近的滚动容器（Word 模式下纸张比视口高，遮罩需裁剪到可视范围） */
function getScrollContainer(el: HTMLElement): HTMLElement | null {
  let cur = el.parentElement
  while (cur && cur !== document.body) {
    const cs = getComputedStyle(cur)
    if (/(auto|scroll|overlay)/.test(cs.overflowY) && cur.scrollHeight > cur.clientHeight + 1) {
      return cur
    }
    cur = cur.parentElement
  }
  return null
}

/** 遮罩 = 编辑区 ∩ 滚动容器可视区 ∩ 视口：只罩可见文档区域，不盖 header/工具栏 */
function updateOverlayRect(view: import('@tiptap/pm/view').EditorView) {
  const r = view.dom.getBoundingClientRect()
  const container = getScrollContainer(view.dom)
  // 后台标签页等场景 innerWidth/innerHeight 可能读到 0，此时跳过视口裁剪
  const vw = window.innerWidth || Number.MAX_SAFE_INTEGER
  const vh = window.innerHeight || Number.MAX_SAFE_INTEGER
  const cr = container
    ? container.getBoundingClientRect()
    : { left: 0, top: 0, right: vw, bottom: vh }
  const left = Math.max(r.left, cr.left, 0)
  const top = Math.max(r.top, cr.top, 0)
  const right = Math.min(r.right, cr.right, vw)
  const bottom = Math.min(r.bottom, cr.bottom, vh)
  rect.value =
    right - left > 40 && bottom - top > 40
      ? { left, top, width: right - left, height: bottom - top }
      : null
}

function trackRect() {
  const view = props.editor && !props.editor.isDestroyed ? props.editor.view : null
  if (!view) {
    rect.value = null
    return
  }
  updateOverlayRect(view)
  // 光标/高亮锚定的是文档位置，每帧重算屏幕坐标——
  // 滚动过程中它们钉在文档内容上跟着动，而不是飘在旧的屏幕位置
  syncAnchoredVisuals(view)

  rafId = requestAnimationFrame(trackRect)
}

/** 按文档锚点每帧刷新光标与高亮的屏幕坐标 */
function syncAnchoredVisuals(view: import('@tiptap/pm/view').EditorView) {
  const docSize = view.state.doc.content.size
  try {
    if (cursorAnchor !== null) {
      const coords = view.coordsAtPos(Math.max(0, Math.min(cursorAnchor, docSize)))
      cursor.value = {
        left: coords.left,
        top: coords.top,
        height: Math.max(coords.bottom - coords.top, 18),
      }
    }
    if (highlightAnchor !== null) {
      const fromCoords = view.coordsAtPos(Math.max(0, Math.min(highlightAnchor.from, docSize)))
      const toCoords = view.coordsAtPos(Math.max(0, Math.min(highlightAnchor.to, docSize)))
      const editorRect = view.dom.getBoundingClientRect()
      // key 保持不变：只更新几何，不重启闪烁动画
      highlight.value = {
        left: editorRect.left + 8,
        top: fromCoords.top,
        width: editorRect.width - 16,
        height: Math.max(toCoords.bottom - fromCoords.top, 20),
        key: highlightAnchor.key,
      }
    }
  } catch {
    // coordsAtPos 在极端位置可能抛错，保留上一帧坐标即可
  }
}

function stopTracking() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

// ===== 修改位置 → 光标/高亮/滚动 =====
// 光标与高亮记录「文档位置锚点」，屏幕坐标由 trackRect 每帧重算（滚动时钉在内容上）
let highlightKey = 0
let cursorAnchor: number | null = null
let highlightAnchor: { from: number; to: number; key: number } | null = null

function onTransaction({ transaction }: { transaction: Transaction }) {
  if (!transaction.docChanged || !props.editor || props.editor.isDestroyed) return
  const view = props.editor.view

  // 取本次事务修改范围作为「AI 正在修改」的位置
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

  cursorAnchor = safeTo
  highlightAnchor = { from: safeFrom, to: safeTo, key: ++highlightKey }

  // transaction 事件触发时 view DOM 已同步更新：立即刷新遮罩原点与光标/高亮并滚动。
  // 遮罩原点必须与光标坐标同帧更新（模板里做的是相对定位换算），
  // 且不能只依赖 rAF 循环——后台标签页里 rAF 会被浏览器暂停
  updateOverlayRect(view)
  syncAnchoredVisuals(view)
  scrollToPosIfNeeded(safeTo)
}

/**
 * 温和滚动：只滚编辑器自己的滚动容器（不动页面 body），
 * 且仅当目标不在可视区舒适范围内时才滚，滚到容器约 60% 高度处。
 */
function scrollToPosIfNeeded(pos: number) {
  const view = props.editor && !props.editor.isDestroyed ? props.editor.view : null
  if (!view) return
  try {
    const coords = view.coordsAtPos(Math.max(0, Math.min(pos, view.state.doc.content.size)))
    const container = getScrollContainer(view.dom)
    if (container) {
      const cr = container.getBoundingClientRect()
      // 目标已在可视区舒适范围内（上 15%、下 25% 之外的中间区域）就不滚
      const comfortTop = cr.top + cr.height * 0.15
      const comfortBottom = cr.bottom - cr.height * 0.25
      if (coords.top >= comfortTop && coords.bottom <= comfortBottom) return
      container.scrollTo({
        top: container.scrollTop + (coords.top - (cr.top + cr.height * 0.6)),
        behavior: 'smooth',
      })
    } else {
      // 无内部滚动容器（如 Notion 主题整页滚动）：不在视口时才滚 window
      if (coords.top >= window.innerHeight * 0.15 && coords.bottom <= window.innerHeight * 0.75) return
      window.scrollTo({
        top: window.scrollY + (coords.top - window.innerHeight * 0.6),
        behavior: 'smooth',
      })
    }
  } catch {
    // 纯视觉增强，位置异常时跳过滚动
  }
}

// ===== 生命周期 =====
watch(
  () => [props.active, props.editor] as const,
  ([active, editor], _, onCleanup) => {
    stopTracking()
    cursor.value = null
    highlight.value = null
    cursorAnchor = null
    highlightAnchor = null
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
  background: color-mix(in srgb, var(--tiptap-primary, #3b82f6) 28%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--tiptap-primary, #3b82f6) 45%, transparent);
  pointer-events: none;
  animation: ai-takeover-flash 1.8s ease-out forwards;
}

@keyframes ai-takeover-flash {
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.ai-takeover__cursor {
  position: absolute;
  width: 4px;
  border-radius: 2px;
  background: var(--tiptap-primary, #3b82f6);
  box-shadow: 0 0 10px color-mix(in srgb, var(--tiptap-primary, #3b82f6) 70%, transparent);
  pointer-events: none;
  /* 每帧跟随文档锚点：过渡取短值，飞行仍有动画感、滚动跟随时滞后小 */
  transition: left 0.22s ease-out, top 0.22s ease-out, height 0.15s ease;
  animation: ai-takeover-cursor-pulse 1s ease-in-out infinite;
}

.ai-takeover__cursor-flag {
  position: absolute;
  top: -28px;
  left: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px 8px 8px 0;
  background: var(--tiptap-primary, #3b82f6);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
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

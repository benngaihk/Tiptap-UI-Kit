<template>
  <bubble-menu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100, placement: 'top', offset: [0, 8], zIndex: 1002 }"
    :should-show="shouldShow"
    class="link-bubble-menu"
  >
    <div class="link-bubble-menu-content">
      <!-- 链接URL显示 -->
      <div class="link-url-display">
        <span class="link-url-text" :title="currentLinkUrl">{{ currentLinkUrl }}</span>
      </div>

      <!-- 操作按钮组 -->
      <div class="link-actions">
        <!-- 分隔线 -->
        <div class="link-divider"></div>
        
        <!-- 编辑链接按钮 -->
        <button
          class="link-action-btn"
          @click="editLink"
          :title="t('editor.editLink')"
        >
          <EditOutlined />
        </button>

        <!-- 分隔线 -->
        <div class="link-divider"></div>

        <!-- 打开链接按钮 -->
        <button
          class="link-action-btn"
          @click="openLink"
          :title="t('editor.openLink')"
        >
          <LinkOutlined />
        </button>

        <!-- 分隔线 -->
        <div class="link-divider"></div>

        <!-- 删除链接按钮 -->
        <button
          class="link-action-btn link-action-btn--danger"
          @click="removeLink"
          :title="t('editor.removeLink')"
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>

    <!-- 编辑链接模态框 -->
    <a-modal
      v-model:open="linkModalOpen"
      :title="t('editor.editLink')"
      @ok="applyLink"
      width="400px"
    >
      <a-input
        v-model:value="linkUrl"
        :placeholder="t('editor.linkPlaceholder')"
        @keyup.enter="applyLink"
      />
    </a-modal>
  </bubble-menu>
</template>

<script setup lang="ts">
/**
 * LinkBubbleMenu - 链接悬浮框组件
 * @description 选中链接时显示的悬浮框，提供链接编辑、打开、删除等功能
 * @description 此组件位于 tools/link-bubble 文件夹，可通过 features.linkBubbleMenu 配置是否启用
 */
import { computed, nextTick, ref, watch } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import { t } from '@/locales'
import { EditOutlined, LinkOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { createCommandRunner } from '@/utils/editorCommands'

const props = withDefaults(
  defineProps<{
    editor: Editor | null | undefined
    readonly?: boolean
    enabled?: boolean
  }>(),
  {
    readonly: false,
    enabled: false, // 默认启用
  }
)

const editor = computed(() => props.editor ?? null)
const runCommand = createCommandRunner(editor)

// 响应式状态
const currentLinkUrl = ref('')
const linkModalOpen = ref(false)
const linkUrl = ref('')

/**
 * 更新当前链接URL
 */
function updateCurrentLinkUrl() {
  const e = editor.value
  if (!e) {
    currentLinkUrl.value = ''
    return
  }

  if (e.isActive('link')) {
    const attrs = e.getAttributes('link')
    currentLinkUrl.value = attrs.href || ''
  } else {
    currentLinkUrl.value = ''
  }
}

/**
 * 检查是否应该显示链接悬浮框
 * @description 只在选中链接文本时显示（部分或全部），选中非链接文本时不显示
 */
const shouldShow = (bubbleProps: { editor: any; state: any; from: number; to: number }) => {
  // 如果功能未启用，不显示
  if (!props.enabled) {
    return false
  }

  // 只读模式下不显示
  if (props.readonly) {
    return false
  }

  const e = bubbleProps.editor
  if (!e) {
    return false
  }

  const { from, to } = bubbleProps
  const { state } = bubbleProps

  // 关键：只有当选择范围不为空时才显示（即必须选中文本）
  // 如果 from === to，说明只是光标位置，没有选中文本，不显示
  if (from === to) {
    return false
  }

  // 检查选中的文本是否包含链接标记
  // 必须确保选中的文本本身是链接，而不是选择范围内有其他链接
  try {
    const start = Math.min(from, to)
    const end = Math.max(from, to)
    
    // 使用 resolve 获取选择范围的标记
    const $from = state.doc.resolve(start)
    const $to = state.doc.resolve(end)
    
    // 检查起始位置的标记（选中的文本开始位置）
    const marksAtStart = $from.marks()
    let linkMarkAtStart = null
    for (const mark of marksAtStart) {
      if (mark.type && mark.type.name === 'link' && mark.attrs?.href) {
        linkMarkAtStart = mark
        break
      }
    }
    
    // 检查结束位置的标记（选中的文本结束位置）
    const marksAtEnd = $to.marks()
    let linkMarkAtEnd = null
    for (const mark of marksAtEnd) {
      if (mark.type && mark.type.name === 'link' && mark.attrs?.href) {
        linkMarkAtEnd = mark
        break
      }
    }
    
    // 只有当起始和结束位置都有链接标记，且是同一个链接时，才显示悬浮框
    // 这确保选中的文本本身是链接，而不是选择范围内有其他链接
    if (linkMarkAtStart && linkMarkAtEnd) {
      // 检查是否是同一个链接（通过比较 href）
      if (linkMarkAtStart.attrs?.href === linkMarkAtEnd.attrs?.href) {
        currentLinkUrl.value = linkMarkAtStart.attrs.href
        return true
      }
    }
    
    // 如果起始或结束位置只有一个有链接标记，也检查选择范围内的所有文本节点
    // 确保选中的文本节点本身都包含链接标记
    let allNodesHaveLink = false
    let linkHref = ''
    let hasNonLinkText = false
    
    state.doc.nodesBetween(start, end, (node: any) => {
      // 只检查文本节点，忽略其他类型的节点
      if (node.isText) {
        if (node.marks && node.marks.length > 0) {
          const linkMark = node.marks.find(
            (mark: any) => mark.type && mark.type.name === 'link' && mark.attrs?.href
          )
          if (linkMark) {
            if (!linkHref) {
              linkHref = linkMark.attrs.href
            } else if (linkHref !== linkMark.attrs.href) {
              // 如果选中的文本包含不同的链接，不显示
              hasNonLinkText = true
              return false
            }
            allNodesHaveLink = true
          } else {
            // 如果文本节点没有链接标记，说明选中的不是链接文本
            hasNonLinkText = true
            return false
          }
        } else {
          // 如果文本节点没有任何标记，说明选中的不是链接文本
          hasNonLinkText = true
          return false
        }
      }
    })
    
    // 只有当所有选中的文本节点都包含链接标记，且没有非链接文本时，才显示
    if (allNodesHaveLink && !hasNonLinkText && linkHref) {
      currentLinkUrl.value = linkHref
      return true
    }
  } catch (error) {
    // 忽略错误
  }

  return false
}

// 监听编辑器选择变化，更新链接URL
watch(
  () => editor.value?.state.selection,
  () => {
    if (editor.value?.isActive('link')) {
      updateCurrentLinkUrl()
    }
  },
  { deep: true }
)

// 监听编辑器状态更新，同步链接URL
watch(
  () => editor.value?.state,
  () => {
    updateCurrentLinkUrl()
  },
  { deep: true, immediate: true }
)

/**
 * 编辑链接
 */
function editLink() {
  const e = editor.value
  if (!e) return

  if (e.isActive('link')) {
    linkUrl.value = e.getAttributes('link').href || ''
  } else {
    linkUrl.value = ''
  }

  linkModalOpen.value = true
}

/**
 * 应用链接编辑
 */
function applyLink() {
  const e = editor.value
  if (!e) return

  const finalUrl = linkUrl.value.trim()
  
  if (finalUrl) {
    // 验证URL格式
    let urlToSet = finalUrl
    try {
      const url = new URL(finalUrl)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error('Invalid protocol')
      }
      urlToSet = finalUrl
    } catch {
      // 如果不是完整URL，尝试添加https://
      urlToSet = finalUrl.startsWith('http')
        ? finalUrl
        : `https://${finalUrl}`
    }
    
    // 更新链接 - 直接使用编辑器实例确保状态同步
    if (e) {
      const hasSelection = !e.state.selection.empty
      const chain = e.chain().focus()
      
      if (hasSelection) {
        // 如果有选中文本，扩展标记范围并设置链接
        const success = chain.extendMarkRange('link').setLink({ href: urlToSet, target: '_blank' }).run()
        if (success) {
          // 立即更新显示的链接URL
          currentLinkUrl.value = urlToSet
          // 等待状态同步后再次确认
          nextTick(() => {
            updateCurrentLinkUrl()
          })
        }
      } else {
        // 如果没有选中文本，在当前光标位置设置链接
        const success = chain.setLink({ href: urlToSet, target: '_blank' }).run()
        if (success) {
          currentLinkUrl.value = urlToSet
          nextTick(() => {
            updateCurrentLinkUrl()
          })
        }
      }
    }
  } else {
    // 如果URL为空，移除链接
    runCommand((chain: any) => chain.unsetLink())()
    currentLinkUrl.value = ''
  }

  // 关闭模态框并清空输入
  linkModalOpen.value = false
  linkUrl.value = ''
}

/**
 * 打开链接
 */
function openLink() {
  const e = editor.value
  if (!e) return

  if (e.isActive('link')) {
    const attrs = e.getAttributes('link')
    const href = attrs.href || ''
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }
}

/**
 * 删除链接
 */
function removeLink() {
  runCommand((chain: any) => chain.unsetLink())()
}
</script>

<style scoped>
/* 链接悬浮框容器 */
.link-bubble-menu {
  z-index: 1002; /* 比图片工具栏稍高，确保链接悬浮框显示在上层 */
}

.link-bubble-menu-content {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  :where(.dark, .dark *) & {
    background: #1f1f1f;
    border-color: #434343;
  }
}

/* 链接URL显示区域 */
.link-url-display {
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.link-url-text {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #262626;
  line-height: 1.5;

  :where(.dark, .dark *) & {
    color: #f0f0f0;
  }
}

/* 操作按钮组 */
.link-actions {
  display: flex;
  align-items: center;
  gap: 0;
}

/* 分隔线 */
.link-divider {
  width: 1px;
  height: 20px;
  background: #e8e8e8;
  margin: 0 4px;

  :where(.dark, .dark *) & {
    background: #434343;
  }
}

/* 操作按钮 */
.link-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #262626;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;

  :where(.dark, .dark *) & {
    color: #f0f0f0;
  }
}

.link-action-btn:hover:not(:disabled) {
  background: #f5f5f5;

  :where(.dark, .dark *) & {
    background: #303030;
  }
}

.link-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 危险按钮样式（删除） */
.link-action-btn--danger {
  color: #ff4d4f;

  :where(.dark, .dark *) & {
    color: #ff7875;
  }
}

.link-action-btn--danger:hover {
  color: #ff4d4f;
  background: #fff1f0;

  :where(.dark, .dark *) & {
    color: #ff7875;
    background: #3a1a1a;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .link-bubble-menu-content {
    padding: 6px 10px;
  }

  .link-url-text {
    max-width: 200px;
    font-size: 13px;
  }

  .link-action-btn {
    width: 28px;
    height: 28px;
  }
}
</style>


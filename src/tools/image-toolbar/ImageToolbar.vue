<template>
  <bubble-menu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100, placement: 'top', offset: [0, 16] }"
    :should-show="shouldShow"
    class="image-bubble-menu"
  >
    <div class="image-menu-content">
      <!-- 对齐方式 -->
      <div class="image-menu-group">
        <button
          v-for="alignOption in alignOptions"
          :key="alignOption.value"
          class="image-menu-btn"
          :class="{ active: currentAlign === alignOption.value }"
          @click="setAlign(alignOption.value)"
          :title="alignOption.title"
        >
          <component :is="alignOption.icon" />
        </button>
      </div>

      <!-- 预览 -->
      <div class="image-menu-group">
        <button class="image-menu-btn" @click="previewImage" title="预览">
          <EyeOutlined />
        </button>
      </div>

      <!-- 删除 -->
      <div class="image-menu-group">
        <button
          class="image-menu-btn image-menu-btn--danger"
          @click="deleteImage"
          title="删除图片"
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <a-modal
      v-model:open="previewVisible"
      :footer="null"
      :width="800"
      centered
      @cancel="previewVisible = false"
    >
      <img
        v-if="currentImageSrc"
        :src="currentImageSrc"
        alt="预览"
        style="width: 100%; height: auto;"
      />
    </a-modal>
  </bubble-menu>
</template>

<script setup lang="ts">
/**
 * ImageToolbar - 图片工具栏组件
 * @description 提供图片对齐、预览、删除等功能的气泡菜单
 */
import { computed, ref } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import { NodeSelection } from '@tiptap/pm/state'
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { createCommandRunner, type EditorChain } from '@/utils/editorCommands'

// ===== Props =====
const props = withDefaults(
  defineProps<{
    editor: Editor | null | undefined
    readonly?: boolean
    enabled?: boolean
  }>(),
  {
    readonly: false,
    enabled: true,
  }
)

const editor = computed(() => props.editor ?? null)
const runCommand = createCommandRunner(editor)

// ===== 状态 =====
const previewVisible = ref(false)
const currentImageSrc = ref('')
const currentAlign = ref<'left' | 'center' | 'right' | null>(null)

// ===== 对齐选项配置 =====
const alignOptions = [
  { value: 'left' as const, icon: AlignLeftOutlined, title: '左对齐' },
  { value: 'center' as const, icon: AlignCenterOutlined, title: '居中' },
  { value: 'right' as const, icon: AlignRightOutlined, title: '右对齐' },
]

// ===== 工具函数 =====

/**
 * 获取当前选中的图片节点和位置
 */
function getCurrentImageInfo() {
  const e = editor.value
  if (!e) return { node: null, pos: null }

  const { state } = e
  const { selection } = state
  let node = null
  let pos: number | null = null

  // 检查是否是节点选择（NodeSelection）
  if (selection instanceof NodeSelection && selection.node && selection.node.type.name === 'image') {
    node = selection.node
    pos = selection.from
    return { node, pos }
  }

  // 检查光标前后的节点
  const $anchor = selection.$anchor
  const nodeAfter = $anchor.nodeAfter
  const nodeBefore = $anchor.nodeBefore

  if (nodeAfter?.type.name === 'image') {
    node = nodeAfter
  } else if (nodeBefore?.type.name === 'image') {
    node = nodeBefore
  }

  // 如果找到节点但没找到位置，查找位置
  if (node && pos === null) {
    state.doc.descendants((n, p) => {
      if (n === node) {
        pos = p
        return false
      }
    })
  }

  return { node, pos }
}

/**
 * 获取图片的对齐方式
 */
function getImageAlign() {
  const { node, pos } = getCurrentImageInfo()
  if (!node || pos === null) return null

  // 优先检查图片节点本身的对齐属性
  const nodeAlign = node.attrs.align
  if (nodeAlign === 'left' || nodeAlign === 'center' || nodeAlign === 'right') {
    return nodeAlign
  }

  // 检查父节点的对齐方式
  const e = editor.value
  if (!e) return null
  const $pos = e.state.doc.resolve(pos)
  const parent = $pos.parent
  const parentAlign = parent?.attrs.textAlign || parent?.attrs.align
  if (parentAlign === 'left' || parentAlign === 'center' || parentAlign === 'right') {
    return parentAlign
  }

  return null
}

// ===== 事件处理 =====

/**
 * 检查是否应该显示工具栏
 */
const shouldShow = (bubbleProps: { editor: any; state: any; from: number; to: number }) => {
  // 如果功能未启用，不显示
  if (!props.enabled) {
    return false
  }
  
  // 检查编辑器是否存在
  if (!bubbleProps.editor) {
    return false
  }
  
  if (props.readonly || !bubbleProps.editor.isActive('image')) {
    return false
  }

  // 更新当前图片信息
  const { node } = getCurrentImageInfo()
  if (node?.type.name === 'image') {
    currentImageSrc.value = node.attrs.src || ''
    currentAlign.value = getImageAlign()
  }

  return true
}

/**
 * 设置图片对齐方式
 */
function setAlign(align: 'left' | 'center' | 'right') {
  const e = editor.value
  if (!e) return

  const { node, pos } = getCurrentImageInfo()
  if (!node || pos === null) return

  const $pos = e.state.doc.resolve(pos)
  const parent = $pos.parent

  // 优先设置父节点对齐（段落或标题）
  if (parent && (parent.type.name === 'paragraph' || parent.type.name === 'heading')) {
    const parentStart = $pos.start($pos.depth)
    e.chain()
      .setTextSelection({ from: parentStart, to: parentStart + parent.nodeSize })
      .setTextAlign(align)
      .run()
  }

  // 同时设置图片节点的对齐属性
  e.chain()
    .focus()
    .setNodeSelection(pos)
    .updateAttributes('image', { align })
    .run()

  currentAlign.value = align
}

/**
 * 预览图片
 */
function previewImage() {
  const { node } = getCurrentImageInfo()
  if (node?.type.name === 'image') {
    currentImageSrc.value = node.attrs.src || ''
    previewVisible.value = true
  }
}

/**
 * 删除图片
 */
function deleteImage() {
  runCommand((chain: EditorChain) => chain.deleteSelection())()
}
</script>

<style scoped>
.image-bubble-menu {
  z-index: 1001;
}

.image-menu-content {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 8px;
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  :where(.dark, .dark *) & {
    background: #1f1f1f;
    border-color: #434343;
  }
}

.image-menu-group {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0 4px;
  border-right: 1px solid #e8e8e8;

  :where(.dark, .dark *) & {
    border-right-color: #434343;
  }
}

.image-menu-group:last-child {
  border-right: none;
}

.image-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #333;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;

  :where(.dark, .dark *) & {
    color: #f0f0f0;
  }
}

.image-menu-btn:hover:not(:disabled) {
  background: #f5f5f5;

  :where(.dark, .dark *) & {
    background: #303030;
  }
}

.image-menu-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-menu-btn.active {
  color: #1677ff;
  background: #e6f4ff;

  :where(.dark, .dark *) & {
    color: #4fc3f7;
    background: #15395b;
  }
}

.image-menu-btn--danger {
  color: #ff4d4f;

  :where(.dark, .dark *) & {
    color: #ff7875;
  }
}

.image-menu-btn--danger:hover {
  color: #ff4d4f;
  background: #fff1f0;

  :where(.dark, .dark *) & {
    color: #ff7875;
    background: #3a1a1a;
  }
}
</style>


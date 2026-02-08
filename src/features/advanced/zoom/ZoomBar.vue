<template>
  <div :class="classes">
    <a-button size="small" @click="onZoomOut">-</a-button>
    <span class="zoom-level">{{ zoomLevel }}%</span>
    <a-button size="small" @click="onZoomIn">+</a-button>
    <a-button size="small" @click="onReset">{{ t('stats.reset') }}</a-button>
    <span class="page-info">{{ t('stats.total') }} {{ totalPages }} {{ t('stats.pages') }}</span>
    <span v-if="showCharCount && editor" class="char-count">
      {{ characterCount }} {{ t('stats.characters') }} / {{ wordCount }} {{ t('stats.words') }}
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * ZoomBar - 缩放控制栏组件
 * @description 提供文档缩放、页数统计和字数统计功能
 */
import { computed, ref, watch } from 'vue'
import { Button as AButton } from 'ant-design-vue'
import type { Editor } from '@tiptap/vue-3'
import { t } from '@/locales'
import '@/styles/zoom-toolbar.css'

const props = withDefaults(
  defineProps<{
    zoomLevel: number
    totalPages: number
    editor?: Editor | null
    showCharCount?: boolean
    min?: number
    max?: number
    step?: number
    placement?: 'bottom' | 'belowToolbar'
  }>(),
  {
    min: 50,
    max: 200,
    step: 10,
    placement: 'belowToolbar',
    showCharCount: true,
  }
)

const emit = defineEmits<{
  (e: 'update:zoomLevel', value: number): void
  (e: 'change', value: number): void
  (e: 'reset', value: number): void
}>()

/**
 * 放大缩放
 */
const onZoomIn = () => {
  if (props.zoomLevel < props.max) {
    const v = Math.min(props.zoomLevel + props.step, props.max)
    emit('update:zoomLevel', v)
    emit('change', v)
  }
}

/**
 * 缩小缩放
 */
const onZoomOut = () => {
  if (props.zoomLevel > props.min) {
    const v = Math.max(props.zoomLevel - props.step, props.min)
    emit('update:zoomLevel', v)
    emit('change', v)
  }
}

/**
 * 重置缩放
 */
const onReset = () => {
  const v = 100
  emit('update:zoomLevel', v)
  emit('change', v)
  emit('reset', v)
}

/**
 * 计算样式类名
 */
const classes = computed(() =>
  ['zoom-controls', props.placement === 'bottom' ? 'zoom-controls--bottom' : null]
    .filter(Boolean)
    .join(' ')
)

/**
 * 字符数和字数统计（响应式）
 */
const characterCount = ref(0)
const wordCount = ref(0)

/**
 * 更新字数统计
 */
const updateCounts = () => {
  if (!props.editor) {
    characterCount.value = 0
    wordCount.value = 0
    return
  }

  try {
    const storage = props.editor.storage.characterCount
    if (storage) {
      characterCount.value = storage.characters?.() ?? 0
      wordCount.value = storage.words?.() ?? 0
    } else {
      characterCount.value = 0
      wordCount.value = 0
    }
  } catch (error) {
    console.warn('Failed to get character count:', error)
    characterCount.value = 0
    wordCount.value = 0
  }
}

// 监听编辑器内容变化
watch(
  () => props.editor,
  (editor) => {
    if (editor) {
      // 初始化时更新一次
      updateCounts()
      
      // 监听编辑器更新事件
      editor.on('update', updateCounts)
      editor.on('selectionUpdate', updateCounts)
    }
  },
  { immediate: true }
)

// 监听编辑器销毁
watch(
  () => props.editor,
  (editor, oldEditor) => {
    if (oldEditor && !editor) {
      // 编辑器被销毁时清理监听
      oldEditor.off('update', updateCounts)
      oldEditor.off('selectionUpdate', updateCounts)
    }
  }
)
</script>


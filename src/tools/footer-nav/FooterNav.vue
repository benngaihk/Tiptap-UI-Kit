<template>
  <div v-if="enabled" class="footer-nav-container">
    <ZoomBar
      v-model:zoomLevel="localZoomLevel"
      :totalPages="totalPages"
      :editor="editor"
      :showCharCount="showCharCount"
      :min="min"
      :max="max"
      :step="step"
      placement="bottom"
      @update:zoomLevel="handleZoomUpdate"
      @change="handleZoomChange"
      @reset="handleZoomReset"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * FooterNav - 底部导航组件
 * @description 底部导航栏，集成缩放控制、页数统计和字数统计功能
 * @example
 * ```vue
 * <FooterNav
 *   v-model:zoomLevel="zoomLevel"
 *   :totalPages="totalPages"
 *   :editor="editor"
 * />
 * <FooterNav :enabled="false" /> // 关闭底部导航
 * ```
 */
import { ref, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ZoomBar } from '@/features/advanced/zoom'
import './footer-nav.css'

// ===== Props =====
interface Props {
  /** 当前缩放比例（双向绑定） */
  zoomLevel: number
  /** 文档总页数 */
  totalPages: number
  /** Tiptap 编辑器实例 */
  editor?: Editor | null
  /** 是否显示字数统计 */
  showCharCount?: boolean
  /** 最小缩放比例 */
  min?: number
  /** 最大缩放比例 */
  max?: number
  /** 缩放步长 */
  step?: number
  /** 是否启用底部导航，默认为 true */
  enabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 50,
  max: 200,
  step: 10,
  showCharCount: true,
  enabled: true,
})

// ===== Emits =====
const emit = defineEmits<{
  (e: 'update:zoomLevel', value: number): void
  (e: 'change', value: number): void
  (e: 'reset', value: number): void
}>()

// ===== 响应式状态 =====
const localZoomLevel = ref(props.zoomLevel)

// ===== 监听外部 zoomLevel 变化 =====
watch(
  () => props.zoomLevel,
  (newValue) => {
    if (localZoomLevel.value !== newValue) {
      localZoomLevel.value = newValue
    }
  },
  { immediate: true }
)

// ===== 事件处理 =====
/**
 * 处理缩放更新
 */
const handleZoomUpdate = (value: number) => {
  localZoomLevel.value = value
  emit('update:zoomLevel', value)
}

/**
 * 处理缩放变化
 */
const handleZoomChange = (value: number) => {
  emit('change', value)
}

/**
 * 处理缩放重置
 */
const handleZoomReset = (value: number) => {
  emit('reset', value)
}
</script>

<style lang="scss" scoped>
/* ===== 底部导航容器 ===== */
.footer-nav-container {
  width: 100%;
  flex-shrink: 0;
  display: block; /* 确保显示 */
  position: relative; /* 确保定位上下文 */
}
</style>


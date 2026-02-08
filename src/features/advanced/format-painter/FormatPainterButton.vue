<template>
  <ToolbarButton
    :icon="FormatPainterOutlined"
    :title="t('editor.formatPainter')"
    :active="isFormatPainterActive"
    :disabled="isDisabled"
    @click="toggleFormatPainter"
    @dblclick="toggleFormatPainterContinuous"
  />
</template>

<script setup lang="ts">
/**
 * FormatPainterButton - 格式刷按钮组件
 * @description 可复用的格式刷按钮组件，提供格式采样和应用功能
 * 支持单击单次模式和双击连续模式
 */
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { FormatPainterOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ToolbarButton } from '@/ui'
import { t } from '@/locales'
import type { FormatPainterStorage } from './formatPainter'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 外部传入的禁用状态（优先级高于内部协作检测） */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: undefined,
})
const editor = computed(() => props.editor ?? null)

// ===== 类型定义 =====
interface EditorWithStorage {
  storage?: {
    formatPainter?: FormatPainterStorage
  }
}

// ===== 禁用状态检查 =====
/**
 * 计算是否禁用格式刷
 * @description 优先使用外部传入的 disabled 属性，否则检查协作扩展是否存在
 */
const isDisabled = computed(() => {
  // 如果外部明确传入了 disabled 属性，使用外部值
  if (props.disabled !== undefined) {
    return props.disabled
  }
  // 否则检查协作扩展是否存在（兼容旧逻辑）
  const e = editor.value
  if (!e) return false
  try {
    const collaborationExt = e.extensionManager.extensions.find(
      (ext) => ext.name === 'collaboration'
    )
    return !!collaborationExt
  } catch (error) {
    return false
  }
})

// ===== 格式刷状态管理 =====
/**
 * 获取格式刷存储对象
 */
function getFormatPainterStorage(): FormatPainterStorage | undefined {
  const e = editor.value as EditorWithStorage | null
  return e?.storage?.formatPainter
}

// 使用响应式 ref 订阅编辑器事件，确保激活态能实时更新
const isFormatPainterActive = ref(false)

/**
 * 更新格式刷激活状态
 */
function updateFormatPainterActive() {
  const storage = getFormatPainterStorage()
  isFormatPainterActive.value = Boolean(storage?.isActive)
}

/**
 * 设置格式刷事件订阅
 */
function setupFormatPainterSubscriptions() {
  // 先清理旧订阅
  cleanupFormatPainterSubscriptions()
  const e = editor.value
  if (!e) return
  // 初始化一次状态
  updateFormatPainterActive()
  // 订阅常见会引起状态变化的事件
  e.on('update', updateFormatPainterActive)
  e.on('selectionUpdate', updateFormatPainterActive)
  e.on('transaction', updateFormatPainterActive)
}

/**
 * 清理格式刷事件订阅
 */
function cleanupFormatPainterSubscriptions() {
  const e = editor.value
  if (!e) return
  try {
    e.off('update', updateFormatPainterActive)
    e.off('selectionUpdate', updateFormatPainterActive)
    e.off('transaction', updateFormatPainterActive)
  } catch (error) {
    // 忽略取消订阅时的错误
  }
}

// 初始化与后续 editor 变更时设置订阅
if (editor.value) setupFormatPainterSubscriptions()
// 监听 editor 引用的变化（在父组件传入实例后触发）
watch(editor, setupFormatPainterSubscriptions, { immediate: true })

// 组件卸载时清理订阅
onBeforeUnmount(() => {
  cleanupFormatPainterSubscriptions()
})

// ===== 格式刷命令 =====
/**
 * 单击切换格式刷（单次模式）
 * @description 单击格式刷按钮，采样格式或应用格式
 */
function toggleFormatPainter() {
  const e = editor.value as any
  if (!e) return
  
  // 检查是否禁用，如果禁用则提示
  if (isDisabled.value) {
    message.warning(t('editor.collaborationNoFormatPainter'))
    return
  }
  
  const active = e.storage?.formatPainter?.isActive ?? false
  
  if (!active) {
    // 格式刷未激活：检查是否有选中内容
    try {
      const selection = e.state.selection
      if (!selection || selection.empty) {
        message.warning(t('editor.pleaseSelectTextToSample'))
        return
      }
    } catch (error) {
      message.warning(t('editor.pleaseSelectTextToSampleShort'))
      return
    }
    
    // 采样格式并激活格式刷（单次模式）
    const success = e.commands.startFormatPainting()
    if (success) {
      message.success(t('editor.sampleSuccessSingle'))
      updateFormatPainterActive()
    }
  } else {
    // 格式刷已激活：取消格式刷状态
    e.commands.cancelFormatPainting()
    updateFormatPainterActive()
    message.info(t('editor.formatPainterExited'))
  }
}

/**
 * 双击切换格式刷连续应用模式
 * @description 双击格式刷按钮，开启连续应用模式
 */
function toggleFormatPainterContinuous() {
  const e = editor.value as any
  if (!e) return
  
  // 检查是否禁用，如果禁用则提示
  if (isDisabled.value) {
    message.warning(t('editor.collaborationNoFormatPainter'))
    return
  }
  
  const active = e.storage?.formatPainter?.isActive ?? false
  
  if (!active) {
    // 格式刷未激活：检查是否有选中内容
    try {
      const selection = e.state.selection
      if (!selection || selection.empty) {
        message.warning(t('editor.pleaseSelectTextToSampleDouble'))
        return
      }
    } catch (error) {
      message.warning(t('editor.pleaseSelectTextToSampleShort'))
      return
    }
    
    // 采样格式并激活格式刷（连续模式）
    const success = e.commands.startContinuousFormatPainting()
    if (success) {
      message.success(t('editor.sampleSuccessContinuous'))
      updateFormatPainterActive()
    }
  } else {
    // 格式刷已激活：取消格式刷
    e.commands.cancelFormatPainting()
    updateFormatPainterActive()
    message.info(t('editor.formatPainterExited'))
  }
}
</script>


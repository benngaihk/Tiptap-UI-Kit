<template>
  <ToolbarGroup>
    <ToolbarButton
      :icon="UndoOutlined"
      :title="disabled ? t('editor.undoDisabledInCollab') : t('editor.undo')"
      :disabled="disabled || !canUndo"
      @click="undo"
    />
    <ToolbarButton
      :icon="RedoOutlined"
      :title="disabled ? t('editor.redoDisabledInCollab') : t('editor.redo')"
      :disabled="disabled || !canRedo"
      @click="redo"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * UndoRedoButton - 撤销/重做按钮组件
 * @description 可复用的撤销/重做按钮组件，提供撤销和重做功能
 */
import { computed, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { UndoOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { ToolbarButton, ToolbarGroup } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { t } from '@/locales'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 是否禁用按钮（协作模式下需要禁用） */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)

// ===== 撤销/重做状态管理 =====
/**
 * 使用响应式 ref 存储撤销/重做状态，确保实时更新
 */
const canUndo = ref(false)
const canRedo = ref(false)

/**
 * 标记是否有真正的编辑操作
 * 用于区分初始化状态和真正的编辑操作
 */
const hasRealEdit = ref(false)

/**
 * 更新撤销/重做状态
 * @description 检查编辑器是否可以执行撤销/重做操作
 * 使用更严格的条件判断，确保初始化时没有可撤销操作时按钮为禁用状态
 */
function updateUndoRedoState() {
  const e = editor.value
  if (!e) {
    canUndo.value = false
    canRedo.value = false
    return
  }
  
  try {
    // 检查是否可以撤销/重做
    const undoCheck = e.can().undo?.()
    const redoCheck = e.can().redo?.()
    
    // 只有在有真正的编辑操作后，才允许撤销
    // 这样可以防止初始化时的误判
    canUndo.value = undoCheck && hasRealEdit.value
    canRedo.value = Boolean(redoCheck)
  } catch (error) {
    // 如果检查失败，默认禁用按钮
    canUndo.value = false
    canRedo.value = false
  }
}

/**
 * 处理编辑器更新事件
 * @description 监听编辑器的更新事件，判断是否有真正的编辑操作
 */
function handleUpdate() {
  const e = editor.value
  if (!e) return
  
  // update 事件在文档内容变化时触发
  // 标记为有真正的编辑操作
  hasRealEdit.value = true
  
  // 更新按钮状态
  updateUndoRedoState()
}

/**
 * 设置编辑器事件订阅
 * @description 监听编辑器状态变化，实时更新撤销/重做按钮状态
 */
function setupEditorSubscriptions() {
  // 先清理旧订阅
  cleanupEditorSubscriptions()
  const e = editor.value
  if (!e) return
  
  // 重置编辑标志
  hasRealEdit.value = false
  
  // 使用 nextTick 确保编辑器完全初始化后再检查状态
  nextTick(() => {
    // 初始化一次状态（此时应该没有可撤销操作）
    updateUndoRedoState()
    
    // 订阅编辑器状态变化事件
    e.on('update', handleUpdate) // 使用专门的更新处理函数，检测文档变化
    e.on('selectionUpdate', updateUndoRedoState)
    e.on('transaction', updateUndoRedoState)
    e.on('create', () => {
      // 编辑器创建时，重置编辑标志
      hasRealEdit.value = false
      updateUndoRedoState()
    })
  })
}

/**
 * 清理编辑器事件订阅
 */
function cleanupEditorSubscriptions() {
  const e = editor.value
  if (!e) return
  try {
    e.off('update', handleUpdate)
    e.off('selectionUpdate', updateUndoRedoState)
    e.off('transaction', updateUndoRedoState)
    e.off('create', updateUndoRedoState)
  } catch (error) {
    // 忽略取消订阅时的错误
  }
}

// 初始化与后续 editor 变更时设置订阅
if (editor.value) setupEditorSubscriptions()
// 监听 editor 引用的变化（在父组件传入实例后触发）
watch(editor, setupEditorSubscriptions, { immediate: true })

// 组件卸载时清理订阅
onBeforeUnmount(() => {
  cleanupEditorSubscriptions()
})

// ===== 撤销/重做命令 =====
/**
 * 撤销命令
 * @description 执行撤销操作，回退到上一个编辑状态
 */
const undo = runCommand((chain) => chain.undo())

/**
 * 重做命令
 * @description 执行重做操作，恢复到撤销前的状态
 */
const redo = runCommand((chain) => chain.redo())
</script>


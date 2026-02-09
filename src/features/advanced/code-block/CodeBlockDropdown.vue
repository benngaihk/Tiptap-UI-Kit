<template>
  <ToolbarGroup>
    <ToolbarButton
      :icon="CodeOutlined"
      :title="t('toolbar.insertCodeBlock')"
      :active="isCodeBlockActive"
      @click="insertCodeBlock"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * CodeBlockDropdown - 代码块按钮组件
 * @description 点击直接插入代码块，使用默认语言
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'
import { CodeOutlined } from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { isActive } = createStateCheckers(editor)

// ===== 检查是否激活代码块 =====
const isCodeBlockActive = computed(() => {
  return isActive('codeBlock')
})

/**
 * 插入代码块（使用默认语言）
 * 处理多行选择：将所有选中的文本合并到一个代码块中
 */
function insertCodeBlock() {
  const e = editor.value
  if (!e) return

  // 如果当前已经是代码块，则退出代码块模式
  if (isCodeBlockActive.value) {
    runCommand((chain) => chain.setParagraph())()
    return
  }

  // 获取选区
  const { from, to, empty } = e.state.selection

  // 如果没有选中任何内容，直接插入空代码块
  if (empty) {
    runCommand((chain) => chain.setCodeBlock({ language: 'javascript' }))()
    return
  }

  // 获取选中的文本内容（保留换行）
  const selectedText = e.state.doc.textBetween(from, to, '\n')

  // 删除选中内容并插入代码块
  e.chain()
    .focus()
    .deleteSelection()
    .insertContent({
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: selectedText ? [{ type: 'text', text: selectedText }] : undefined
    })
    .run()
}
</script>


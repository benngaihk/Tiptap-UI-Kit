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
 */
function insertCodeBlock() {
  runCommand((chain) => {
    // 如果当前已经是代码块，则退出代码块模式
    if (isCodeBlockActive.value) {
      return chain.setParagraph()
    }
    // 否则插入新的代码块（使用默认语言 javascript）
    return chain.setCodeBlock({ language: 'javascript' })
  })()
}
</script>


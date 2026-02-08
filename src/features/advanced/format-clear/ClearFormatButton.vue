<template>
  <ToolbarGroup>
    <ToolbarButton
      :icon="ClearOutlined"
      :title="t('editor.clearFormat')"
      @click="clearFormat"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * ClearFormatButton - 清除格式按钮组件
 * @description 可复用的清除格式按钮组件
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ClearOutlined } from '@ant-design/icons-vue'
import { ToolbarGroup, ToolbarButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { t } from '@/locales'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)

/**
 * 清除格式
 * @description 清除当前选区的所有格式（文本样式、颜色、字体等）
 */
function clearFormat() {
  runCommand((chain) => chain.clearNodes().unsetAllMarks())()
}
</script>


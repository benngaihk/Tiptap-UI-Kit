<template>
  <ToolbarGroup>
    <ToolbarButton
      v-for="heading in headings"
      :key="heading.level"
      :title="heading.title"
      :active="isHeadingActive(heading.level)"
      @click="heading.action"
      class="heading-btn"
      :data-level="heading.level"
    >
      H{{ heading.level }}
    </ToolbarButton>
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * HeadingButtons - 标题按钮组
 * @description 可复用的标题按钮组件（H1、H2、H3等）
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarButton, ToolbarGroup } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'
import type { HeadingLevel } from '@/configs/toolbar'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 显示的标题级别，默认 [1, 2, 3] */
  levels?: HeadingLevel[]
}

const props = withDefaults(defineProps<Props>(), {
  levels: () => [1, 2, 3],
})

const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { isHeadingActive } = createStateCheckers(editor)

// ===== 标题配置 =====
const headings = computed(() =>
  props.levels.map((level) => ({
    level,
    action: runCommand((chain) => chain.toggleHeading({ level })),
    title: t(`editor.h${level}`),
  }))
)
</script>

<style scoped>
.heading-btn {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
}
</style>


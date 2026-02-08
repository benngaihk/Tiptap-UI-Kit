<template>
  <ToolbarGroup>
    <ToolbarDropdownButton
      :icon="FontSizeOutlined"
      :title="t('editor.heading')"
      :items="headingItems"
      placement="bottomLeft"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * HeadingDropdown - 标题下拉菜单组件
 * @description 可复用的标题下拉菜单组件（正文、H1-H6）
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarDropdownButton } from '@/ui'
import { HEADING_OPTIONS } from '@/configs/editorConstants'
import type { MenuItemConfig } from '@/configs/toolbar'
import { t } from '@/locales'
import { FontSizeOutlined } from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 标题菜单项 =====
const headingItems = computed<MenuItemConfig[]>(() => {
  if (!editor.value) return []
  return HEADING_OPTIONS.map((opt) => ({
    key: opt.value,
    label: t(`editor.${opt.value}`),
    action: () => onHeadingChange(opt.value),
  }))
})

/**
 * 段落样式切换
 */
function onHeadingChange(val: string): void {
  const e = editor.value
  if (!e) return

  const { from, to } = e.state.selection

  if (val === 'paragraph') {
    e.chain().setParagraph().setTextSelection({ from, to }).run()
    return
  }

  const level = Number(val.replace(/^h/, '')) as 1 | 2 | 3 | 4 | 5 | 6
  if (![1, 2, 3, 4, 5, 6].includes(level)) return

  const $from = e.state.selection.$from
  const start = $from.start($from.depth)
  const end = $from.end($from.depth)

  e.chain()
    .setHeading({ level })
    .setTextSelection({ from: start, to: end })
    .unsetMark('textStyle')
    .setTextSelection({ from, to })
    .run()
}
</script>


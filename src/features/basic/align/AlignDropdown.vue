<template>
  <ToolbarGroup>
    <ToolbarDropdownButton
      :icon="currentAlignIcon"
      :title="t('editor.align')"
      :items="alignMenuItems"
      placement="bottomLeft"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * AlignDropdown - 对齐下拉菜单组件
 * @description 可复用的对齐下拉菜单组件（左对齐、居中、右对齐、两端对齐）
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarDropdownButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import type { AlignValue, MenuItemConfig } from '@/configs/toolbar'
import { t } from '@/locales'
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  MenuOutlined,
} from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { isActiveAlign } = createStateCheckers(editor)

// ===== 对齐工具菜单项 =====
const alignMenuItems = computed<MenuItemConfig[]>(() => [
  { key: 'align-left', label: t('editor.alignLeft'), icon: AlignLeftOutlined, action: () => setAlign('left') },
  { key: 'align-center', label: t('editor.alignCenter'), icon: AlignCenterOutlined, action: () => setAlign('center') },
  { key: 'align-right', label: t('editor.alignRight'), icon: AlignRightOutlined, action: () => setAlign('right') },
  { key: 'align-justify', label: t('editor.alignJustify'), icon: MenuOutlined, action: () => setAlign('justify') },
])

/**
 * 获取当前激活的对齐图标
 */
const currentAlignIcon = computed(() => {
  if (isActiveAlign('center')) return AlignCenterOutlined
  if (isActiveAlign('right')) return AlignRightOutlined
  if (isActiveAlign('justify')) return MenuOutlined
  return AlignLeftOutlined
})

/**
 * 设置文本对齐方式
 */
function setAlign(value: AlignValue) {
  runCommand((chain) => chain.setTextAlign(value))()
}
</script>


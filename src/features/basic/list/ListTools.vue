<template>
  <ToolbarGroup>
    <ToolbarButton
      v-for="item in listItems"
      :key="item.name"
      :icon="item.icon"
      :title="item.title"
      :active="isActive(item.name)"
      @click="item.action"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * ListTools - 列表工具组
 * @description 可复用的列表工具组件（无序列表、有序列表、任务列表）
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarButton, ToolbarGroup } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'
import {
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 是否显示任务列表按钮，默认 false */
  showTaskList?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTaskList: false,
})

const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { isActive } = createStateCheckers(editor)

// ===== 列表工具配置 =====
const listItems = computed(() => {
  const items = [
    {
      name: 'bulletList',
      icon: UnorderedListOutlined,
      title: t('editor.bulletList'),
      action: () => runCommand((chain) => chain.toggleBulletList())(),
    },
    {
      name: 'orderedList',
      icon: OrderedListOutlined,
      title: t('editor.orderedList'),
      action: () => runCommand((chain) => chain.toggleOrderedList())(),
    },
  ]

  // 可选的任务列表按钮
  if (props.showTaskList) {
    items.push({
      name: 'taskList',
      icon: CheckSquareOutlined,
      title: t('editor.taskList'),
      action: () => runCommand((chain) => (chain as any).toggleTaskList?.() ?? chain)(),
    })
  }

  return items
})
</script>


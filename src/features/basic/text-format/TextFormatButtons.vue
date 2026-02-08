<template>
  <ToolbarGroup>
    <ToolbarButton
      v-for="format in textFormats"
      :key="format.name"
      :icon="format.icon"
      :title="format.title"
      :active="isActive(format.name)"
      @click="format.action"
    />
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * TextFormatButtons - 文本格式按钮组
 * @description 可复用的文本格式按钮组件（粗体、斜体、下划线、删除线、行内代码）
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarButton, ToolbarGroup } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 是否显示行内代码按钮，默认 false */
  showCode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCode: false,
})

const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { isActive } = createStateCheckers(editor)

// ===== 文本格式配置 =====
const textFormats = computed(() => {
  const formats = [
    {
      name: 'bold',
      icon: BoldOutlined,
      title: t('editor.bold'),
      action: () => runCommand((chain) => chain.toggleBold())(),
    },
    {
      name: 'italic',
      icon: ItalicOutlined,
      title: t('editor.italic'),
      action: () => runCommand((chain) => chain.toggleItalic())(),
    },
    {
      name: 'underline',
      icon: UnderlineOutlined,
      title: t('editor.underline'),
      action: () => runCommand((chain) => (chain as any).toggleUnderline?.() ?? chain)(),
    },
    {
      name: 'strike',
      icon: StrikethroughOutlined,
      title: t('editor.strike'),
      action: () => runCommand((chain) => chain.toggleStrike())(),
    },
  ]

  // 可选的行内代码按钮
  if (props.showCode) {
    formats.push({
      name: 'code',
      icon: CodeOutlined,
      title: t('editor.inlineCode'),
      action: () => runCommand((chain) => chain.toggleCode())(),
    })
  }

  return formats
})
</script>


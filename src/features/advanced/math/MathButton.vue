<template>
  <ToolbarDropdownButton
    :icon="FunctionOutlined"
    :title="t('editor.math')"
    :items="menuItems"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { FunctionOutlined } from '@ant-design/icons-vue'
import ToolbarDropdownButton from '@/ui/ToolbarDropdownButton.vue'
import { t } from '@/locales'
import type { MenuItemConfig } from '@/configs/toolbar'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const menuItems = computed<MenuItemConfig[]>(() => [
  {
    key: 'inline-math',
    label: t('editor.mathInline'),
    action: () => {
      props.editor?.chain().focus().insertInlineMath().run()
    },
  },
  {
    key: 'block-math',
    label: t('editor.mathBlock'),
    action: () => {
      props.editor?.chain().focus().insertBlockMath().run()
    },
  },
])
</script>

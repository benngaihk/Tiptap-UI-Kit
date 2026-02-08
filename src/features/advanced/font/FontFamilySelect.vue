<template>
  <a-select
    v-model:value="currentFont"
    :placeholder="t('toolbar.fontFamily')"
    class="font-family-select"
    style="width: 140px"
    @change="onFontChange"
  >
    <a-select-option v-for="font in FONT_FAMILIES" :key="font.value" :value="font.value">
      {{ font.label }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
/**
 * FontFamilySelect - 字体选择器组件
 * @description 可复用的字体选择器组件，支持选择字体系列
 */
import { computed, ref, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { createCommandRunner, executeBatchCommands } from '@/utils/editorCommands'
import { t } from '@/locales'
import { FONT_FAMILIES, DEFAULT_VALUES } from '@/configs/editorConstants'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)

// ===== 响应式状态 =====
const currentFont = ref<string>(DEFAULT_VALUES.fontFamily)

// ===== 监听编辑器状态，更新当前字体 =====
watch(
  () => editor.value?.getAttributes('textStyle')?.fontFamily,
  (fontFamily) => {
    if (fontFamily) {
      currentFont.value = fontFamily
    } else {
      currentFont.value = DEFAULT_VALUES.fontFamily
    }
  },
  { deep: true, immediate: true }
)

/**
 * 字体切换处理
 * @description 如果无选区则应用到整个段落，有选区则应用到选区
 */
function onFontChange(val: string) {
  const e = editor.value
  if (!e) return

  currentFont.value = val

  const { from, to, empty } = e.state.selection
  if (empty) {
    // 无选区时：选中整个段落并应用字体
    const $from = e.state.selection.$from
    const start = $from.start($from.depth)
    const end = $from.end($from.depth)
    executeBatchCommands(editor, [
      (chain) => chain.setTextSelection({ from: start, to: end }),
      (chain) => chain.setFontFamily(val),
      (chain) => chain.setTextSelection({ from, to }),
    ])
  } else {
    // 有选区时：直接应用到选区
    runCommand((chain) => chain.setFontFamily(val))()
  }
}
</script>

<style scoped>
.font-family-select {
  font-size: 14px;
}
</style>


<template>
  <a-select
    v-model:value="currentFontSize"
    :placeholder="t('toolbar.fontSize')"
    class="font-size-select"
    style="width: 100px"
    @change="onFontSizeChange"
  >
    <a-select-option v-for="size in FONT_SIZES" :key="size.value" :value="size.value">
      {{ size.label }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
/**
 * FontSizeSelect - 字号选择器组件
 * @description 可复用的字号选择器组件，支持选择字号大小
 */
import { computed, ref, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { createCommandRunner, executeBatchCommands } from '@/utils/editorCommands'
import { t } from '@/locales'
import { FONT_SIZES, DEFAULT_VALUES } from '@/configs/editorConstants'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)

// ===== 响应式状态 =====
const currentFontSize = ref<string>(DEFAULT_VALUES.fontSize)

// ===== 监听编辑器状态，更新当前字号 =====
watch(
  () => editor.value?.getAttributes('textStyle')?.fontSize,
  (fontSize) => {
    if (fontSize) {
      currentFontSize.value = fontSize
    } else {
      currentFontSize.value = DEFAULT_VALUES.fontSize
    }
  },
  { deep: true, immediate: true }
)

/**
 * 字号切换处理
 * @description 如果无选区则应用到整个段落，有选区则应用到选区
 */
function onFontSizeChange(val: string) {
  const e = editor.value
  if (!e) return

  currentFontSize.value = val

  const { from, to, empty } = e.state.selection
  if (empty) {
    // 无选区时：选中整个段落并应用字号
    const $from = e.state.selection.$from
    const start = $from.start($from.depth)
    const end = $from.end($from.depth)
    executeBatchCommands(editor, [
      (chain) => chain.setTextSelection({ from: start, to: end }),
      (chain) => chain.setMark('textStyle', { fontSize: val }),
      (chain) => chain.setTextSelection({ from, to }),
    ])
  } else {
    // 有选区时：直接应用到选区
    runCommand((chain) => chain.setMark('textStyle', { fontSize: val }))()
  }
}
</script>

<style scoped>
.font-size-select {
  font-size: 14px;
}
</style>


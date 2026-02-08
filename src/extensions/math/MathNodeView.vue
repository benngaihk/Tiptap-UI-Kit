<template>
  <NodeViewWrapper
    :class="['math-node-wrapper', { 'is-block': node.attrs.block, 'is-editing': isEditing, 'is-selected': selected }]"
    :as="node.attrs.block ? 'div' : 'span'"
  >
    <!-- 编辑模式 -->
    <div v-if="isEditing" class="math-editor">
      <textarea
        ref="textareaRef"
        v-model="latexInput"
        class="math-editor__input"
        :placeholder="t('editor.mathPlaceholder')"
        @keydown.enter.ctrl="saveAndClose"
        @keydown.escape="cancelEdit"
        @blur="handleBlur"
      />
      <div class="math-editor__preview">
        <span v-if="renderError" class="math-error">{{ renderError }}</span>
        <span v-else v-html="previewHtml" />
      </div>
      <div class="math-editor__actions">
        <button type="button" class="math-btn math-btn--cancel" @click="cancelEdit">
          {{ t('editor.cancel') }}
        </button>
        <button type="button" class="math-btn math-btn--save" @click="saveAndClose">
          {{ t('editor.accept') }}
        </button>
      </div>
    </div>

    <!-- 显示模式 -->
    <span
      v-else
      class="math-display"
      :class="{ 'math-empty': !node.attrs.latex }"
      @dblclick="startEdit"
      @click="handleClick"
      v-html="displayHtml"
    />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { t } from '@/locales'

const props = defineProps(nodeViewProps)

const isEditing = ref(false)
const latexInput = ref('')
const renderError = ref<string | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 渲染 LaTeX 为 HTML
function renderLatex(latex: string, displayMode: boolean): string {
  if (!latex.trim()) {
    return `<span class="math-placeholder">${t('editor.mathEmpty')}</span>`
  }

  try {
    renderError.value = null
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: '#cc0000',
      strict: false,
      trust: false,
    })
  } catch (e) {
    renderError.value = e instanceof Error ? e.message : 'Render error'
    return `<span class="math-error">${renderError.value}</span>`
  }
}

// 显示模式的 HTML
const displayHtml = computed(() => {
  return renderLatex(props.node.attrs.latex, props.node.attrs.block)
})

// 预览 HTML
const previewHtml = computed(() => {
  return renderLatex(latexInput.value, props.node.attrs.block)
})

// 开始编辑
function startEdit() {
  if (props.editor?.isEditable === false) return

  isEditing.value = true
  latexInput.value = props.node.attrs.latex || ''

  nextTick(() => {
    textareaRef.value?.focus()
    textareaRef.value?.select()
  })
}

// 保存并关闭
function saveAndClose() {
  if (latexInput.value !== props.node.attrs.latex) {
    props.updateAttributes({ latex: latexInput.value })
  }
  isEditing.value = false
}

// 取消编辑
function cancelEdit() {
  isEditing.value = false
  latexInput.value = props.node.attrs.latex || ''
}

// 处理失焦
function handleBlur(e: FocusEvent) {
  // 如果点击的是编辑器内的按钮，不要关闭
  const relatedTarget = e.relatedTarget as HTMLElement
  if (relatedTarget?.closest('.math-editor')) {
    return
  }
  saveAndClose()
}

// 处理点击（选中节点）
function handleClick() {
  const pos = props.getPos()
  if (typeof pos === 'number') {
    props.editor?.commands.setNodeSelection(pos)
  }
}

// 如果是新建的空公式，自动进入编辑模式
onMounted(() => {
  if (!props.node.attrs.latex && props.editor?.isEditable) {
    startEdit()
  }
})

// 监听节点变化
watch(
  () => props.node.attrs.latex,
  (newLatex) => {
    if (!isEditing.value) {
      latexInput.value = newLatex || ''
    }
  }
)
</script>

<style>
.math-node-wrapper {
  display: inline;
  position: relative;
}

.math-node-wrapper.is-block {
  display: block;
  text-align: center;
  margin: 1em 0;
}

.math-node-wrapper.is-selected .math-display {
  outline: 2px solid var(--tp-color-primary, #1890ff);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 显示模式 */
.math-display {
  display: inline-block;
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.math-display:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.math-node-wrapper.is-block .math-display {
  display: block;
  padding: 8px 16px;
}

.math-empty {
  color: var(--tp-color-text-muted, #999);
  font-style: italic;
}

.math-placeholder {
  color: var(--tp-color-text-muted, #999);
  font-style: italic;
}

.math-error {
  color: #cc0000;
  font-size: 12px;
}

/* 编辑模式 */
.math-editor {
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  min-width: 300px;
  padding: 12px;
  background: var(--tp-color-bg, #fff);
  border: 1px solid var(--tp-color-border, #e5e5e5);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.math-node-wrapper.is-block .math-editor {
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.math-editor__input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--tp-color-text, #1a1a1a);
  background: var(--tp-color-bg-secondary, #f5f5f5);
  border: 1px solid var(--tp-color-border, #e5e5e5);
  border-radius: 4px;
  resize: vertical;
  outline: none;
}

.math-editor__input:focus {
  border-color: var(--tp-color-primary, #1890ff);
}

.math-editor__preview {
  min-height: 40px;
  padding: 8px;
  text-align: center;
  background: var(--tp-color-bg-secondary, #f5f5f5);
  border-radius: 4px;
}

.math-editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.math-btn {
  padding: 4px 12px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.math-btn--cancel {
  color: var(--tp-color-text, #1a1a1a);
  background: var(--tp-color-bg-secondary, #f5f5f5);
}

.math-btn--cancel:hover {
  background: var(--tp-color-border, #e5e5e5);
}

.math-btn--save {
  color: #fff;
  background: var(--tp-color-primary, #1890ff);
}

.math-btn--save:hover {
  background: #40a9ff;
}

/* 深色模式 */
[data-theme="dark"] .math-editor {
  background: #1f1f1f;
  border-color: #404040;
}

[data-theme="dark"] .math-editor__input {
  color: #e5e5e5;
  background: #2d2d2d;
  border-color: #404040;
}

[data-theme="dark"] .math-editor__preview {
  background: #2d2d2d;
}

[data-theme="dark"] .math-btn--cancel {
  color: #e5e5e5;
  background: #2d2d2d;
}

[data-theme="dark"] .math-btn--cancel:hover {
  background: #404040;
}
</style>

<template>
  <div
    class="tiptap-editor"
    :class="{
      'tiptap-editor--readonly': readonly,
      'tiptap-editor--word-mode': wordMode
    }"
    :data-theme="theme"
  >
    <!-- Toolbar (Pluggable) -->
    <EditorToolbar
      v-if="showToolbar && editor"
      :editor="editor"
      :config="toolbarConfig"
      :ai-adapter="aiAdapter"
    />

    <!-- Editor Content -->
    <div class="tiptap-editor__content">
      <EditorContent v-if="editor" :editor="editor" />
    </div>

    <!-- Footer -->
    <div v-if="showFooter && editor" class="tiptap-editor__footer">
      <span class="tiptap-editor__stats">
        {{ characterCount }} {{ t('editor.characters') }} · {{ wordCount }} {{ t('editor.words') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, provide } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import { TextStyle } from '@tiptap/extension-text-style'

import EditorToolbar from './EditorToolbar.vue'
import { t, createI18n, type LocaleCode } from '@/locales'
import { DEFAULT_TOOLBAR_CONFIG, type ToolbarConfig } from './toolbarConfig'
import type { AiAdapter } from '@/ai'
import { FontSize } from '@/extensions/fontSize'

// Import styles
import '@/styles/index.css'

export interface TiptapEditorProps {
  /** Initial HTML content */
  initialContent?: string
  /** Read-only mode */
  readonly?: boolean
  /** Preview mode (no toolbar, no footer) */
  previewMode?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Language locale */
  locale?: string
  /** Word processing mode (A4 paper style) */
  wordMode?: boolean
  /** Theme: 'light' | 'dark' */
  theme?: 'light' | 'dark'
  /** Toolbar configuration */
  toolbar?: ToolbarConfig
  /** AI adapter (required for AI features) */
  aiAdapter?: AiAdapter
}

const props = withDefaults(defineProps<TiptapEditorProps>(), {
  initialContent: '<p>Start typing...</p>',
  readonly: false,
  previewMode: false,
  placeholder: '',
  locale: 'en-US',
  wordMode: false,
  theme: 'light',
})

const emit = defineEmits<{
  (e: 'update', content: any): void
  (e: 'ready', editor: Editor): void
}>()

// Initialize i18n
createI18n({ locale: props.locale as LocaleCode })

// Provide theme to child components
provide('tiptap-theme', props.theme)

// Editor settings
const showToolbar = computed(() => !props.previewMode && !props.readonly)
const showFooter = computed(() => !props.previewMode)
const toolbarConfig = computed(() => props.toolbar || DEFAULT_TOOLBAR_CONFIG)

// Editor instance
const editor = shallowRef<Editor | null>(null)

const characterCount = computed(() => editor.value?.storage.characterCount?.characters() || 0)
const wordCount = computed(() => editor.value?.storage.characterCount?.words() || 0)

// Initialize editor
onMounted(() => {
  editor.value = new Editor({
    editable: !props.readonly,
    content: props.initialContent,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: props.placeholder || t('editor.placeholder'),
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-prose',
      },
    },
    onUpdate: ({ editor }) => {
      emit('update', editor.getJSON())
    },
    onCreate: ({ editor }) => {
      emit('ready', editor as Editor)
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Expose methods
defineExpose({
  getEditor: () => editor.value,
  getJSON: () => editor.value?.getJSON() || null,
  getHTML: () => editor.value?.getHTML() || '',
  getText: () => editor.value?.getText() || '',
})
</script>

<style scoped>
.tiptap-editor {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  background: var(--tiptap-bg, #fff);
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: var(--tiptap-radius-md, 8px);
  overflow: hidden;
}

.tiptap-editor__content {
  flex: 1;
  padding: 16px 24px;
  overflow-y: auto;
}

.tiptap-editor__content :deep(.tiptap-prose) {
  outline: none;
  min-height: 200px;
  font-family: var(--tiptap-font-family);
  font-size: var(--tiptap-font-size, 16px);
  line-height: var(--tiptap-line-height, 1.75);
  color: var(--tiptap-text, #1a1a1a);
}

.tiptap-editor__content :deep(.tiptap-prose p) {
  margin: 0 0 1em;
}

.tiptap-editor__content :deep(.tiptap-prose h1),
.tiptap-editor__content :deep(.tiptap-prose h2),
.tiptap-editor__content :deep(.tiptap-prose h3) {
  margin: 1.5em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
}

.tiptap-editor__content :deep(.tiptap-prose h1) { font-size: 2em; }
.tiptap-editor__content :deep(.tiptap-prose h2) { font-size: 1.5em; }
.tiptap-editor__content :deep(.tiptap-prose h3) { font-size: 1.25em; }

.tiptap-editor__content :deep(.tiptap-prose ul),
.tiptap-editor__content :deep(.tiptap-prose ol) {
  padding-left: 1.5em;
  margin: 0 0 1em;
}

.tiptap-editor__content :deep(.tiptap-prose code) {
  padding: 2px 6px;
  font-family: var(--tiptap-font-mono);
  font-size: 0.9em;
  color: var(--tiptap-code-text, #e11d48);
  background: var(--tiptap-code-bg, #f5f5f5);
  border-radius: var(--tiptap-radius-sm, 4px);
}

.tiptap-editor__content :deep(.tiptap-prose blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid var(--tiptap-blockquote-border, #3b82f6);
  background: var(--tiptap-blockquote-bg, #f9fafb);
}

.tiptap-editor__content :deep(.tiptap-prose a) {
  color: var(--tiptap-link, #3b82f6);
  text-decoration: underline;
}

.tiptap-editor__content :deep(.tiptap-prose .is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  color: var(--tiptap-text-muted, #999);
  pointer-events: none;
}

.tiptap-editor__footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--tiptap-text-secondary, #666);
  border-top: 1px solid var(--tiptap-border, #e5e5e5);
}

/* Word mode */
.tiptap-editor--word-mode .tiptap-editor__content {
  padding: 48px 60px;
  background: #f5f5f5;
}

.tiptap-editor--word-mode .tiptap-editor__content :deep(.tiptap-prose) {
  max-width: 794px;
  min-height: 1123px;
  margin: 0 auto;
  padding: 60px;
  background: var(--tiptap-bg, #fff);
  box-shadow: var(--tiptap-shadow-lg);
}
</style>

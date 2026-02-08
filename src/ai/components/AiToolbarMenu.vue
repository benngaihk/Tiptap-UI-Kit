<template>
  <div class="ai-toolbar-menu" ref="containerRef">
    <BaseTooltip :title="isConfigured ? 'AI 助手' : t('aiSettings.title')">
      <button
        class="ai-toolbar-trigger"
        :class="{ 'is-open': isOpen, 'is-loading': isLoading, 'not-configured': !isConfigured }"
        type="button"
        @click="toggleMenu"
        :disabled="isLoading"
      >
        <span class="ai-icon">✨</span>
        <span class="ai-label">AI</span>
        <span v-if="isLoading" class="ai-spinner" />
        <span v-if="!isConfigured" class="ai-badge">!</span>
      </button>
    </BaseTooltip>

    <Transition name="ai-menu-fade">
      <div v-if="isOpen" class="ai-menu-dropdown">
        <!-- Not configured hint -->
        <div v-if="!isConfigured" class="ai-menu-hint">
          {{ t('aiSettings.apiKeyHint') }}
        </div>

        <button
          v-for="item in menuItems"
          :key="item.key"
          class="ai-menu-item"
          :class="{ 'is-disabled': !isConfigured && item.key !== 'settings' }"
          type="button"
          @click="handleItemClick(item)"
          :disabled="!isConfigured && item.key !== 'settings'"
        >
          <span class="ai-menu-item-icon">{{ item.icon }}</span>
          <span class="ai-menu-item-label">{{ item.label }}</span>
        </button>

        <div class="ai-menu-divider" />

        <div class="ai-menu-custom">
          <input
            v-model="customPrompt"
            type="text"
            class="ai-menu-input"
            :placeholder="t('editor.aiPromptPlaceholder')"
            :disabled="!isConfigured"
            @keydown.enter="handleCustomAi"
          />
          <button
            class="ai-menu-send"
            type="button"
            @click="handleCustomAi"
            :disabled="!customPrompt.trim() || !isConfigured"
          >
            →
          </button>
        </div>

        <div class="ai-menu-divider" />

        <!-- Settings button -->
        <button
          class="ai-menu-item ai-menu-item--settings"
          type="button"
          @click="openSettings"
        >
          <span class="ai-menu-item-icon">⚙️</span>
          <span class="ai-menu-item-label">{{ t('aiSettings.title') }}</span>
          <span v-if="isConfigured" class="ai-status-dot ai-status-dot--success" />
          <span v-else class="ai-status-dot ai-status-dot--warning" />
        </button>
      </div>
    </Transition>

    <!-- Settings Modal -->
    <AiSettingsModal v-model:open="showSettings" @saved="onSettingsSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import BaseTooltip from '@/ui/BaseTooltip.vue'
import { t } from '@/locales'
import { useAi } from '@/ai'
import type { AiAdapter } from '@/ai'
import { useAiConfig } from '@/ai/config/useAiConfig'
import AiSettingsModal from './AiSettingsModal.vue'

interface Props {
  editor: Editor | null
  adapter: AiAdapter
}

const props = defineProps<Props>()

const isOpen = ref(false)
const customPrompt = ref('')
const containerRef = ref<HTMLElement | null>(null)
const showSettings = ref(false)

const { isConfigured } = useAiConfig()

const { isLoading, continueWritingStream, polishStream, summarizeStream, translateStream, customAiStream } = useAi({
  adapter: props.adapter,
})

const menuItems = computed(() => [
  { key: 'continue', label: t('editor.continueWriting'), icon: '✍️', action: handleContinue },
  { key: 'polish', label: t('editor.polish'), icon: '✨', action: handlePolish },
  { key: 'summarize', label: t('editor.summarize'), icon: '📝', action: handleSummarize },
  { key: 'translate-en', label: t('editor.lang.en'), icon: '🌐', action: () => handleTranslate('en') },
  { key: 'translate-zh', label: t('editor.lang.zh-CN'), icon: '🇨🇳', action: () => handleTranslate('zh-CN') },
])

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const getSelectedText = () => {
  if (!props.editor) return ''
  const { from, to } = props.editor.state.selection
  return props.editor.state.doc.textBetween(from, to, ' ')
}

const insertAtCursor = (text: string) => {
  props.editor?.chain().focus().insertContent(text).run()
}

const replaceSelection = (text: string) => {
  props.editor?.chain().focus().deleteSelection().insertContent(text).run()
}

const handleContinue = async () => {
  isOpen.value = false
  const text = getSelectedText() || props.editor?.getText() || ''
  if (!text.trim()) return

  // Move cursor to end of selection
  props.editor?.commands.focus('end')

  await continueWritingStream(text, {
    onToken: (token) => insertAtCursor(token),
    onError: (error) => console.error('AI Error:', error),
  })
}

const handlePolish = async () => {
  isOpen.value = false
  const text = getSelectedText()
  if (!text.trim()) return

  let result = ''
  await polishStream(text, {
    onToken: (token) => { result += token },
    onComplete: () => replaceSelection(result),
    onError: (error) => console.error('AI Error:', error),
  })
}

const handleSummarize = async () => {
  isOpen.value = false
  const text = getSelectedText() || props.editor?.getText() || ''
  if (!text.trim()) return

  await summarizeStream(text, {
    onToken: (token) => insertAtCursor(token),
    onError: (error) => console.error('AI Error:', error),
  })
}

const handleTranslate = async (lang: string) => {
  isOpen.value = false
  const text = getSelectedText()
  if (!text.trim()) return

  let result = ''
  await translateStream(text, lang, {
    onToken: (token) => { result += token },
    onComplete: () => replaceSelection(result),
    onError: (error) => console.error('AI Error:', error),
  })
}

const handleCustomAi = async () => {
  if (!customPrompt.value.trim()) return
  isOpen.value = false
  
  const text = getSelectedText() || props.editor?.getText() || ''
  const instruction = customPrompt.value
  customPrompt.value = ''

  await customAiStream(text, instruction, {
    onToken: (token) => insertAtCursor(token),
    onError: (error) => console.error('AI Error:', error),
  })
}

const handleItemClick = (item: { action: () => void }) => {
  item.action()
}

const openSettings = () => {
  isOpen.value = false
  showSettings.value = true
}

const onSettingsSaved = () => {
  // Settings saved, menu will update via reactive isConfigured
}

// Close on click outside
const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ai-toolbar-menu {
  position: relative;
  display: inline-flex;
}

.ai-toolbar-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.ai-toolbar-trigger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-toolbar-trigger.is-open {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.ai-toolbar-trigger:disabled {
  opacity: 0.7;
  cursor: wait;
}

.ai-icon {
  font-size: 14px;
}

.ai-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dropdown */
.ai-menu-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--tiptap-z-bubble, 200);
  min-width: 200px;
  margin-top: 8px;
  padding: 8px;
  background: var(--tiptap-bg, #fff);
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.ai-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--tiptap-text, #1a1a1a);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.ai-menu-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.ai-menu-item-icon {
  font-size: 16px;
}

.ai-menu-divider {
  height: 1px;
  margin: 8px 0;
  background: var(--tiptap-border, #e5e5e5);
}

.ai-menu-custom {
  display: flex;
  gap: 8px;
  padding: 4px;
}

.ai-menu-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--tiptap-text, #1a1a1a);
  background: var(--tiptap-bg-secondary, #f5f5f5);
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.ai-menu-input:focus {
  border-color: #667eea;
}

.ai-menu-input::placeholder {
  color: var(--tiptap-text-muted, #999);
}

.ai-menu-send {
  width: 36px;
  height: 36px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  transition: opacity 0.2s ease;
}

.ai-menu-send:hover:not(:disabled) {
  opacity: 0.9;
}

.ai-menu-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Not configured badge */
.ai-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background: #ff6b6b;
  border-radius: 50%;
}

.ai-toolbar-trigger.not-configured {
  background: linear-gradient(135deg, #8e9aaf 0%, #667085 100%);
}

/* Menu hint */
.ai-menu-hint {
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--tiptap-text-muted, #666);
  background: rgba(102, 126, 234, 0.08);
  border-radius: 8px;
}

/* Disabled menu items */
.ai-menu-item.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-menu-item.is-disabled:hover {
  background: transparent;
}

/* Settings item */
.ai-menu-item--settings {
  position: relative;
}

/* Status dot */
.ai-status-dot {
  width: 8px;
  height: 8px;
  margin-left: auto;
  border-radius: 50%;
}

.ai-status-dot--success {
  background: #52c41a;
}

.ai-status-dot--warning {
  background: #faad14;
}

/* Transition */
.ai-menu-fade-enter-active,
.ai-menu-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.ai-menu-fade-enter-from,
.ai-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

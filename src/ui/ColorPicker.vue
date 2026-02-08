<template>
  <div class="tt-color-picker" ref="containerRef">
    <!-- Trigger button -->
    <BaseTooltip :title="title">
      <button
        class="tt-color-picker-trigger"
        type="button"
        @click="togglePicker"
      >
        <slot name="icon">
          <span class="tt-color-picker-icon">A</span>
        </slot>
        <span
          class="tt-color-picker-indicator"
          :style="{ backgroundColor: modelValue || 'transparent' }"
        />
      </button>
    </BaseTooltip>

    <!-- Popover -->
    <Transition name="tt-picker-fade">
      <div
        v-if="isOpen"
        class="tt-color-picker-popover"
        @click.stop
      >
        <!-- Header -->
        <div class="tt-color-picker-header">
          <div
            class="tt-color-picker-preview"
            :style="{ backgroundColor: modelValue || '#000000' }"
          />
          <span class="tt-color-picker-title">{{ t('editor.colors') }}</span>
          <button
            class="tt-color-picker-clear"
            type="button"
            @click="handleClear"
            :title="t('editor.clearColor')"
          >
            ✕
          </button>
        </div>

        <!-- Color Grid -->
        <div class="tt-color-picker-grid">
          <button
            v-for="color in colors"
            :key="color"
            class="tt-color-picker-item"
            :class="{ 'is-selected': normalizeColor(color) === normalizeColor(modelValue) }"
            :style="{ backgroundColor: color }"
            type="button"
            @click="handleSelect(color)"
            :title="color"
          />
        </div>

        <!-- Custom color input -->
        <div class="tt-color-picker-custom">
          <input
            type="color"
            :value="modelValue || '#000000'"
            @input="handleCustomInput"
            class="tt-color-picker-input"
          />
          <input
            type="text"
            :value="modelValue || '#000000'"
            @change="handleTextInput"
            class="tt-color-picker-text"
            placeholder="#000000"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import BaseTooltip from './BaseTooltip.vue'
import { t } from '@/locales'

interface Props {
  modelValue?: string
  type?: 'text' | 'background'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  title: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
  (e: 'select', value: string): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// Default colors (same as source)
const colors = [
  '#ffffff', '#f2f2f2', '#e0e0e0', '#ffcccc', '#ffcc99', '#ffffcc', '#ccffcc', '#cce5ff', '#e4d9ff', '#ffd9e6',
  '#f5f5f5', '#e6e6e6', '#c0c0c0', '#ff9999', '#ff9966', '#ffff99', '#99ff99', '#99ccff', '#ccb3ff', '#ffb3cc',
  '#d9d9d9', '#cccccc', '#808080', '#ff6666', '#ff9900', '#ffff00', '#66ff66', '#6699ff', '#9966ff', '#ff6699',
  '#a6a6a6', '#999999', '#595959', '#ff0000', '#ff7700', '#ffd700', '#00ff00', '#0066ff', '#6600cc', '#ff0066',
  '#000000', '#666666', '#404040', '#990000', '#cc6600', '#cccc00', '#006600', '#003366', '#330066', '#cc0033',
]

const normalizeColor = (color?: string) => color?.toLowerCase().trim() || ''

const togglePicker = () => {
  isOpen.value = !isOpen.value
}

const handleSelect = (color: string) => {
  emit('update:modelValue', color)
  emit('select', color)
  isOpen.value = false
}

const handleClear = () => {
  const defaultColor = props.type === 'text' ? '#000000' : 'transparent'
  emit('update:modelValue', defaultColor)
  emit('select', defaultColor)
}

const handleCustomInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('select', value)
}

const handleTextInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (/^#[0-9A-Fa-f]{3,6}$/.test(value)) {
    emit('update:modelValue', value)
    emit('select', value)
  }
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
.tt-color-picker {
  position: relative;
  display: inline-flex;
}

.tt-color-picker-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--tiptap-radius-sm, 4px);
  transition: background var(--tiptap-transition-normal, 0.2s ease);
}

.tt-color-picker-trigger:hover {
  background: var(--tiptap-toolbar-btn-hover, #f5f5f5);
}

.tt-color-picker-icon {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  color: var(--menu-btn-color, #333);
}

.tt-color-picker-indicator {
  width: 16px;
  height: 3px;
  margin-top: 2px;
  border-radius: 1px;
}

/* Popover */
.tt-color-picker-popover {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--tiptap-z-bubble, 200);
  min-width: 280px;
  padding: 12px;
  margin-top: 4px;
  background: var(--tiptap-bg, #fff);
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: var(--tiptap-radius-md, 8px);
  box-shadow: var(--tiptap-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
}

.tt-color-picker-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tt-color-picker-preview {
  width: 32px;
  height: 24px;
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: var(--tiptap-radius-sm, 4px);
}

.tt-color-picker-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--tiptap-text, #1a1a1a);
}

.tt-color-picker-clear {
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 14px;
  color: var(--tiptap-text-muted, #999);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--tiptap-radius-sm, 4px);
  transition: all var(--tiptap-transition-fast, 0.1s ease);
}

.tt-color-picker-clear:hover {
  color: var(--tiptap-text, #1a1a1a);
  background: var(--tiptap-toolbar-btn-hover, #f5f5f5);
}

/* Grid */
.tt-color-picker-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.tt-color-picker-item {
  width: 22px;
  height: 22px;
  padding: 0;
  cursor: pointer;
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: 50%;
  transition: transform var(--tiptap-transition-fast, 0.1s ease);
}

.tt-color-picker-item:hover {
  transform: scale(1.2);
  box-shadow: var(--tiptap-shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
}

.tt-color-picker-item.is-selected {
  transform: scale(1.1);
  border-color: var(--tiptap-primary, #3b82f6);
  box-shadow: 0 0 0 2px var(--tiptap-primary-light, rgba(59,130,246,0.2));
}

/* Custom input */
.tt-color-picker-custom {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--tiptap-border, #e5e5e5);
}

.tt-color-picker-input {
  width: 48px;
  height: 32px;
  padding: 0;
  cursor: pointer;
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: var(--tiptap-radius-sm, 4px);
}

.tt-color-picker-text {
  flex: 1;
  height: 32px;
  padding: 0 8px;
  font-family: var(--tiptap-font-mono, monospace);
  font-size: 13px;
  color: var(--tiptap-text, #1a1a1a);
  background: var(--tiptap-bg, #fff);
  border: 1px solid var(--tiptap-border, #e5e5e5);
  border-radius: var(--tiptap-radius-sm, 4px);
}

.tt-color-picker-text:focus {
  border-color: var(--tiptap-primary, #3b82f6);
  outline: none;
}

/* Transition */
.tt-picker-fade-enter-active,
.tt-picker-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tt-picker-fade-enter-from,
.tt-picker-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

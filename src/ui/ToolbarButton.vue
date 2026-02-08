<template>
  <a-tooltip :title="title" placement="top">
    <button
      :class="[
        'tt-toolbar-button',
        `tt-toolbar-button--${size}`,
        { 'is-active': active, 'is-danger': danger }
      ]"
      :disabled="disabled"
      type="button"
      @click="onClick"
      @dblclick="onDblClick"
    >
      <span class="tt-toolbar-button__content">
        <slot name="icon">
          <component v-if="icon" :is="icon" />
        </slot>
        <slot />
      </span>
    </button>
  </a-tooltip>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Tooltip as ATooltip } from 'ant-design-vue'

interface Props {
  icon?: Component
  title: string
  active?: boolean
  disabled?: boolean
  danger?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
  danger: false,
  size: 'medium'
})

const emit = defineEmits<{ (e: 'click'): void; (e: 'dblclick'): void }>()

function onClick() {
  if (props.disabled) return
  emit('click')
}

function onDblClick() {
  if (props.disabled) return
  emit('dblclick')
}
</script>

<style>
/* 使用全局样式以支持深色模式（因为需要匹配父级的 data-theme 属性）*/
.tt-toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 0 6px;
  line-height: 1;
  color: var(--menu-btn-color, #262626);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tt-toolbar-button:disabled {
  color: #bfbfbf;
  cursor: not-allowed;
  opacity: 0.5;
}

.tt-toolbar-button--small {
  height: 28px;
}

.tt-toolbar-button--medium {
  height: 32px;
}

.tt-toolbar-button--large {
  height: 36px;
}

.tt-toolbar-button:hover:not(:disabled) {
  background: var(--menu-btn-hover-bg, #f5f5f5);
}

.tt-toolbar-button:active:not(:disabled) {
  background: #e8e8e8;
}

[data-theme="dark"] .tt-toolbar-button:active:not(:disabled) {
  background: #262626;
}

.tt-toolbar-button.is-active {
  color: var(--menu-primary, #1890ff);
  background: #e6f4ff;
}

[data-theme="dark"] .tt-toolbar-button.is-active {
  color: #4fc3f7;
  background: #1a4d6e;
}

.tt-toolbar-button.is-danger {
  color: var(--danger-color, #ff4d4f);
}

.tt-toolbar-button.is-danger:hover:not(:disabled) {
  color: #fff;
  background: var(--danger-color, #ff4d4f);
}

.tt-toolbar-button__content {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.tt-toolbar-button__content .anticon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
}
</style>

<template>
  <div
    class="tt-tooltip-wrapper"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @focus="showTooltip = true"
    @blur="showTooltip = false"
  >
    <slot />
    <Transition name="tt-tooltip-fade">
      <div
        v-if="showTooltip && title"
        class="tt-tooltip"
        :class="`tt-tooltip--${placement}`"
      >
        {{ title }}
        <div class="tt-tooltip__arrow" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
  placement: 'top',
})

const showTooltip = ref(false)
</script>

<style scoped>
.tt-tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tt-tooltip {
  position: absolute;
  z-index: var(--tiptap-z-bubble, 200);
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.85);
  border-radius: var(--tiptap-radius-sm, 4px);
}

.tt-tooltip--top {
  bottom: 100%;
  left: 50%;
  margin-bottom: 8px;
  transform: translateX(-50%);
}

.tt-tooltip--bottom {
  top: 100%;
  left: 50%;
  margin-top: 8px;
  transform: translateX(-50%);
}

.tt-tooltip--left {
  top: 50%;
  right: 100%;
  margin-right: 8px;
  transform: translateY(-50%);
}

.tt-tooltip--right {
  top: 50%;
  left: 100%;
  margin-left: 8px;
  transform: translateY(-50%);
}

.tt-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 4px solid transparent;
}

.tt-tooltip--top .tt-tooltip__arrow {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: rgba(0, 0, 0, 0.85);
}

.tt-tooltip--bottom .tt-tooltip__arrow {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: rgba(0, 0, 0, 0.85);
}

/* Transitions */
.tt-tooltip-fade-enter-active,
.tt-tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tt-tooltip-fade-enter-from,
.tt-tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>

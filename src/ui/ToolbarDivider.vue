<template>
  <div :class="['tt-toolbar-divider', `tt-toolbar-divider--${direction}`]" :style="dividerStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  direction?: 'vertical' | 'horizontal'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  color: '#e8e8e8'
})

const dividerStyle = computed(() => {
  return props.direction === 'vertical'
    ? { width: '1px', height: '100%', backgroundColor: props.color, marginLeft: '8px', marginRight: '8px' }
    : { height: '1px', width: '100%', backgroundColor: props.color, marginTop: '8px', marginBottom: '8px' }
})
</script>

<style scoped>
.tt-toolbar-divider {
  flex-shrink: 0;
}

.tt-toolbar-divider--vertical { align-self: stretch; }

.tt-toolbar-divider--horizontal { width: 100%; }
</style>


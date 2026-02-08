<template>
  <div
    :class="[
      'toolbar-group',
      `toolbar-group--${direction}`,
      { 'toolbar-group--with-divider': divider }
    ]"
    :style="groupStyle"
  >
    <slot />

    <!-- 分隔线 -->
    <ToolbarDivider
      v-if="divider"
      :direction="dividerDirection"
      :color="computedDividerColor"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePreferences } from '@/adapters'
import { ToolbarDivider } from './index'

interface Props {
  direction?: 'horizontal' | 'vertical'
  gap?: number
  divider?: boolean
  dividerColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  gap: 4,
  divider: false,
  dividerColor: undefined
})

const { isDark } = usePreferences()

const groupStyle = computed(() => ({
  gap: `${props.gap}px`
}))

const dividerDirection = computed(() => {
  return props.direction === 'horizontal' ? 'vertical' : 'horizontal'
})

const computedDividerColor = computed(() => {
  if (props.dividerColor) {
    return props.dividerColor
  }
  return isDark.value ? '#434343' : '#e8e8e8'
})
</script>

<style scoped>
.toolbar-group {
  display: inline-flex;
  align-items: center;
}

.toolbar-group--horizontal {
  flex-direction: row;
}

.toolbar-group--vertical {
  flex-direction: column;
}

/* .toolbar-group--with-divider - 分隔线已经包含在组内，不需要额外样式 */
</style>


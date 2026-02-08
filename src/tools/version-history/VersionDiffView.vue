<template>
  <div class="version-diff-view">
    <div
      v-for="(change, index) in changes"
      :key="index"
      class="diff-line"
      :class="`diff-line--${change.type}`"
    >
      <span class="diff-line__indicator">
        {{ change.type === 'add' ? '+' : change.type === 'remove' ? '-' : ' ' }}
      </span>
      <span class="diff-line__content">{{ change.text || ' ' }}</span>
    </div>
    <div v-if="changes.length === 0" class="diff-empty">
      {{ t('versionHistory.noDiff') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import type { DiffChange } from './types'

interface Props {
  changes: DiffChange[]
}

defineProps<Props>()
</script>

<style scoped>
.version-diff-view {
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.diff-line {
  display: flex;
  padding: 2px 16px;
}

.diff-line--add {
  background-color: rgba(82, 196, 26, 0.15);
}

.diff-line--remove {
  background-color: rgba(255, 77, 79, 0.15);
}

.diff-line--unchanged {
  background-color: transparent;
}

.diff-line__indicator {
  width: 20px;
  flex-shrink: 0;
  font-weight: bold;
}

.diff-line--add .diff-line__indicator {
  color: #52c41a;
}

.diff-line--remove .diff-line__indicator {
  color: #ff4d4f;
}

.diff-line__content {
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
}

.diff-empty {
  padding: 20px 16px;
  text-align: center;
  color: var(--tp-color-text-muted, #999);
}

/* 深色模式 */
[data-theme="dark"] .diff-line--add {
  background-color: rgba(82, 196, 26, 0.2);
}

[data-theme="dark"] .diff-line--remove {
  background-color: rgba(255, 77, 79, 0.2);
}
</style>

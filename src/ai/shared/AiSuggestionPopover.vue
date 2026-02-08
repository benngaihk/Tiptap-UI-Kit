<template>
  <Popover
    :open="visible"
    :getPopupContainer="getPopupContainer"
    placement="bottomLeft"
    :trigger="[]"
    overlayClassName="ai-suggestion-popover"
    @update:open="handleVisibleChange"
  >
    <template #content>
      <div class="ai-suggestion-content">
        <div class="ai-suggestion-header">
          <span class="ai-suggestion-title">{{ t('editor.aiSuggestion') }}</span>
          <LoadingOutlined v-if="isStreaming" class="ai-loading-icon" />
        </div>

        <div class="ai-suggestion-body">
          <!-- 只在有原文时显示原文框 -->
          <template v-if="originalText">
            <div class="original-text">
              <div class="text-label">{{ t('editor.originalText') }}</div>
              <div class="text-content">{{ originalText }}</div>
            </div>

            <ArrowDownOutlined class="arrow-icon" />
          </template>

          <div class="suggested-text">
            <div class="text-label">{{ originalText ? t('editor.suggestedText') : t('editor.aiContinueWriting') }}</div>
            <div class="text-content">{{ suggestedText || t('editor.generating') }}</div>
          </div>
        </div>

        <div class="ai-suggestion-footer">
          <a-button size="small" @click="handleCancel" :disabled="isStreaming">
            {{ t('editor.cancel') }}
          </a-button>
          <div class="footer-right">
            <a-button
              size="small"
              @click="handleReject"
              :disabled="isStreaming"
            >
              {{ t('editor.reject') }}
            </a-button>
            <a-button
              type="primary"
              size="small"
              @click="handleAccept"
              :disabled="isStreaming"
            >
              {{ t('editor.accept') }}
            </a-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 用一个隐藏的元素来定位 Popover -->
    <span ref="anchorRef" :style="anchorStyle as any"></span>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Popover, Button as AButton } from 'ant-design-vue';
import { LoadingOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
import { t } from '@/locales';

export interface AiSuggestionPopoverProps {
  visible: boolean;
  originalText: string;
  suggestedText: string;
  isStreaming: boolean;
  position?: { top: number; left: number };
  editorElement?: HTMLElement;
}

const props = withDefaults(defineProps<AiSuggestionPopoverProps>(), {
  visible: false,
  originalText: '',
  suggestedText: '',
  isStreaming: false,
});

const emit = defineEmits<{
  'update:visible': [value: boolean];
  accept: [];
  reject: [];
  cancel: [];
}>();

const anchorRef = ref<HTMLElement>();

const anchorStyle = computed(() => {
  if (!props.position) {
    return {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '0px',
      height: '0px',
      pointerEvents: 'none',
    };
  }

  return {
    position: 'absolute',
    top: `${props.position.top}px`,
    left: `${props.position.left}px`,
    width: '0px',
    height: '0px',
    pointerEvents: 'none',
  };
});

const getPopupContainer = () => {
  return props.editorElement || document.body;
};

const handleAccept = () => {
  emit('accept');
};

const handleReject = () => {
  emit('reject');
};

const handleCancel = () => {
  emit('cancel');
};

const handleVisibleChange = (val: boolean) => {
  emit('update:visible', val);
  if (!val) {
    emit('cancel');
  }
};
</script>

<style scoped>
.ai-suggestion-content {
  min-width: 300px;
  max-width: 500px;
}

.ai-suggestion-header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.ai-suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.ai-loading-icon {
  font-size: 14px;
  color: #1890ff;
}

.ai-suggestion-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.original-text,
.suggested-text {
  padding: 8px;
  border-radius: 4px;
}

.original-text {
  background-color: #fff2e8;
  border: 1px solid #ffbb96;
}

.suggested-text {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.text-label {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #8c8c8c;
}

.text-content {
  font-size: 13px;
  line-height: 1.6;
  color: #262626;
  word-break: break-word;
  white-space: pre-wrap;
}

.arrow-icon {
  align-self: center;
  margin: 4px 0;
  font-size: 16px;
  color: #1890ff;
}

.ai-suggestion-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.footer-right {
  display: flex;
  gap: 8px;
}
</style>

<style>
.ai-suggestion-popover .ant-popover-inner {
  box-shadow:
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
}

/* 暗黑模式 */
:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-popover .ant-popover-inner {
  background: #1f1f1f;
  box-shadow:
    0 3px 6px -4px rgb(0 0 0 / 48%),
    0 6px 16px 0 rgb(0 0 0 / 32%),
    0 9px 28px 8px rgb(0 0 0 / 20%);
}

:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-content .ai-suggestion-header {
  border-bottom-color: #434343;
}

:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-content .original-text {
  background-color: rgba(250, 173, 20, 0.15);
  border-color: rgba(250, 173, 20, 0.3);
}

:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-content .suggested-text {
  background-color: rgba(24, 144, 255, 0.15);
  border-color: rgba(24, 144, 255, 0.3);
}

:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-content .text-label {
  color: rgba(255, 255, 255, 0.45);
}

:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-content .text-content {
  color: rgba(255, 255, 255, 0.85);
}

:where([data-theme="dark"], [data-theme="dark"] *) .ai-suggestion-content .ai-suggestion-footer {
  border-top-color: #434343;
}
</style>


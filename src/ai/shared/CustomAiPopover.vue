<template>
  <Popover
    :open="visible"
    :getPopupContainer="getPopupContainer"
    placement="bottomLeft"
    :trigger="[]"
    overlayClassName="custom-ai-popover"
    @update:open="handleVisibleChange"
  >
    <template #content>
      <div class="custom-ai-content">
        <!-- 输入阶段 -->
        <div v-if="!isExecuting && !isStreaming" class="custom-ai-input-stage">
          <div class="custom-ai-header">
            <span class="custom-ai-title">{{ t('editor.customAiCommand') }}</span>
          </div>

          <div v-if="originalText" class="custom-ai-selected-text">
            <div class="text-label">{{ t('editor.selectedContent') }}</div>
            <div class="text-content">{{ originalText }}</div>
          </div>

          <div class="custom-ai-prompt-input">
            <a-textarea
              ref="promptInputRef"
              v-model:value="promptInput"
              :placeholder="t('editor.aiPromptPlaceholder')"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              @keydown.ctrl.enter="handleExecute"
            />
          </div>

          <div class="custom-ai-footer">
            <a-button size="small" @click="handleCancel">{{ t('editor.cancel') }}</a-button>
            <a-button
              type="primary"
              size="small"
              @click="handleExecute"
              :disabled="!promptInput.trim()"
            >
              {{ t('editor.execute') }}
            </a-button>
          </div>
        </div>

        <!-- 生成阶段 -->
        <div v-else class="custom-ai-result-stage">
          <div class="custom-ai-header">
            <span class="custom-ai-title">{{ t('editor.aiSuggestion') }}</span>
            <LoadingOutlined v-if="isStreaming" class="ai-loading-icon" />
          </div>

          <div v-if="originalText" class="original-text">
            <div class="text-label">{{ t('editor.originalText') }}</div>
            <div class="text-content">{{ originalText }}</div>
          </div>

          <ArrowDownOutlined v-if="originalText" class="arrow-icon" />

          <div class="suggested-text">
            <div class="text-label">
              {{ originalText ? t('editor.suggestedText') : t('editor.generatedContent') }}
            </div>
            <div class="text-content">{{ suggestedText || t('editor.generating') }}</div>
          </div>

          <div class="custom-ai-footer">
            <a-button
              size="small"
              @click="handleCancelGeneration"
              :disabled="isStreaming"
            >
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
      </div>
    </template>

    <!-- 用一个隐藏的元素来定位 Popover -->
    <span :style="anchorStyle as any"></span>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { Popover, Button as AButton, Input as ATextarea } from 'ant-design-vue';
import { LoadingOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
import { t } from '@/locales';

export interface CustomAiPopoverProps {
  visible: boolean;
  originalText: string;
  suggestedText: string;
  isStreaming: boolean;
  isExecuting: boolean;
  position?: { top: number; left: number };
  editorElement?: HTMLElement;
}

const props = withDefaults(defineProps<CustomAiPopoverProps>(), {
  visible: false,
  originalText: '',
  suggestedText: '',
  isStreaming: false,
  isExecuting: false,
});

const emit = defineEmits<{
  'update:visible': [value: boolean];
  execute: [prompt: string];
  accept: [];
  reject: [];
  cancel: [];
  cancelGeneration: [];
}>();

const promptInputRef = ref<typeof ATextarea>();
const promptInput = ref('');

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

const handleExecute = () => {
  if (promptInput.value.trim()) {
    emit('execute', promptInput.value.trim());
  }
};

const handleAccept = () => {
  emit('accept');
  promptInput.value = '';
};

const handleReject = () => {
  emit('reject');
  promptInput.value = '';
};

const handleCancel = () => {
  emit('cancel');
  promptInput.value = '';
};

const handleCancelGeneration = () => {
  emit('cancelGeneration');
  promptInput.value = '';
};

const handleVisibleChange = (val: boolean) => {
  emit('update:visible', val);
  if (!val) {
    emit('cancel');
    promptInput.value = '';
  }
};

// Auto focus when visible
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && !props.isExecuting) {
      nextTick(() => {
        promptInputRef.value?.focus();
      });
    }
  },
);
</script>

<style scoped>
.custom-ai-content {
  min-width: 320px;
  max-width: 500px;
}

.custom-ai-input-stage,
.custom-ai-result-stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.custom-ai-header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.custom-ai-title {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.ai-loading-icon {
  font-size: 14px;
  color: #1890ff;
}

.custom-ai-selected-text,
.original-text,
.suggested-text {
  padding: 8px;
  border-radius: 4px;
}

.custom-ai-selected-text,
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

.custom-ai-prompt-input {
  width: 100%;
}

.custom-ai-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.custom-ai-footer:has(.footer-right) {
  justify-content: space-between;
}

.custom-ai-footer:not(:has(.footer-right)) {
  gap: 8px;
  justify-content: flex-end;
}

.footer-right {
  display: flex;
  gap: 8px;
}
</style>

<style>
.custom-ai-popover .ant-popover-inner {
  box-shadow:
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
}

/* 暗黑模式 */
:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-popover .ant-popover-inner {
  background: #1f1f1f;
  box-shadow:
    0 3px 6px -4px rgb(0 0 0 / 48%),
    0 6px 16px 0 rgb(0 0 0 / 32%),
    0 9px 28px 8px rgb(0 0 0 / 20%);
}

:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .custom-ai-header {
  border-bottom-color: #434343;
}

:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .custom-ai-selected-text,
:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .original-text {
  background-color: rgba(250, 173, 20, 0.15);
  border-color: rgba(250, 173, 20, 0.3);
}

:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .suggested-text {
  background-color: rgba(24, 144, 255, 0.15);
  border-color: rgba(24, 144, 255, 0.3);
}

:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .text-label {
  color: rgba(255, 255, 255, 0.45);
}

:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .text-content {
  color: rgba(255, 255, 255, 0.85);
}

:where([data-theme="dark"], [data-theme="dark"] *) .custom-ai-content .custom-ai-footer {
  border-top-color: #434343;
}
</style>


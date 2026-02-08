<template>
  <a-modal
    v-model:open="visible"
    :title="t('aiSettings.title')"
    :width="520"
    :footer="null"
    @cancel="handleClose"
    class="ai-settings-modal"
  >
    <div class="ai-settings">
      <!-- 提供商选择 -->
      <div class="ai-settings__section">
        <label class="ai-settings__label">{{ t('aiSettings.provider') }}</label>
        <a-select
          v-model:value="formData.provider"
          :options="providerOptions"
          class="ai-settings__select"
          @change="onProviderChange"
        />
        <p v-if="currentProviderInfo?.docsUrl" class="ai-settings__hint">
          <a :href="currentProviderInfo.docsUrl" target="_blank" rel="noopener">
            {{ t('aiSettings.viewDocs') }} →
          </a>
        </p>
      </div>

      <!-- API Key -->
      <div v-if="currentProviderInfo?.requiresApiKey" class="ai-settings__section">
        <label class="ai-settings__label">API Key</label>
        <a-input-password
          v-model:value="formData.apiKey"
          :placeholder="t('aiSettings.apiKeyPlaceholder')"
          class="ai-settings__input"
        />
        <p class="ai-settings__hint">{{ t('aiSettings.apiKeyHint') }}</p>
      </div>

      <!-- 自定义端点 -->
      <div v-if="formData.provider === 'custom' || formData.provider === 'ollama'" class="ai-settings__section">
        <label class="ai-settings__label">{{ t('aiSettings.endpoint') }}</label>
        <a-input
          v-model:value="formData.endpoint"
          :placeholder="currentProviderInfo?.defaultEndpoint || 'https://api.example.com/v1'"
          class="ai-settings__input"
        />
      </div>

      <!-- 模型选择 -->
      <div class="ai-settings__section">
        <label class="ai-settings__label">{{ t('aiSettings.model') }}</label>
        <a-input
          v-model:value="formData.model"
          :placeholder="currentProviderInfo?.defaultModel || 'gpt-4o-mini'"
          class="ai-settings__input"
        />
        <p class="ai-settings__hint">{{ currentProviderInfo?.description }}</p>
      </div>

      <!-- 连接测试 -->
      <div class="ai-settings__section">
        <a-button
          :loading="testStatus === 'testing'"
          :type="testStatus === 'success' ? 'default' : 'primary'"
          @click="handleTest"
        >
          <template #icon>
            <CheckCircleOutlined v-if="testStatus === 'success'" style="color: #52c41a" />
            <CloseCircleOutlined v-else-if="testStatus === 'error'" style="color: #ff4d4f" />
            <ApiOutlined v-else />
          </template>
          {{ testButtonText }}
        </a-button>
        <span v-if="testLatency" class="ai-settings__latency">
          {{ testLatency }}ms
        </span>
        <p v-if="testError" class="ai-settings__error">{{ testError }}</p>
      </div>

      <!-- 启用开关 -->
      <div class="ai-settings__section ai-settings__section--inline">
        <label class="ai-settings__label">{{ t('aiSettings.enableAi') }}</label>
        <a-switch v-model:checked="formData.enabled" />
      </div>

      <!-- 操作按钮 -->
      <div class="ai-settings__actions">
        <a-button @click="handleClear" danger>{{ t('aiSettings.clear') }}</a-button>
        <div class="ai-settings__actions-right">
          <a-button @click="handleClose">{{ t('aiSettings.cancel') }}</a-button>
          <a-button type="primary" @click="handleSave" :disabled="!canSave">
            {{ t('aiSettings.save') }}
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Modal as AModal, Select as ASelect, Input as AInput, Button as AButton, Switch as ASwitch } from 'ant-design-vue'
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { t } from '@/locales'
import { useAiConfig } from '../config/useAiConfig'
import { type AiProvider, type AiUserConfig, AI_PROVIDERS, getProviderInfo, DEFAULT_CONFIG } from '../config/types'

const AInputPassword = AInput.Password

interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const visible = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

const {
  config,
  testConnection,
  saveConfig,
  clearConfig,
} = useAiConfig()

// 表单数据
const formData = reactive<Omit<AiUserConfig, 'updatedAt'>>({
  provider: 'openai',
  apiKey: '',
  endpoint: '',
  model: '',
  timeout: DEFAULT_CONFIG.timeout,
  enabled: true,
})

// 测试状态
const testStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle')
const testError = ref<string | null>(null)
const testLatency = ref<number | null>(null)

// 计算属性
const providerOptions = computed(() =>
  AI_PROVIDERS.map(p => ({
    value: p.id,
    label: p.name,
  }))
)

const currentProviderInfo = computed(() => getProviderInfo(formData.provider))

const canSave = computed(() => {
  const info = currentProviderInfo.value
  if (!info) return false
  if (info.requiresApiKey && !formData.apiKey) return false
  if (formData.provider === 'custom' && !formData.endpoint) return false
  return true
})

const testButtonText = computed(() => {
  switch (testStatus.value) {
    case 'testing': return t('aiSettings.testing')
    case 'success': return t('aiSettings.testSuccess')
    case 'error': return t('aiSettings.testFailed')
    default: return t('aiSettings.testConnection')
  }
})

// 监听弹窗打开，初始化表单
watch(() => props.open, (isOpen) => {
  if (isOpen && config.value) {
    Object.assign(formData, {
      provider: config.value.provider,
      apiKey: config.value.apiKey,
      endpoint: config.value.endpoint || '',
      model: config.value.model,
      timeout: config.value.timeout,
      enabled: config.value.enabled,
    })
    testStatus.value = 'idle'
    testError.value = null
    testLatency.value = null
  }
})

// 切换提供商
function onProviderChange(value: unknown) {
  const provider = value as AiProvider
  const info = getProviderInfo(provider)
  if (info) {
    formData.endpoint = info.defaultEndpoint
    formData.model = info.defaultModel
  }
  testStatus.value = 'idle'
  testError.value = null
}

// 测试连接
async function handleTest() {
  testStatus.value = 'testing'
  testError.value = null
  testLatency.value = null

  // 临时保存以进行测试
  const tempConfig: AiUserConfig = {
    ...formData,
    updatedAt: Date.now(),
  }
  saveConfig(tempConfig)

  const result = await testConnection()
  testStatus.value = result.success ? 'success' : 'error'
  testError.value = result.success ? null : result.message
  testLatency.value = result.latency ?? null
}

// 保存配置
function handleSave() {
  const configToSave: AiUserConfig = {
    ...formData,
    updatedAt: Date.now(),
  }
  saveConfig(configToSave)
  emit('saved')
  handleClose()
}

// 清除配置
function handleClear() {
  clearConfig()
  Object.assign(formData, {
    provider: 'openai',
    apiKey: '',
    endpoint: '',
    model: '',
    timeout: DEFAULT_CONFIG.timeout,
    enabled: true,
  })
  testStatus.value = 'idle'
  testError.value = null
  testLatency.value = null
}

// 关闭弹窗
function handleClose() {
  visible.value = false
}
</script>

<style>
.ai-settings-modal .ant-modal-content {
  padding: 24px;
}

.ai-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ai-settings__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-settings__section--inline {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.ai-settings__label {
  font-weight: 500;
  color: var(--text-color, #262626);
}

[data-theme="dark"] .ai-settings__label {
  color: rgba(255, 255, 255, 0.85);
}

.ai-settings__select,
.ai-settings__input {
  width: 100%;
}

.ai-settings__hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-color-secondary, #8c8c8c);
}

.ai-settings__hint a {
  color: var(--primary-color, #1890ff);
}

.ai-settings__error {
  margin: 0;
  font-size: 12px;
  color: #ff4d4f;
}

.ai-settings__latency {
  margin-left: 12px;
  font-size: 12px;
  color: var(--text-color-secondary, #8c8c8c);
}

.ai-settings__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #f0f0f0);
}

[data-theme="dark"] .ai-settings__actions {
  border-color: rgba(255, 255, 255, 0.1);
}

.ai-settings__actions-right {
  display: flex;
  gap: 8px;
}
</style>

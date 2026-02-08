/**
 * AI Configuration Composable
 * @description Vue Composable for AI 配置管理
 */

import { ref, computed, readonly } from 'vue'
import type {
  AiUserConfig,
  AiProvider,
  AiConfigState,
  ConnectionTestResult,
} from './types'
import { DEFAULT_CONFIG, getProviderInfo, AI_PROVIDERS } from './types'
import { getAiConfigStore } from './store'

/** 全局响应式状态 */
const state = ref<AiConfigState>({
  config: null,
  initialized: false,
  testStatus: 'idle',
  testError: null,
})

/** 初始化标志 */
let isInitialized = false

/**
 * 初始化配置
 */
function initConfig(): void {
  if (isInitialized) return

  const store = getAiConfigStore()
  const savedConfig = store.getConfig()

  if (savedConfig) {
    state.value.config = savedConfig
  }

  state.value.initialized = true
  isInitialized = true
}

/**
 * 测试 API 连接
 */
async function testConnection(config: AiUserConfig): Promise<ConnectionTestResult> {
  const providerInfo = getProviderInfo(config.provider)
  if (!providerInfo) {
    return { success: false, message: '未知的提供商' }
  }

  // 检查必要参数
  if (providerInfo.requiresApiKey && !config.apiKey) {
    return { success: false, message: '请输入 API Key' }
  }

  const endpoint = config.endpoint || providerInfo.defaultEndpoint
  if (!endpoint) {
    return { success: false, message: '请输入 API 端点' }
  }

  const startTime = Date.now()

  try {
    // 构建测试请求
    let testUrl = endpoint
    let testBody: string
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (config.provider === 'ollama') {
      // Ollama 使用 /api/tags 测试
      testUrl = endpoint.replace(/\/api\/?$/, '') + '/api/tags'
      const response = await fetch(testUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const latency = Date.now() - startTime
      return { success: true, message: '连接成功', latency }
    }

    if (config.provider === 'anthropic') {
      // Anthropic 使用不同的头部
      headers['x-api-key'] = config.apiKey
      headers['anthropic-version'] = '2023-06-01'
      testUrl = endpoint.replace(/\/$/, '') + '/messages'
      testBody = JSON.stringify({
        model: config.model || providerInfo.defaultModel,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hi' }],
      })
    } else {
      // OpenAI 兼容接口
      headers['Authorization'] = `Bearer ${config.apiKey}`
      testUrl = endpoint.replace(/\/$/, '') + '/chat/completions'
      testBody = JSON.stringify({
        model: config.model || providerInfo.defaultModel,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hi' }],
      })
    }

    const response = await fetch(testUrl, {
      method: 'POST',
      headers,
      body: testBody,
      signal: AbortSignal.timeout(15000),
    })

    const latency = Date.now() - startTime

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.error?.message || errorData.message || `HTTP ${response.status}`
      return { success: false, message: errorMessage, latency }
    }

    return { success: true, message: '连接成功', latency }
  } catch (error) {
    const latency = Date.now() - startTime
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return { success: false, message: '连接超时', latency }
      }
      return { success: false, message: error.message, latency }
    }
    return { success: false, message: '连接失败', latency }
  }
}

/**
 * useAiConfig Composable
 */
export function useAiConfig() {
  // 确保初始化
  initConfig()

  const store = getAiConfigStore()

  // 计算属性
  const config = computed(() => state.value.config)
  const isConfigured = computed(() => store.isConfigured())
  const isEnabled = computed(() => state.value.config?.enabled ?? false)
  const currentProvider = computed(() => state.value.config?.provider ?? 'openai')
  const currentProviderInfo = computed(() => getProviderInfo(currentProvider.value))
  const testStatus = computed(() => state.value.testStatus)
  const testError = computed(() => state.value.testError)

  /**
   * 保存配置
   */
  function saveConfig(newConfig: AiUserConfig): void {
    store.saveConfig(newConfig)
    state.value.config = newConfig
    state.value.testStatus = 'idle'
    state.value.testError = null
  }

  /**
   * 更新部分配置
   */
  function updateConfig(partial: Partial<AiUserConfig>): void {
    const current = state.value.config || {
      ...DEFAULT_CONFIG,
      apiKey: '',
      updatedAt: Date.now(),
    }
    saveConfig({ ...current, ...partial })
  }

  /**
   * 切换提供商
   */
  function setProvider(provider: AiProvider): void {
    const providerInfo = getProviderInfo(provider)
    if (!providerInfo) return

    updateConfig({
      provider,
      endpoint: providerInfo.defaultEndpoint,
      model: providerInfo.defaultModel,
    })
  }

  /**
   * 测试连接
   */
  async function testConnectionAsync(): Promise<ConnectionTestResult> {
    const currentConfig = state.value.config
    if (!currentConfig) {
      return { success: false, message: '请先配置 AI 设置' }
    }

    state.value.testStatus = 'testing'
    state.value.testError = null

    const result = await testConnection(currentConfig)

    state.value.testStatus = result.success ? 'success' : 'error'
    state.value.testError = result.success ? null : result.message

    return result
  }

  /**
   * 清除配置
   */
  function clearConfig(): void {
    store.clearConfig()
    state.value.config = null
    state.value.testStatus = 'idle'
    state.value.testError = null
  }

  /**
   * 获取用于 API 请求的配置
   */
  function getRequestConfig(): {
    endpoint: string
    apiKey: string
    model: string
    timeout: number
  } | null {
    const cfg = state.value.config
    if (!cfg || !cfg.enabled) return null

    const providerInfo = getProviderInfo(cfg.provider)
    if (!providerInfo) return null

    return {
      endpoint: cfg.endpoint || providerInfo.defaultEndpoint,
      apiKey: cfg.apiKey,
      model: cfg.model || providerInfo.defaultModel,
      timeout: cfg.timeout || DEFAULT_CONFIG.timeout,
    }
  }

  return {
    // 状态
    config: readonly(config),
    isConfigured: readonly(isConfigured),
    isEnabled: readonly(isEnabled),
    currentProvider: readonly(currentProvider),
    currentProviderInfo: readonly(currentProviderInfo),
    testStatus: readonly(testStatus),
    testError: readonly(testError),
    providers: AI_PROVIDERS,

    // 方法
    saveConfig,
    updateConfig,
    setProvider,
    testConnection: testConnectionAsync,
    clearConfig,
    getRequestConfig,
  }
}

/**
 * 获取静态配置（非响应式，用于 API 调用）
 */
export function getAiRequestConfig(): {
  endpoint: string
  apiKey: string
  model: string
  timeout: number
  provider: AiProvider
} | null {
  const store = getAiConfigStore()
  const config = store.getConfig()

  if (!config || !config.enabled) return null

  const providerInfo = getProviderInfo(config.provider)
  if (!providerInfo) return null

  // 检查必要条件
  if (providerInfo.requiresApiKey && !config.apiKey) {
    return null
  }

  return {
    endpoint: config.endpoint || providerInfo.defaultEndpoint,
    apiKey: config.apiKey,
    model: config.model || providerInfo.defaultModel,
    timeout: config.timeout || DEFAULT_CONFIG.timeout,
    provider: config.provider,
  }
}

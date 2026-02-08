/**
 * AI Configuration Store
 * @description AI 配置的 localStorage 持久化存储
 */

import type { AiUserConfig, AiConfigStore } from './types'
import { DEFAULT_CONFIG, getProviderInfo } from './types'

/** 存储键 */
const STORAGE_KEY = 'tiptap-ai-config'
const API_KEY_STORAGE_KEY = 'tiptap-ai-apikey'

/**
 * 简单的混淆编码（非加密，仅防止明文存储）
 * 注意：这不是真正的加密，只是基本的混淆
 */
function obfuscate(str: string): string {
  if (!str) return ''
  try {
    return btoa(encodeURIComponent(str).split('').reverse().join(''))
  } catch {
    return ''
  }
}

/**
 * 解混淆
 */
function deobfuscate(str: string): string {
  if (!str) return ''
  try {
    return decodeURIComponent(atob(str).split('').reverse().join(''))
  } catch {
    return ''
  }
}

/**
 * 安全的 localStorage 操作
 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

/**
 * 获取存储的配置（不含 API Key）
 */
function getStoredConfig(): Omit<AiUserConfig, 'apiKey'> | null {
  const data = safeGetItem(STORAGE_KEY)
  if (!data) return null

  try {
    const parsed = JSON.parse(data)
    // 验证必要字段
    if (parsed && typeof parsed.provider === 'string') {
      return {
        provider: parsed.provider,
        endpoint: parsed.endpoint || '',
        model: parsed.model || '',
        timeout: parsed.timeout || DEFAULT_CONFIG.timeout,
        enabled: parsed.enabled !== false,
        updatedAt: parsed.updatedAt || Date.now(),
      }
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * 获取存储的 API Key
 */
function getStoredApiKey(): string {
  const obfuscated = safeGetItem(API_KEY_STORAGE_KEY)
  return obfuscated ? deobfuscate(obfuscated) : ''
}

/**
 * 创建 AI 配置存储
 */
export function createAiConfigStore(): AiConfigStore {
  return {
    getConfig(): AiUserConfig | null {
      const stored = getStoredConfig()
      if (!stored) return null

      return {
        ...stored,
        apiKey: getStoredApiKey(),
      }
    },

    saveConfig(config: AiUserConfig): void {
      // 分离存储：配置和 API Key 分开
      const { apiKey, ...rest } = config
      const configToStore = {
        ...rest,
        updatedAt: Date.now(),
      }

      safeSetItem(STORAGE_KEY, JSON.stringify(configToStore))

      // API Key 单独混淆存储
      if (apiKey) {
        safeSetItem(API_KEY_STORAGE_KEY, obfuscate(apiKey))
      } else {
        safeRemoveItem(API_KEY_STORAGE_KEY)
      }
    },

    clearConfig(): void {
      safeRemoveItem(STORAGE_KEY)
      safeRemoveItem(API_KEY_STORAGE_KEY)
    },

    getApiKey(): string | null {
      const key = getStoredApiKey()
      return key || null
    },

    isConfigured(): boolean {
      const config = this.getConfig()
      if (!config || !config.enabled) return false

      const providerInfo = getProviderInfo(config.provider)
      if (!providerInfo) return false

      // 检查必要条件
      if (providerInfo.requiresApiKey && !config.apiKey) {
        return false
      }

      // 自定义提供商需要 endpoint
      if (config.provider === 'custom' && !config.endpoint) {
        return false
      }

      return true
    },
  }
}

/** 单例实例 */
let storeInstance: AiConfigStore | null = null

/**
 * 获取配置存储实例
 */
export function getAiConfigStore(): AiConfigStore {
  if (!storeInstance) {
    storeInstance = createAiConfigStore()
  }
  return storeInstance
}

/**
 * 重置存储实例（用于测试）
 */
export function resetAiConfigStore(): void {
  storeInstance = null
}

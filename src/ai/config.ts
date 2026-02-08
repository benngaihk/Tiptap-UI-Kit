/**
 * AI Config Loader
 * Load AI configuration from environment variables
 */

import type { AiConfig, AiProvider } from './types'

/** Environment variable names */
const ENV_KEYS = {
  provider: 'VITE_AI_PROVIDER',
  apiKey: 'VITE_AI_API_KEY',
  apiSecret: 'VITE_AI_API_SECRET',
  baseUrl: 'VITE_AI_BASE_URL',
  model: 'VITE_AI_MODEL',
  temperature: 'VITE_AI_TEMPERATURE',
  maxTokens: 'VITE_AI_MAX_TOKENS',
} as const

/** Default models for each provider */
const DEFAULT_MODELS: Record<AiProvider, string> = {
  openai: 'gpt-4o',
  aliyun: 'qwen-turbo',
  ollama: 'llama3',
  deepseek: 'deepseek-chat',
  anthropic: 'claude-3-sonnet-20240229',
  custom: 'default',
}

/** Default base URLs for each provider */
const DEFAULT_BASE_URLS: Record<AiProvider, string> = {
  openai: 'https://api.openai.com/v1',
  aliyun: 'https://dashscope.aliyuncs.com/api/v1',
  ollama: 'http://localhost:11434/api',
  deepseek: 'https://api.deepseek.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  custom: '',
}

/**
 * Get environment variable value
 * Works in both Vite and Node.js environments
 */
function getEnv(key: string): string | undefined {
  // Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as Record<string, string>)[key]
  }
  // Node.js environment (with type assertion)
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env[key]
  }
  return undefined
}

/**
 * Load AI configuration from environment variables
 */
export function loadAiConfig(): AiConfig {
  const provider = (getEnv(ENV_KEYS.provider) || 'openai') as AiProvider
  
  return {
    provider,
    apiKey: getEnv(ENV_KEYS.apiKey),
    apiSecret: getEnv(ENV_KEYS.apiSecret),
    baseUrl: getEnv(ENV_KEYS.baseUrl) || DEFAULT_BASE_URLS[provider],
    model: getEnv(ENV_KEYS.model) || DEFAULT_MODELS[provider],
    temperature: parseFloat(getEnv(ENV_KEYS.temperature) || '0.7'),
    maxTokens: parseInt(getEnv(ENV_KEYS.maxTokens) || '2048', 10),
  }
}

/**
 * Create AI config manually
 */
export function createAiConfig(config: Partial<AiConfig>): AiConfig {
  const provider = config.provider || 'openai'
  
  return {
    provider,
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
    baseUrl: config.baseUrl || DEFAULT_BASE_URLS[provider],
    model: config.model || DEFAULT_MODELS[provider],
    temperature: config.temperature ?? 0.7,
    maxTokens: config.maxTokens ?? 2048,
  }
}

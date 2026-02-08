/**
 * AI Adapter Factory
 * Automatically creates the correct adapter based on config
 */

import type { AiAdapter, AiConfig, AiProvider } from './types'
import { loadAiConfig, createAiConfig } from './config'
import { createOpenAiAdapter } from './adapters/openai'
import { createAliyunAdapter } from './adapters/aliyun'
import { createOllamaAdapter } from './adapters/ollama'

/** Adapter factory map */
const adapterFactories: Record<AiProvider, (config: AiConfig) => AiAdapter> = {
  openai: createOpenAiAdapter,
  deepseek: createOpenAiAdapter,  // DeepSeek uses OpenAI-compatible API
  anthropic: createOpenAiAdapter, // Anthropic can use OpenAI-compatible endpoint
  aliyun: createAliyunAdapter,
  ollama: createOllamaAdapter,
  custom: createOpenAiAdapter,    // Custom defaults to OpenAI format
}

/**
 * Create AI adapter from environment variables
 * Reads VITE_AI_PROVIDER, VITE_AI_API_KEY, etc.
 */
export function createAiAdapterFromEnv(): AiAdapter {
  const config = loadAiConfig()
  return createAiAdapter(config)
}

/**
 * Create AI adapter from config
 */
export function createAiAdapter(configInput: Partial<AiConfig>): AiAdapter {
  const config = createAiConfig(configInput)
  const factory = adapterFactories[config.provider]
  
  if (!factory) {
    throw new Error(`Unsupported AI provider: ${config.provider}`)
  }
  
  return factory(config)
}

/**
 * Create specific provider adapter
 */
export function createProviderAdapter(
  provider: AiProvider,
  apiKey: string,
  options?: Partial<Omit<AiConfig, 'provider' | 'apiKey'>>
): AiAdapter {
  return createAiAdapter({
    provider,
    apiKey,
    ...options,
  })
}

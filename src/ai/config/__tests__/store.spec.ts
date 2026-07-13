/**
 * AI 配置存储单元测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { createAiConfigStore } from '../store'
import type { AiUserConfig } from '../types'

function makeConfig(overrides: Partial<AiUserConfig> = {}): AiUserConfig {
  return {
    provider: 'openai',
    apiKey: 'sk-test-1234567890',
    endpoint: '',
    model: 'gpt-4o-mini',
    timeout: 30000,
    enabled: true,
    updatedAt: 0,
    ...overrides,
  }
}

describe('AI config store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null before anything is saved', () => {
    const store = createAiConfigStore()
    expect(store.getConfig()).toBeNull()
    expect(store.getApiKey()).toBeNull()
    expect(store.isConfigured()).toBe(false)
  })

  it('round-trips config including the API key', () => {
    const store = createAiConfigStore()
    store.saveConfig(makeConfig())
    const loaded = store.getConfig()
    expect(loaded).not.toBeNull()
    expect(loaded!.provider).toBe('openai')
    expect(loaded!.model).toBe('gpt-4o-mini')
    expect(loaded!.apiKey).toBe('sk-test-1234567890')
  })

  it('round-trips API keys containing unicode/special characters', () => {
    const store = createAiConfigStore()
    store.saveConfig(makeConfig({ apiKey: 'key-带中文-!@#$%^&*()' }))
    expect(store.getApiKey()).toBe('key-带中文-!@#$%^&*()')
  })

  it('does not store the API key in plain text', () => {
    const store = createAiConfigStore()
    store.saveConfig(makeConfig())
    const raw = Object.keys(localStorage)
      .map((k) => localStorage.getItem(k))
      .join('|')
    expect(raw).not.toContain('sk-test-1234567890')
  })

  it('clearConfig removes both config and API key', () => {
    const store = createAiConfigStore()
    store.saveConfig(makeConfig())
    store.clearConfig()
    expect(store.getConfig()).toBeNull()
    expect(store.getApiKey()).toBeNull()
  })

  describe('isConfigured()', () => {
    it('is true for a complete enabled config', () => {
      const store = createAiConfigStore()
      store.saveConfig(makeConfig())
      expect(store.isConfigured()).toBe(true)
    })

    it('is false when disabled', () => {
      const store = createAiConfigStore()
      store.saveConfig(makeConfig({ enabled: false }))
      expect(store.isConfigured()).toBe(false)
    })

    it('is false when the provider requires an API key and none is set', () => {
      const store = createAiConfigStore()
      store.saveConfig(makeConfig({ apiKey: '' }))
      expect(store.isConfigured()).toBe(false)
    })

    it('requires an endpoint for the custom provider', () => {
      const store = createAiConfigStore()
      store.saveConfig(makeConfig({ provider: 'custom', endpoint: '' }))
      expect(store.isConfigured()).toBe(false)
      store.saveConfig(makeConfig({ provider: 'custom', endpoint: 'https://my-llm.example.com/v1' }))
      expect(store.isConfigured()).toBe(true)
    })
  })
})

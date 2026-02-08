/**
 * Ollama Adapter
 * For local Ollama models
 */

import type { AiAdapter, AiConfig, AiMessage, AiResponse, AiStreamCallbacks } from '../types'

export class OllamaAdapter implements AiAdapter {
  provider = 'ollama' as const
  private config: AiConfig

  constructor(config: AiConfig) {
    this.config = config
  }

  async chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse> {
    const config = { ...this.config, ...options }
    
    const response = await fetch(`${config.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: false,
        options: {
          temperature: config.temperature,
          num_predict: config.maxTokens,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Ollama API error: ${response.status} - ${error}`)
    }

    const data = await response.json()

    return {
      content: data.message?.content || '',
      finishReason: data.done ? 'stop' : undefined,
      usage: data.eval_count ? {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      } : undefined,
    }
  }

  async chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void> {
    const config = { ...this.config, ...options }
    
    callbacks.onStart?.()

    try {
      const response = await fetch(`${config.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          stream: true,
          options: {
            temperature: config.temperature,
            num_predict: config.maxTokens,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Ollama API error: ${response.status} - ${error}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (!reader) {
        throw new Error('No response body')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const json = JSON.parse(line)
            const token = json.message?.content || ''
            if (token) {
              fullText += token
              callbacks.onToken?.(token)
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      callbacks.onComplete?.(fullText)
    } catch (error) {
      callbacks.onError?.(error as Error)
    }
  }
}

export function createOllamaAdapter(config: AiConfig): AiAdapter {
  return new OllamaAdapter(config)
}

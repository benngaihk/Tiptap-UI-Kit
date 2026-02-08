/**
 * OpenAI Adapter
 * Compatible with OpenAI API standard (also works with DeepSeek, etc.)
 */

import type { AiAdapter, AiConfig, AiMessage, AiResponse, AiStreamCallbacks } from '../types'

export class OpenAiAdapter implements AiAdapter {
  provider = 'openai' as const
  private config: AiConfig

  constructor(config: AiConfig) {
    this.config = config
  }

  async chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse> {
    const config = { ...this.config, ...options }
    
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const choice = data.choices?.[0]

    return {
      content: choice?.message?.content || '',
      finishReason: choice?.finish_reason,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  async chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void> {
    const config = { ...this.config, ...options }
    
    callbacks.onStart?.()

    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: true,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenAI API error: ${response.status} - ${error}`)
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
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6) // Remove 'data: ' prefix
          if (data === '[DONE]') continue

          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content || ''
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

export function createOpenAiAdapter(config: AiConfig): AiAdapter {
  return new OpenAiAdapter(config)
}

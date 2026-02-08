/**
 * Aliyun (Alibaba Cloud) Adapter
 * For Qwen/Tongyi Qianwen models via DashScope API
 */

import type { AiAdapter, AiConfig, AiMessage, AiResponse, AiStreamCallbacks } from '../types'

export class AliyunAdapter implements AiAdapter {
  provider = 'aliyun' as const
  private config: AiConfig

  constructor(config: AiConfig) {
    this.config = config
  }

  async chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse> {
    const config = { ...this.config, ...options }
    
    const response = await fetch(`${config.baseUrl}/services/aigc/text-generation/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        input: {
          messages,
        },
        parameters: {
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          result_format: 'message',
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Aliyun API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    
    if (data.code) {
      throw new Error(`Aliyun API error: ${data.code} - ${data.message}`)
    }

    return {
      content: data.output?.choices?.[0]?.message?.content || data.output?.text || '',
      finishReason: data.output?.choices?.[0]?.finish_reason,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  async chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void> {
    const config = { ...this.config, ...options }
    
    callbacks.onStart?.()

    try {
      const response = await fetch(`${config.baseUrl}/services/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'X-DashScope-SSE': 'enable',
        },
        body: JSON.stringify({
          model: config.model,
          input: {
            messages,
          },
          parameters: {
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            result_format: 'message',
            incremental_output: true,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Aliyun API error: ${response.status} - ${error}`)
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
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'))

        for (const line of lines) {
          const data = line.slice(5).trim() // Remove 'data:' prefix
          if (!data) continue

          try {
            const json = JSON.parse(data)
            const token = json.output?.choices?.[0]?.message?.content || json.output?.text || ''
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

export function createAliyunAdapter(config: AiConfig): AiAdapter {
  return new AliyunAdapter(config)
}

/**
 * useAi Composable
 * Vue composable for AI features in editor
 */

import { ref, readonly } from 'vue'
import type { AiAdapter, AiMessage, AiStreamCallbacks } from './types'
import { AI_PROMPTS } from './prompts'

export interface UseAiOptions {
  adapter: AiAdapter
  onError?: (error: Error) => void
}

export interface UseAiReturn {
  isLoading: Readonly<ReturnType<typeof readonly<ReturnType<typeof ref<boolean>>>>>
  result: Readonly<ReturnType<typeof readonly<ReturnType<typeof ref<string>>>>>
  error: Readonly<ReturnType<typeof readonly<ReturnType<typeof ref<Error | null>>>>>
  
  continueWriting: (text: string) => Promise<string>
  polish: (text: string) => Promise<string>
  summarize: (text: string) => Promise<string>
  translate: (text: string, targetLang: string) => Promise<string>
  customAi: (text: string, instruction: string) => Promise<string>
  
  continueWritingStream: (text: string, callbacks: AiStreamCallbacks) => Promise<void>
  polishStream: (text: string, callbacks: AiStreamCallbacks) => Promise<void>
  summarizeStream: (text: string, callbacks: AiStreamCallbacks) => Promise<void>
  translateStream: (text: string, targetLang: string, callbacks: AiStreamCallbacks) => Promise<void>
  customAiStream: (text: string, instruction: string, callbacks: AiStreamCallbacks) => Promise<void>
  
  abort: () => void
}

export function useAi(options: UseAiOptions): UseAiReturn {
  const { adapter, onError } = options
  
  const isLoading = ref(false)
  const result = ref('')
  const error = ref<Error | null>(null)
  
  let abortController: AbortController | null = null

  const handleError = (e: Error) => {
    error.value = e
    onError?.(e)
  }

  // Non-streaming methods
  const runChat = async (systemPrompt: string, userContent: string): Promise<string> => {
    abortController = new AbortController()
    isLoading.value = true
    error.value = null
    result.value = ''
    
    try {
      const messages: AiMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ]
      
      const response = await adapter.chat(messages)
      result.value = response.content
      return response.content
    } catch (e) {
      handleError(e as Error)
      throw e
    } finally {
      isLoading.value = false
    }
  }
  
  // Streaming methods
  const runChatStream = async (
    systemPrompt: string,
    userContent: string,
    callbacks: AiStreamCallbacks
  ): Promise<void> => {
    isLoading.value = true
    error.value = null
    result.value = ''
    
    const messages: AiMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ]
    
    const streamCallbacks: AiStreamCallbacks = {
      onStart: () => {
        callbacks.onStart?.()
      },
      onToken: (token) => {
        result.value += token
        callbacks.onToken?.(token)
      },
      onComplete: (fullText) => {
        isLoading.value = false
        callbacks.onComplete?.(fullText)
      },
      onError: (e) => {
        isLoading.value = false
        handleError(e)
        callbacks.onError?.(e)
      },
    }
    
    await adapter.chatStream(messages, streamCallbacks)
  }
  
  return {
    isLoading: readonly(isLoading),
    result: readonly(result),
    error: readonly(error),
    
    // Non-streaming
    continueWriting: (text) => runChat(AI_PROMPTS.continueWriting.system, text),
    polish: (text) => runChat(AI_PROMPTS.polish.system, text),
    summarize: (text) => runChat(AI_PROMPTS.summarize.system, text),
    translate: (text, targetLang) => {
      const langName = AI_PROMPTS.translate.targetLanguages[targetLang as keyof typeof AI_PROMPTS.translate.targetLanguages] || targetLang
      return runChat(`${AI_PROMPTS.translate.system}\n目标语言: ${langName}`, text)
    },
    customAi: (text, instruction) => runChat(`${AI_PROMPTS.customAi.system}\n用户指令: ${instruction}`, text),
    
    // Streaming
    continueWritingStream: (text, cb) => runChatStream(AI_PROMPTS.continueWriting.system, text, cb),
    polishStream: (text, cb) => runChatStream(AI_PROMPTS.polish.system, text, cb),
    summarizeStream: (text, cb) => runChatStream(AI_PROMPTS.summarize.system, text, cb),
    translateStream: (text, targetLang, cb) => {
      const langName = AI_PROMPTS.translate.targetLanguages[targetLang as keyof typeof AI_PROMPTS.translate.targetLanguages] || targetLang
      return runChatStream(`${AI_PROMPTS.translate.system}\n目标语言: ${langName}`, text, cb)
    },
    customAiStream: (text, instruction, cb) => runChatStream(`${AI_PROMPTS.customAi.system}\n用户指令: ${instruction}`, text, cb),
    
    abort: () => {
      abortController?.abort()
      abortController = null
    },
  }
}

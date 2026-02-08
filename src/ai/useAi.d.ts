/**
 * useAi Composable
 * Vue composable for AI features in editor
 */
import { ref, readonly } from 'vue';
import type { AiAdapter, AiStreamCallbacks } from './types';
export interface UseAiOptions {
    adapter: AiAdapter;
    onError?: (error: Error) => void;
}
export interface UseAiReturn {
    isLoading: Readonly<ReturnType<typeof readonly<ReturnType<typeof ref<boolean>>>>>;
    result: Readonly<ReturnType<typeof readonly<ReturnType<typeof ref<string>>>>>;
    error: Readonly<ReturnType<typeof readonly<ReturnType<typeof ref<Error | null>>>>>;
    continueWriting: (text: string) => Promise<string>;
    polish: (text: string) => Promise<string>;
    summarize: (text: string) => Promise<string>;
    translate: (text: string, targetLang: string) => Promise<string>;
    customAi: (text: string, instruction: string) => Promise<string>;
    continueWritingStream: (text: string, callbacks: AiStreamCallbacks) => Promise<void>;
    polishStream: (text: string, callbacks: AiStreamCallbacks) => Promise<void>;
    summarizeStream: (text: string, callbacks: AiStreamCallbacks) => Promise<void>;
    translateStream: (text: string, targetLang: string, callbacks: AiStreamCallbacks) => Promise<void>;
    customAiStream: (text: string, instruction: string, callbacks: AiStreamCallbacks) => Promise<void>;
    abort: () => void;
}
export declare function useAi(options: UseAiOptions): UseAiReturn;
//# sourceMappingURL=useAi.d.ts.map
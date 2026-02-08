/**
 * AI Types
 * Common types for AI adapters
 */
/** Supported AI providers */
export type AiProvider = 'openai' | 'aliyun' | 'ollama' | 'deepseek' | 'anthropic' | 'custom';
/** AI configuration from env */
export interface AiConfig {
    provider: AiProvider;
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
/** Message format */
export interface AiMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
/** Streaming callbacks */
export interface AiStreamCallbacks {
    onStart?: () => void;
    onToken?: (token: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: Error) => void;
}
/** Non-streaming response */
export interface AiResponse {
    content: string;
    finishReason?: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
/** AI adapter interface */
export interface AiAdapter {
    /** Provider name */
    provider: AiProvider;
    /** Chat completion (non-streaming) */
    chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse>;
    /** Chat completion (streaming) */
    chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void>;
}
/** AI feature options for editor extensions */
export interface AiFeatureOptions {
    adapter: AiAdapter;
    systemPrompt?: string;
    onStart?: () => void;
    onComplete?: (text: string) => void;
    onError?: (error: Error) => void;
}
//# sourceMappingURL=types.d.ts.map
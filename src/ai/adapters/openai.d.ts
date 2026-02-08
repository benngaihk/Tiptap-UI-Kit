/**
 * OpenAI Adapter
 * Compatible with OpenAI API standard (also works with DeepSeek, etc.)
 */
import type { AiAdapter, AiConfig, AiMessage, AiResponse, AiStreamCallbacks } from '../types';
export declare class OpenAiAdapter implements AiAdapter {
    provider: "openai";
    private config;
    constructor(config: AiConfig);
    chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse>;
    chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void>;
}
export declare function createOpenAiAdapter(config: AiConfig): AiAdapter;
//# sourceMappingURL=openai.d.ts.map
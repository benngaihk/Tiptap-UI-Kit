/**
 * Ollama Adapter
 * For local Ollama models
 */
import type { AiAdapter, AiConfig, AiMessage, AiResponse, AiStreamCallbacks } from '../types';
export declare class OllamaAdapter implements AiAdapter {
    provider: "ollama";
    private config;
    constructor(config: AiConfig);
    chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse>;
    chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void>;
}
export declare function createOllamaAdapter(config: AiConfig): AiAdapter;
//# sourceMappingURL=ollama.d.ts.map
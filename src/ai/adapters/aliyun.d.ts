/**
 * Aliyun (Alibaba Cloud) Adapter
 * For Qwen/Tongyi Qianwen models via DashScope API
 */
import type { AiAdapter, AiConfig, AiMessage, AiResponse, AiStreamCallbacks } from '../types';
export declare class AliyunAdapter implements AiAdapter {
    provider: "aliyun";
    private config;
    constructor(config: AiConfig);
    chat(messages: AiMessage[], options?: Partial<AiConfig>): Promise<AiResponse>;
    chatStream(messages: AiMessage[], callbacks: AiStreamCallbacks, options?: Partial<AiConfig>): Promise<void>;
}
export declare function createAliyunAdapter(config: AiConfig): AiAdapter;
//# sourceMappingURL=aliyun.d.ts.map
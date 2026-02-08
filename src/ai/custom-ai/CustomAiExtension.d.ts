import { Extension } from '@tiptap/core';
export interface CustomAiOptions {
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customAi: {
            /**
             * Trigger custom AI command
             */
            customAi: () => ReturnType;
        };
    }
}
/**
 * Custom AI Extension for Tiptap v3
 * @description AI-powered custom text processing with user-defined prompts
 */
export declare const CustomAiExtension: Extension<CustomAiOptions, any>;
//# sourceMappingURL=CustomAiExtension.d.ts.map
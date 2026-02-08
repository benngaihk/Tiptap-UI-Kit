import { Extension } from '@tiptap/core';
export interface ContinueWritingOptions {
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        continueWriting: {
            /**
             * Trigger AI continue writing
             */
            continueWriting: () => ReturnType;
        };
    }
}
/**
 * Continue Writing Extension for Tiptap v3
 * @description AI-powered text continuation based on selection
 */
export declare const ContinueWritingExtension: Extension<ContinueWritingOptions, any>;
//# sourceMappingURL=ContinueWritingExtension.d.ts.map
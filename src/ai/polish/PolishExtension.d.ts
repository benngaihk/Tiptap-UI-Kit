import { Extension } from '@tiptap/core';
export interface PolishOptions {
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        polish: {
            /**
             * Trigger AI polish (refine) text
             */
            polish: () => ReturnType;
        };
    }
}
/**
 * Polish Extension for Tiptap v3
 * @description AI-powered text polishing/refinement based on selection
 */
export declare const PolishExtension: Extension<PolishOptions, any>;
//# sourceMappingURL=PolishExtension.d.ts.map
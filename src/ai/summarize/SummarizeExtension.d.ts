import { Extension } from '@tiptap/core';
export interface SummarizeOptions {
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        summarize: {
            summarize: () => ReturnType;
        };
    }
}
export declare const SummarizeExtension: Extension<SummarizeOptions, any>;
//# sourceMappingURL=SummarizeExtension.d.ts.map
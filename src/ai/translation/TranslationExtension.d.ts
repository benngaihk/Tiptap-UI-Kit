import { Extension } from '@tiptap/core';
export interface TranslationOptions {
    defaultTargetLang?: string;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        translation: {
            translate: (targetLang?: string) => ReturnType;
        };
    }
}
export declare const TranslationExtension: Extension<TranslationOptions, any>;
//# sourceMappingURL=TranslationExtension.d.ts.map
import type { Editor } from '@tiptap/core';
import { Mark } from '@tiptap/core';
export interface AiHighlightOptions {
    HTMLAttributes: Record<string, any>;
}
export interface AiSuggestionData {
    originalText: string;
    suggestedText: string;
    isStreaming: boolean;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aiHighlight: {
            /**
             * Set AI highlight mark with suggestion data
             */
            setAiHighlight: (data?: AiSuggestionData) => ReturnType;
            /**
             * Unset AI highlight mark
             */
            unsetAiHighlight: () => ReturnType;
        };
    }
}
/**
 * AI Highlight Mark Extension
 * @description Highlights text that is being processed by AI
 */
export declare const AiHighlightMark: Mark<AiHighlightOptions, any>;
/**
 * Helper function to add AI highlight to a specific range
 */
export declare function addAiHighlight(editor: Editor, from: number, to: number, data?: AiSuggestionData): void;
/**
 * Helper function to update AI highlight data
 */
export declare function updateAiHighlight(editor: Editor, from: number, to: number, data: Partial<AiSuggestionData>): void;
/**
 * Helper function to remove all AI highlights
 */
export declare function removeAiHighlight(editor: Editor): void;
/**
 * Helper function to get AI suggestion data from a mark at position
 */
export declare function getAiSuggestionData(editor: Editor, pos: number): AiSuggestionData | null;
//# sourceMappingURL=AiHighlightMark.d.ts.map
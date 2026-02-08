import type { Editor } from '@tiptap/core';
export interface AiSuggestionState {
    visible: boolean;
    originalText: string;
    suggestedText: string;
    isStreaming: boolean;
    originalSelection: {
        from: number;
        to: number;
    };
}
declare class AiSuggestionManager {
    private editor;
    private popoverApp;
    private container;
    private state;
    private visibleRef;
    private originalTextRef;
    private suggestedTextRef;
    private isStreamingRef;
    private isTemporarilyHidden;
    /**
     * Initialize the suggestion manager
     */
    init(editor: Editor): void;
    /**
     * Setup click handler for highlighted text
     */
    private setupClickHandler;
    /**
     * Restore existing highlights from the document
     */
    private restoreExistingHighlights;
    /**
     * Restore a suggestion from saved data
     */
    private restoreSuggestion;
    /**
     * Show AI suggestion popover
     */
    show(originalText: string, originalSelection: {
        from: number;
        to: number;
    }, editor?: Editor): void;
    /**
     * Show the popover (for clicking on highlighted text)
     */
    private showPopover;
    /**
     * Update suggested text (for streaming)
     */
    updateSuggestion(text: string): void;
    /**
     * Stop streaming
     */
    stopStreaming(): void;
    /**
     * Accept the suggestion
     */
    accept(): void;
    /**
     * Build paragraph nodes from text with newlines
     */
    private buildParagraphNodes;
    /**
     * Reject the suggestion
     */
    reject(): void;
    /**
     * Cancel (temporarily hide) the suggestion
     */
    cancel(): void;
    /**
     * Hide the popover and cleanup
     */
    hide(): void;
    /**
     * Check if suggestion is visible
     */
    isVisible(): boolean;
    /**
     * Get current state
     */
    getState(): AiSuggestionState;
    /**
     * Mount the popover component
     */
    private mountPopover;
    /**
     * Unmount the popover component
     */
    private unmountPopover;
    /**
     * Calculate popover position based on selection
     */
    private calculatePopoverPosition;
    /**
     * Cleanup
     */
    destroy(): void;
}
export declare const aiSuggestionManager: AiSuggestionManager;
export {};
//# sourceMappingURL=aiSuggestionManager.d.ts.map
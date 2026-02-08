import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { App } from 'vue';

import { createApp, h, ref } from 'vue';

import {
  addAiHighlight,
  removeAiHighlight,
  updateAiHighlight,
  getAiSuggestionData,
} from './AiHighlightMark';
import type { AiSuggestionData } from './AiHighlightMark';
import AiSuggestionPopover from './AiSuggestionPopover.vue';

export interface AiSuggestionState {
  visible: boolean;
  originalText: string;
  suggestedText: string;
  isStreaming: boolean;
  originalSelection: { from: number; to: number };
}

class AiSuggestionManager {
  private editor: Editor | null = null;
  private popoverApp: App | null = null;
  private container: HTMLElement | null = null;
  private state: AiSuggestionState = {
    visible: false,
    originalText: '',
    suggestedText: '',
    isStreaming: false,
    originalSelection: { from: 0, to: 0 },
  };

  // Reactive refs for the popover component
  private visibleRef = ref(false);
  private originalTextRef = ref('');
  private suggestedTextRef = ref('');
  private isStreamingRef = ref(false);

  // Track if the suggestion is temporarily hidden
  private isTemporarilyHidden = false;

  // Event handler reference for cleanup
  private clickHandler: ((event: MouseEvent) => void) | null = null;

  /**
   * Initialize the suggestion manager
   */
  init(editor: Editor): void {
    this.editor = editor;
    this.setupClickHandler();
    this.restoreExistingHighlights();
  }

  /**
   * Setup click handler for highlighted text
   */
  private setupClickHandler(): void {
    if (!this.editor) return;

    // Remove existing handler if any
    this.removeClickHandler();

    // Create click handler
    this.clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if clicked on highlighted text
      const highlightElement = target.classList.contains('ai-highlight')
        ? target
        : target.closest('.ai-highlight');

      if (highlightElement) {
        // Get the position of the clicked element
        const pos = this.editor!.view.posAtDOM(highlightElement, 0);

        // Get the suggestion data from the mark
        const data = getAiSuggestionData(this.editor!, pos);

        if (data) {
          // If temporarily hidden, show it
          if (this.isTemporarilyHidden && this.state.visible) {
            this.showPopover();
          } else if (!this.state.visible) {
            // If not currently showing, restore the suggestion
            this.restoreSuggestion(highlightElement as HTMLElement, data);
          }
        }
      }
    };

    // Add click event listener to editor
    this.editor.view.dom.addEventListener('click', this.clickHandler);
  }

  /**
   * Remove click handler to prevent memory leaks
   */
  private removeClickHandler(): void {
    if (this.editor && this.clickHandler) {
      this.editor.view.dom.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }

  /**
   * Restore existing highlights from the document
   */
  private restoreExistingHighlights(): void {
    if (!this.editor) return;

    // This will be called when the editor loads
    // Highlights with data are already in the document
    // We don't need to show popover automatically
  }

  /**
   * Restore a suggestion from saved data
   */
  private restoreSuggestion(
    element: HTMLElement,
    data: AiSuggestionData,
  ): void {
    if (!this.editor) return;

    // Get the range of the highlighted text
    const pos = this.editor.view.posAtDOM(element, 0);
    const node = this.editor.state.doc.nodeAt(pos);

    if (!node) return;

    const from = pos;
    const to = pos + node.nodeSize;

    // Restore the state
    this.state = {
      visible: true,
      originalText: data.originalText,
      suggestedText: data.suggestedText,
      isStreaming: false,
      originalSelection: { from, to },
    };

    // Update reactive refs
    this.visibleRef.value = true;
    this.originalTextRef.value = data.originalText;
    this.suggestedTextRef.value = data.suggestedText;
    this.isStreamingRef.value = false;

    // Reset temporarily hidden flag
    this.isTemporarilyHidden = false;

    // Mount the popover
    if (!this.popoverApp) {
      this.mountPopover();
    }
  }

  /**
   * Show AI suggestion popover
   */
  show(
    originalText: string,
    originalSelection: { from: number; to: number },
    editor?: Editor,
  ): void {
    // Auto-initialize editor if provided
    if (editor && !this.editor) {
      this.init(editor);
    }
    
    if (!this.editor) return;

    this.state = {
      visible: true,
      originalText,
      suggestedText: '',
      isStreaming: true,
      originalSelection,
    };

    // Update reactive refs
    this.visibleRef.value = true;
    this.originalTextRef.value = originalText;
    this.suggestedTextRef.value = '';
    this.isStreamingRef.value = true;

    // Reset temporarily hidden flag
    this.isTemporarilyHidden = false;

    // Add highlight to the selected text with data
    const highlightData: AiSuggestionData = {
      originalText,
      suggestedText: '',
      isStreaming: true,
    };
    addAiHighlight(
      this.editor,
      originalSelection.from,
      originalSelection.to,
      highlightData,
    );

    // Create and mount the popover (only once)
    if (!this.popoverApp) {
      this.mountPopover();
    }
  }

  /**
   * Show the popover (for clicking on highlighted text)
   */
  private showPopover(): void {
    this.isTemporarilyHidden = false;
    this.visibleRef.value = true;
  }

  /**
   * Update suggested text (for streaming)
   */
  updateSuggestion(text: string): void {
    this.state.suggestedText = text;
    // Update reactive ref - Vue will automatically update the component
    this.suggestedTextRef.value = text;

    // Update the mark data
    if (this.editor && this.state.originalSelection) {
      updateAiHighlight(
        this.editor,
        this.state.originalSelection.from,
        this.state.originalSelection.to,
        {
          suggestedText: text,
        },
      );
    }
  }

  /**
   * Stop streaming
   */
  stopStreaming(): void {
    this.state.isStreaming = false;
    // Update reactive ref - Vue will automatically update the component
    this.isStreamingRef.value = false;

    // Update the mark data
    if (this.editor && this.state.originalSelection) {
      updateAiHighlight(
        this.editor,
        this.state.originalSelection.from,
        this.state.originalSelection.to,
        {
          isStreaming: false,
        },
      );
    }
  }

  /**
   * Accept the suggestion
   */
  accept(): void {
    if (!this.editor || !this.state.visible) return;

    const { originalSelection, suggestedText } = this.state;
    const { state } = this.editor;

    // Check if the suggested text contains newlines
    const hasNewlines = /\r?\n/.test(suggestedText);

    if (hasNewlines) {
      // If there are newlines, we need to create multiple paragraphs
      const paragraphNodes = this.buildParagraphNodes(suggestedText);

      if (paragraphNodes.length > 0) {
        // Use transaction to replace selected text with paragraph nodes
        const tr = state.tr;
        tr.replaceWith(
          originalSelection.from,
          originalSelection.to,
          paragraphNodes,
        );
        this.editor.view.dispatch(tr);
      }
    } else {
      // If no newlines, just replace the text inline (preserving the paragraph)
      this.editor
        .chain()
        .focus()
        .deleteRange(originalSelection)
        .insertContentAt(originalSelection.from, suggestedText)
        .run();
    }

    this.hide();
  }

  /**
   * Build paragraph nodes from text with newlines
   */
  private buildParagraphNodes(text: string): ProseMirrorNode[] {
    if (!this.editor) return [];

    const { schema } = this.editor.state;
    if (!schema.nodes.paragraph) return [];

    // Split by newlines and create paragraph nodes
    const lines = text.split(/\r?\n/);
    const nodes: ProseMirrorNode[] = [];

    for (const line of lines) {
      if (line.length > 0) {
        // Create paragraph with text
        const textNode = schema.text(line);
        const paragraphNode = schema.nodes.paragraph.create(null, textNode);
        nodes.push(paragraphNode);
      } else {
        // Create empty paragraph for blank lines
        const paragraphNode = schema.nodes.paragraph.create();
        nodes.push(paragraphNode);
      }
    }

    return nodes;
  }

  /**
   * Reject the suggestion
   */
  reject(): void {
    this.hide();
  }

  /**
   * Cancel (temporarily hide) the suggestion
   */
  cancel(): void {
    this.isTemporarilyHidden = true;
    this.visibleRef.value = false;
  }

  /**
   * Hide the popover and cleanup
   */
  hide(): void {
    if (!this.editor) return;

    // Update reactive refs
    this.visibleRef.value = false;

    // Reset temporarily hidden flag
    this.isTemporarilyHidden = false;

    // Remove highlight
    removeAiHighlight(this.editor);

    // Cleanup popover
    this.unmountPopover();

    this.state = {
      visible: false,
      originalText: '',
      suggestedText: '',
      isStreaming: false,
      originalSelection: { from: 0, to: 0 },
    };
  }

  /**
   * Check if suggestion is visible
   */
  isVisible(): boolean {
    return this.state.visible;
  }

  /**
   * Get current state
   */
  getState(): AiSuggestionState {
    return { ...this.state };
  }

  /**
   * Mount the popover component
   */
  private mountPopover(): void {
    if (!this.editor) return;

    // Don't remount if already mounted
    if (this.popoverApp && this.container) return;

    // Create container
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.zIndex = '1000';

    // Get editor element
    const editorElement = this.editor.view.dom.parentElement;
    if (editorElement) {
      editorElement.append(this.container);
    } else {
      document.body.append(this.container);
    }

    // Calculate position
    const position = this.calculatePopoverPosition();

    // Create Vue app with reactive refs
    this.popoverApp = createApp({
      render: () =>
        h(AiSuggestionPopover, {
          visible: this.visibleRef.value,
          originalText: this.originalTextRef.value,
          suggestedText: this.suggestedTextRef.value,
          isStreaming: this.isStreamingRef.value,
          position,
          editorElement: editorElement || undefined,
          'onUpdate:visible': (val: boolean) => {
            this.visibleRef.value = val;
          },
          onAccept: () => {
            this.accept();
          },
          onReject: () => {
            this.reject();
          },
          onCancel: () => {
            this.cancel();
          },
        }),
    });

    this.popoverApp.mount(this.container);
  }

  /**
   * Unmount the popover component
   */
  private unmountPopover(): void {
    if (this.popoverApp) {
      this.popoverApp.unmount();
      this.popoverApp = null;
    }

    if (this.container && this.container.parentNode) {
      this.container.remove();
      this.container = null;
    }
  }

  /**
   * Calculate popover position based on selection
   */
  private calculatePopoverPosition(): { top: number; left: number } {
    if (!this.editor) {
      return { top: 0, left: 0 };
    }

    const { from, to } = this.state.originalSelection;
    const { view } = this.editor;

    // Get coordinates of the selection
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // Get editor element position
    const editorRect = view.dom.getBoundingClientRect();

    // Calculate position relative to editor
    const top = end.bottom - editorRect.top + 8; // 8px offset below selection
    const left = start.left - editorRect.left;

    return { top, left };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.removeClickHandler();
    this.hide();
    this.editor = null;
  }
}

// Export singleton instance
export const aiSuggestionManager = new AiSuggestionManager();


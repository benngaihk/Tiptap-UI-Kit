/* eslint-disable perfectionist/sort-imports */
import type { Editor } from '@tiptap/core';

import type { App } from 'vue';

import { createApp, h, ref } from 'vue';

import { Extension } from '@tiptap/core';
import { notification } from 'ant-design-vue';

import { aiApiService } from '@/api/ai';
import { buildParagraphNodesFromText, hasNewlines, isValidSelection } from '@/utils/prosemirrorUtils';

import { t } from '@/locales';

import type { AiSuggestionData } from '../shared/AiHighlightMark';

import {
  addAiHighlight,
  removeAiHighlight,
  updateAiHighlight,
  getAiSuggestionData,
} from '../shared/AiHighlightMark';
import AiSuggestionPopover from '../shared/AiSuggestionPopover.vue';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContinueWritingOptions {}

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
export const ContinueWritingExtension =
  Extension.create<ContinueWritingOptions>({
    name: 'continueWriting',

    addCommands() {
      return {
        continueWriting:
          () =>
          ({ state, editor }) => {
            const { selection } = state;
            const { from, to } = selection;

            // Get selected text
            const selectedText = state.doc.textBetween(from, to, ' ');

            if (!selectedText.trim()) {
              console.warn('[Continue Writing] No text selected');
              // 显示用户友好的提示
              notification.warning({
                message: t('editor.pleaseSelectText'),
                description: t('editor.continueWritingRequiresSelection'),
                duration: 2,
                placement: 'topRight',
              });
              return false;
            }

            // Save the original selected text range for highlighting
            const originalSelectedRange = { from, to };

            // For continue writing, we insert after the selection
            // So we use the 'to' position as the start
            const originalSelection = { from: to, to };

            // Get full document context
            const fullText = state.doc.textBetween(
              0,
              state.doc.content.size,
              ' ',
            );
            const sysPrompt = `以下係完整嘅文件內容:\n\n${fullText}`;

            // Perform AI continue writing
            performContinueWriting(
              editor,
              selectedText,
              sysPrompt,
              originalSelection,
              to,
              originalSelectedRange,
            );

            return true;
          },
      };
    },
  });

// Singleton state for continue writing popover
let continueWritingPopoverApp: App | null = null;
let continueWritingContainer: HTMLElement | null = null;
let currentEditor: Editor | null = null;
let currentSelection: null | { from: number; to: number } = null;
let originalSelectedRange: null | { from: number; to: number } = null; // 保存用户原始选中的文字范围

// Reactive refs for the popover
const visibleRef = ref(false);
const originalTextRef = ref('');
const suggestedTextRef = ref('');
const isStreamingRef = ref(false);

/**
 * Perform continue writing operation
 */
function performContinueWriting(
  editor: Editor,
  selectedText: string,
  sysPrompt: string,
  originalSelection: { from: number; to: number },
  insertPosition: number,
  userSelectedRange: { from: number; to: number },
) {
  // 先清理所有现有的 AI 高亮，避免与其他 AI 功能冲突
  removeAiHighlight(editor);

  currentEditor = editor;
  currentSelection = originalSelection;
  originalSelectedRange = userSelectedRange;

  // Update refs - show selected text as context
  visibleRef.value = true;
  originalTextRef.value = selectedText; // Show selected text as context
  suggestedTextRef.value = '';
  isStreamingRef.value = true;

  // First, add highlight for the user's selected text
  // This helps user see what text they selected
  const selectedTextHighlight: AiSuggestionData = {
    originalText: selectedText,
    suggestedText: '',
    isStreaming: false,
  };
  addAiHighlight(
    editor,
    userSelectedRange.from,
    userSelectedRange.to,
    selectedTextHighlight,
  );

  // Then, insert a placeholder space after the selection
  // This is where the new content will be inserted
  editor.chain().focus().insertContentAt(insertPosition, ' ').run();

  // Update selection to include the space
  const suggestionSelection = {
    from: insertPosition,
    to: insertPosition + 1,
  };

  // Add highlight for the placeholder space where new content will be inserted
  const highlightData: AiSuggestionData = {
    originalText: '',
    suggestedText: '',
    isStreaming: true,
  };
  addAiHighlight(
    editor,
    suggestionSelection.from,
    suggestionSelection.to,
    highlightData,
  );

  // Mount popover if not already mounted
  if (!continueWritingPopoverApp) {
    mountContinueWritingPopover(editor);
  }
  
  // Setup click handler to restore popover when user clicks on highlighted text
  setupClickHandler();

  let accumulatedContent = '';

  const callback = {
    onStart: () => {
      accumulatedContent = '';
    },
    onMessage: (message: { content: string }) => {
      if (message && message.content) {
        accumulatedContent += message.content;
        // Update the suggestion in popover
        suggestedTextRef.value = accumulatedContent;

        // Update the mark data (验证 selection 是否仍然有效)
        if (currentSelection && currentEditor) {
          const { state } = currentEditor;
          const { doc } = state;
          const docSize = doc.content.size;

          if (
            currentSelection.from >= 0 &&
            currentSelection.to >= 0 &&
            currentSelection.from <= docSize &&
            currentSelection.to <= docSize &&
            currentSelection.from <= currentSelection.to
          ) {
            updateAiHighlight(
              editor,
              currentSelection.from,
              currentSelection.to,
              {
                suggestedText: accumulatedContent,
              },
            );
          }
        }
      }
    },
    onStop: () => {
      try {
        // Stop streaming indicator
        isStreamingRef.value = false;

        // Update the mark data (验证 selection 是否仍然有效)
        if (currentSelection && currentEditor) {
          const { state } = currentEditor;
          const { doc } = state;
          const docSize = doc.content.size;

          if (
            currentSelection.from >= 0 &&
            currentSelection.to >= 0 &&
            currentSelection.from <= docSize &&
            currentSelection.to <= docSize &&
            currentSelection.from <= currentSelection.to
          ) {
            updateAiHighlight(
              editor,
              currentSelection.from,
              currentSelection.to,
              {
                isStreaming: false,
              },
            );
          }
        }
      } catch (error) {
        console.warn(
          '[Continue Writing] Failed to finalize formatting:',
          error,
        );
      }
    },
    onError: (error: Error) => {
      console.error('[Continue Writing] Error:', error);
      handleCleanup();
      notification.error({
        message: '续写失败',
        description: error.message || t('messages.networkError'),
        duration: 3,
      });
    },
  };

  // Call AI API
  aiApiService.continueWriting(selectedText, sysPrompt, callback);
}

/**
 * Mount the continue writing popover
 */
function mountContinueWritingPopover(editor: Editor): void {
  // Cleanup existing app if any
  if (continueWritingPopoverApp) {
    continueWritingPopoverApp.unmount();
    continueWritingPopoverApp = null;
  }

  // Get editor element
  const editorElement = editor.view.dom.parentElement;

  // Create container if it doesn't exist or was removed
  if (!continueWritingContainer || !continueWritingContainer.parentNode) {
    continueWritingContainer = document.createElement('div');
    continueWritingContainer.style.position = 'absolute';
    continueWritingContainer.style.top = '0';
    continueWritingContainer.style.left = '0';
    continueWritingContainer.style.zIndex = '1000';

    if (editorElement) {
      editorElement.append(continueWritingContainer);
    } else {
      document.body.append(continueWritingContainer);
    }
  }

  // Calculate position
  const position = calculatePopoverPosition(editor);

  // Create Vue app
  continueWritingPopoverApp = createApp({
    render: () =>
      h(AiSuggestionPopover, {
        visible: visibleRef.value,
        originalText: originalTextRef.value,
        suggestedText: suggestedTextRef.value,
        isStreaming: isStreamingRef.value,
        position,
        editorElement: editorElement || undefined,
        'onUpdate:visible': (val: boolean) => {
          visibleRef.value = val;
        },
        onAccept: () => {
          handleAccept();
        },
        onReject: () => {
          handleReject();
        },
        onCancel: () => {
          handleCancel();
        },
      }),
  });

  continueWritingPopoverApp.mount(continueWritingContainer);
}

/**
 * Unmount the popover
 * Note: This only unmounts the popover, but keeps the container for potential remounting
 */
function unmountContinueWritingPopover(): void {
  if (continueWritingPopoverApp) {
    continueWritingPopoverApp.unmount();
    continueWritingPopoverApp = null;
  }

  // Don't remove container here, as we might need to remount
  // Container will be cleaned up in handleCleanup()
}

/**
 * Calculate popover position
 * Position should be based on the user's selected text, not the insertion point
 */
function calculatePopoverPosition(editor: Editor): {
  left: number;
  top: number;
} {
  // Use originalSelectedRange (user's selected text) for positioning
  // If not available, fall back to currentSelection (insertion point)
  const rangeToUse = originalSelectedRange || currentSelection;
  
  if (!rangeToUse) {
    return { left: 0, top: 0 };
  }

  const { from, to } = rangeToUse;
  const { view } = editor;

  // Get coordinates of the selection
  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  // Get editor element position
  const editorRect = view.dom.getBoundingClientRect();

  // Calculate position relative to editor
  // Position popover below the selected text
  const top = end.bottom - editorRect.top + 8; // 8px offset below selection
  const left = start.left - editorRect.left;

  return { left, top };
}

/**
 * Handle accept
 */
function handleAccept(): void {
  if (!currentEditor || !currentSelection) return;

  const suggestedText = suggestedTextRef.value;
  const { state } = currentEditor;
  const { doc } = state;

  // 验证 selection 是否仍然有效
  const docSize = doc.content.size;
  if (!isValidSelection(currentSelection, docSize)) {
    console.warn('[Continue Writing] Invalid selection range, cannot accept');
    handleCleanup();
    return;
  }

  // Check if suggested text contains newlines
  if (hasNewlines(suggestedText)) {
    // Build paragraph nodes using utility function
    const nodes = buildParagraphNodesFromText(suggestedText, state.schema);

    if (nodes.length > 0) {
      const tr = state.tr;
      tr.replaceWith(currentSelection.from, currentSelection.to, nodes);
      currentEditor.view.dispatch(tr);
    }
  } else {
    // No newlines, replace inline
    currentEditor
      .chain()
      .focus()
      .deleteRange(currentSelection)
      .insertContentAt(currentSelection.from, suggestedText)
      .run();
  }

  handleCleanup();
}

/**
 * Handle reject
 */
function handleReject(): void {
  handleCleanup();
}

/**
 * Handle cancel
 * Cancel should only hide the popover, but keep the highlight
 * so user can see what was selected and click on it again to show the popover
 */
function handleCancel(): void {
  // Only hide the popover, don't remove highlights
  unmountContinueWritingPopover();

  visibleRef.value = false;
  // Keep other state so highlights remain visible
  // Don't reset currentEditor, currentSelection, originalSelectedRange
  
  // Setup click handler to restore popover when user clicks on highlighted text
  setupClickHandler();
}

/**
 * Setup click handler for highlighted text to restore popover
 */
function setupClickHandler(): void {
  if (!currentEditor) return;

  const editorDom = currentEditor.view.dom;
  
  // Remove existing listener if any (cleanup)
  const existingHandler = (editorDom as any)._continueWritingClickHandler;
  if (existingHandler) {
    editorDom.removeEventListener('click', existingHandler);
  }

  const clickHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return;
    
    const highlightElement = target.classList.contains('ai-highlight')
      ? target
      : target.closest('.ai-highlight');

    if (!highlightElement) return;
    if (!currentEditor || !currentSelection) return;
    if (visibleRef.value) return; // Already visible, don't restore
    
    // Prevent default to avoid editor selection changes interfering
    event.stopPropagation();
    
    // Get the position of the clicked element
    let pos: number;
    try {
      pos = currentEditor.view.posAtDOM(highlightElement, 0);
    } catch (error) {
      console.warn('[Continue Writing] Failed to get position from DOM:', error);
      // Fallback: use the original selection range
      pos = originalSelectedRange?.from || currentSelection.from;
    }
    
    // Get the suggestion data from the mark
    let data = getAiSuggestionData(currentEditor, pos);
    
    // If data not found at clicked position, try to get from original selection
    if (!data && originalSelectedRange) {
      data = getAiSuggestionData(currentEditor, originalSelectedRange.from);
    }
    
    // If still no data, use saved state from refs
    if (!data) {
      data = {
        originalText: originalTextRef.value,
        suggestedText: suggestedTextRef.value,
        isStreaming: isStreamingRef.value,
      };
    }
    
    // Update refs with current data before mounting
    originalTextRef.value = data.originalText || originalTextRef.value;
    suggestedTextRef.value = data.suggestedText || suggestedTextRef.value;
    isStreamingRef.value = data.isStreaming || false;
    
      // Restore the popover
      // Always remount to ensure fresh state and correct position
      unmountContinueWritingPopover();
      mountContinueWritingPopover(currentEditor);
    
    // Show the popover
    visibleRef.value = true;
  };

  // Store handler reference for cleanup
  (editorDom as any)._continueWritingClickHandler = clickHandler;
  
  // Add click listener
  editorDom.addEventListener('click', clickHandler);
}

/**
 * Cleanup
 */
function handleCleanup(): void {
  // Remove click handler
  if (currentEditor) {
    const editorDom = currentEditor.view.dom;
    const existingHandler = (editorDom as any)._continueWritingClickHandler;
    if (existingHandler) {
      editorDom.removeEventListener('click', existingHandler);
      delete (editorDom as any)._continueWritingClickHandler;
    }
    
    removeAiHighlight(currentEditor);
  }

  unmountContinueWritingPopover();

  visibleRef.value = false;
  originalTextRef.value = '';
  suggestedTextRef.value = '';
  isStreamingRef.value = false;

  currentEditor = null;
  currentSelection = null;
  originalSelectedRange = null;
}

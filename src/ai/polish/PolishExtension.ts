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
export interface PolishOptions {}

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
export const PolishExtension = Extension.create<PolishOptions>({
  name: 'polish',

  addCommands() {
    return {
      polish:
        () =>
        ({ state, editor }) => {
          const { selection } = state;
          const { from, to } = selection;

          // Get selected text
          const selectedText = state.doc.textBetween(from, to, ' ');

          if (!selectedText.trim()) {
            console.warn('[Polish] No text selected');
            // 显示用户友好的提示
            notification.warning({
              message: t('editor.pleaseSelectText'),
              description: t('editor.polishRequiresSelection'),
              duration: 2,
              placement: 'topRight',
            });
            return false;
          }

          // Save the original selected text range for highlighting
          const originalSelection = { from, to };

          // Get full document context
          const fullText = state.doc.textBetween(
            0,
            state.doc.content.size,
            ' ',
          );
          const sysPrompt = `以下係完整嘅文件內容:\n\n${fullText}`;

          // Perform AI polish
          performPolish(
            editor,
            selectedText,
            sysPrompt,
            originalSelection,
          );

          return true;
        },
    };
  },
});

// Singleton state for polish popover
let polishPopoverApp: App | null = null;
let polishContainer: HTMLElement | null = null;
let currentEditor: Editor | null = null;
let currentSelection: null | { from: number; to: number } = null;

// Reactive refs for the popover
const visibleRef = ref(false);
const originalTextRef = ref('');
const suggestedTextRef = ref('');
const isStreamingRef = ref(false);

/**
 * Perform polish operation
 */
function performPolish(
  editor: Editor,
  selectedText: string,
  sysPrompt: string,
  originalSelection: { from: number; to: number },
) {
  // 先清理所有现有的 AI 高亮，避免与其他 AI 功能冲突
  removeAiHighlight(editor);

  currentEditor = editor;
  currentSelection = originalSelection;

  // Update refs
  visibleRef.value = true;
  originalTextRef.value = selectedText;
  suggestedTextRef.value = '';
  isStreamingRef.value = true;

  // Add highlight for the selected text
  const highlightData: AiSuggestionData = {
    originalText: selectedText,
    suggestedText: '',
    isStreaming: true,
  };
  addAiHighlight(
    editor,
    originalSelection.from,
    originalSelection.to,
    highlightData,
  );

  // Mount popover if not already mounted
  if (!polishPopoverApp) {
    mountPolishPopover(editor);
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
        console.warn('[Polish] Failed to finalize formatting:', error);
      }
    },
    onError: (error: Error) => {
      console.error('[Polish] Error:', error);
      handleCleanup();
      notification.error({
        message: '润色失败',
        description: error.message || t('messages.networkError'),
        duration: 3,
      });
    },
  };

  // Call AI API
  aiApiService.polish(selectedText, sysPrompt, callback);
}

/**
 * Mount the polish popover
 */
function mountPolishPopover(editor: Editor): void {
  // Cleanup existing app if any
  if (polishPopoverApp) {
    polishPopoverApp.unmount();
    polishPopoverApp = null;
  }

  // Get editor element
  const editorElement = editor.view.dom.parentElement;

  // Create container if it doesn't exist or was removed
  if (!polishContainer || !polishContainer.parentNode) {
    polishContainer = document.createElement('div');
    polishContainer.style.position = 'absolute';
    polishContainer.style.top = '0';
    polishContainer.style.left = '0';
    polishContainer.style.zIndex = '1000';

    if (editorElement) {
      editorElement.append(polishContainer);
    } else {
      document.body.append(polishContainer);
    }
  } else {
    // 如果容器已存在，清空其内容，避免重复显示
    polishContainer.innerHTML = '';
  }

  // Calculate position
  const position = calculatePopoverPosition(editor);

  // Create Vue app
  polishPopoverApp = createApp({
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

  polishPopoverApp.mount(polishContainer);
}

/**
 * Unmount the popover
 * Note: This only unmounts the popover, but keeps the container for potential remounting
 */
function unmountPolishPopover(): void {
  if (polishPopoverApp) {
    polishPopoverApp.unmount();
    polishPopoverApp = null;
  }

  // Don't remove container here, as we might need to remount
  // Container will be cleaned up in handleCleanup()
}

/**
 * Calculate popover position
 */
function calculatePopoverPosition(editor: Editor): {
  left: number;
  top: number;
} {
  if (!currentSelection) {
    return { left: 0, top: 0 };
  }

  const { from, to } = currentSelection;
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
    console.warn('[Polish] Invalid selection range, cannot accept');
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
  unmountPolishPopover();

  visibleRef.value = false;
  // Keep other state so highlights remain visible
  // Don't reset currentEditor, currentSelection

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
  const existingHandler = (editorDom as any)._polishClickHandler;
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
      console.warn('[Polish] Failed to get position from DOM:', error);
      // Fallback: use the original selection range
      pos = currentSelection.from;
    }

    // Get the suggestion data from the mark
    let data = getAiSuggestionData(currentEditor, pos);

    // If data not found at clicked position, try to get from original selection
    if (!data && currentSelection) {
      data = getAiSuggestionData(currentEditor, currentSelection.from);
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
    unmountPolishPopover();
    mountPolishPopover(currentEditor);

    // Show the popover
    visibleRef.value = true;
  };

  // Store handler reference for cleanup
  (editorDom as any)._polishClickHandler = clickHandler;

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
    const existingHandler = (editorDom as any)._polishClickHandler;
    if (existingHandler) {
      editorDom.removeEventListener('click', existingHandler);
      delete (editorDom as any)._polishClickHandler;
    }

    removeAiHighlight(currentEditor);
  }

  unmountPolishPopover();

  // Remove container to ensure clean state
  if (polishContainer && polishContainer.parentNode) {
    polishContainer.parentNode.removeChild(polishContainer);
  }
  polishContainer = null;

  visibleRef.value = false;
  originalTextRef.value = '';
  suggestedTextRef.value = '';
  isStreamingRef.value = false;

  currentEditor = null;
  currentSelection = null;
}

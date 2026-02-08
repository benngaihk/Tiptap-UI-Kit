/* eslint-disable perfectionist/sort-imports */
import type { Editor } from '@tiptap/core';

import type { App } from 'vue';

import { createApp, h, ref } from 'vue';

import { Extension } from '@tiptap/core';
import { notification } from 'ant-design-vue';

import { t } from '@/locales';

import { aiApiService } from '@/api/ai';
import { buildParagraphNodesFromText, hasNewlines, isValidSelection } from '@/utils/prosemirrorUtils';

import type { AiSuggestionData } from '../shared/AiHighlightMark';

import {
  addAiHighlight,
  removeAiHighlight,
  updateAiHighlight,
} from '../shared/AiHighlightMark';
import CustomAiPopover from '../shared/CustomAiPopover.vue';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomAiOptions {}

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
export const CustomAiExtension = Extension.create<CustomAiOptions>({
  name: 'customAi',

  addCommands() {
    return {
      customAi:
        () =>
        ({ state, editor }) => {
          const { selection } = state;
          const { from, to } = selection;

          // Get selected text (may be empty)
          const selectedText = state.doc.textBetween(from, to, ' ');

          // 要求必须选中文字才能使用自定义AI
          if (!selectedText.trim()) {
            notification.warning({
              message: t('editor.pleaseSelectText'),
              description: t('editor.customAiRequiresSelection'),
              duration: 2,
            });
            return false;
          }

          // Save original selection range
          const originalSelection = { from, to };

          // Show custom AI modal
          showCustomAiModal(
            editor,
            selectedText,
            originalSelection,
            true,
          );

          return true;
        },
    };
  },
});

// Singleton state for custom AI popover
let customAiPopoverApp: App | null = null;
let customAiContainer: HTMLElement | null = null;
let currentEditor: Editor | null = null;
let currentSelection: null | { from: number; to: number } = null;

// Reactive refs for the popover
const visibleRef = ref(false);
const originalTextRef = ref('');
const suggestedTextRef = ref('');
const isStreamingRef = ref(false);
const isExecutingRef = ref(false);

/**
 * Show custom AI popover
 */
function showCustomAiModal(
  editor: Editor,
  selectedText: string,
  originalSelection: { from: number; to: number },
  _hasSelectedText: boolean,
) {
  currentEditor = editor;
  currentSelection = originalSelection;

  // Update refs
  visibleRef.value = true;
  originalTextRef.value = selectedText;
  suggestedTextRef.value = '';
  isStreamingRef.value = false;
  isExecutingRef.value = false;

  // Add highlight for selected text
  const highlightData: AiSuggestionData = {
    originalText: selectedText,
    suggestedText: '',
    isStreaming: false,
  };
  addAiHighlight(
    editor,
    originalSelection.from,
    originalSelection.to,
    highlightData,
  );

  // Mount popover if not already mounted
  if (!customAiPopoverApp) {
    mountCustomAiPopover(editor);
  }
}

/**
 * Mount the custom AI popover
 */
function mountCustomAiPopover(editor: Editor): void {
  // Cleanup existing
  if (customAiPopoverApp) {
    unmountCustomAiPopover();
  }

  // Create container
  customAiContainer = document.createElement('div');
  customAiContainer.style.position = 'absolute';
  customAiContainer.style.top = '0';
  customAiContainer.style.left = '0';
  customAiContainer.style.zIndex = '1000';

  // Get editor element
  const editorElement = editor.view.dom.parentElement;
  if (editorElement) {
    editorElement.append(customAiContainer);
  } else {
    document.body.append(customAiContainer);
  }

  // Calculate position
  const position = calculatePopoverPosition(editor);

  // Create Vue app
  customAiPopoverApp = createApp({
    render: () =>
      h(CustomAiPopover, {
        visible: visibleRef.value,
        originalText: originalTextRef.value,
        suggestedText: suggestedTextRef.value,
        isStreaming: isStreamingRef.value,
        isExecuting: isExecutingRef.value,
        position,
        editorElement: editorElement || undefined,
        'onUpdate:visible': (val: boolean) => {
          visibleRef.value = val;
        },
        onExecute: (prompt: string) => {
          handleExecutePrompt(prompt);
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
        onCancelGeneration: () => {
          handleCancel();
        },
      }),
  });

  customAiPopoverApp.mount(customAiContainer);
}

/**
 * Unmount the popover
 */
function unmountCustomAiPopover(): void {
  if (customAiPopoverApp) {
    customAiPopoverApp.unmount();
    customAiPopoverApp = null;
  }

  if (customAiContainer && customAiContainer.parentNode) {
    customAiContainer.remove();
    customAiContainer = null;
  }
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

  const start = view.coordsAtPos(from);
  const end = view.coordsAtPos(to);

  const editorRect = view.dom.getBoundingClientRect();

  const top = end.bottom - editorRect.top + 8;
  const left = start.left - editorRect.left;

  return { left, top };
}

/**
 * Handle execute prompt
 */
function handleExecutePrompt(prompt: string): void {
  if (!currentEditor || !currentSelection) return;

  isExecutingRef.value = true;
  isStreamingRef.value = true;

  performCustomAi(
    currentEditor,
    originalTextRef.value,
    prompt,
    currentSelection,
    originalTextRef.value.trim().length > 0,
  );
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
    console.warn('[Custom AI] Invalid selection range, cannot accept');
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
 */
function handleCancel(): void {
  handleCleanup();
}

/**
 * Cleanup
 */
function handleCleanup(): void {
  if (currentEditor) {
    removeAiHighlight(currentEditor);
  }

  unmountCustomAiPopover();

  visibleRef.value = false;
  originalTextRef.value = '';
  suggestedTextRef.value = '';
  isStreamingRef.value = false;
  isExecutingRef.value = false;

  currentEditor = null;
  currentSelection = null;
}

/**
 * Perform custom AI operation
 */
function performCustomAi(
  editor: Editor,
  selectedText: string,
  prompt: string,
  _originalSelection: { from: number; to: number },
  _hasSelectedText: boolean,
) {
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
        console.warn('[Custom AI] Failed to finalize formatting:', error);
      }
    },
    onError: (error: Error) => {
      console.error('[Custom AI] Error:', error);
      handleCleanup();
      notification.error({
        message: '自定义 AI 失败',
        description: error.message || '请稍后重试',
        duration: 3,
      });
    },
  };

  // Call AI API
  aiApiService.customCommand(
    selectedText,
    prompt,
    '你係一個專業嘅文本處理助手。直接返回處理結果,唔好加任何解釋。',
    callback,
  );
}


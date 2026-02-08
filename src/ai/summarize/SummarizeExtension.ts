import type { Editor } from '@tiptap/core';

import { Extension } from '@tiptap/core';
import { notification } from 'ant-design-vue';

import { t } from '@/locales';

import { aiApiService } from '@/api/ai';

import { aiSuggestionManager } from '../shared/aiSuggestionManager';

export interface SummarizeOptions {}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    summarize: {
      summarize: () => ReturnType;
    };
  }
}

export const SummarizeExtension = Extension.create<SummarizeOptions>({
  name: 'summarize',

  addCommands() {
    return {
      summarize:
        () =>
        ({ state, editor }) => {
          const { selection } = state;
          const { from, to } = selection;
          const selectedText = state.doc.textBetween(from, to, ' ');

          if (!selectedText.trim()) {
            console.warn('[Summarize] No text selected');
            // 显示用户友好的提示
            notification.warning({
              message: t('editor.pleaseSelectText'),
              description: t('editor.summarizeRequiresSelection'),
              duration: 3,
              placement: 'topRight',
            });
            return false;
          }

          performSummarize(editor, selectedText, { from, to });
          return true;
        },
    };
  },
});

function performSummarize(
  editor: Editor,
  selectedText: string,
  originalSelection: { from: number; to: number },
) {
  let accumulatedContent = '';

  // Show AI suggestion popover with highlight
  aiSuggestionManager.show(selectedText, originalSelection, editor);

  // Get full document context for system prompt
  const state = editor.state;
  const fullText = state.doc.textBetween(0, state.doc.content.size, ' ');
  const sysPrompt = `以下係完整嘅文件內容:\n\n${fullText}`;

  const callback = {
    onStart: () => {
      accumulatedContent = '';
    },
    onMessage: (message: { content: string }) => {
      if (message && message.content) {
        accumulatedContent += message.content;
        // Update the suggestion in popover
        aiSuggestionManager.updateSuggestion(accumulatedContent);
      }
    },
    onStop: () => {
      try {
        // Stop streaming indicator
        aiSuggestionManager.stopStreaming();

        // Update with final content
        aiSuggestionManager.updateSuggestion(accumulatedContent);
      } catch (error) {
        console.warn('[Summarize] Failed to finalize formatting:', error);
      }
    },
    onError: (error: Error) => {
      console.error('[Summarize] Error:', error);
      aiSuggestionManager.hide();
      notification.error({
        message: '总结失败',
        description: error.message || t('messages.networkError'),
        duration: 3,
      });
    },
  };

  aiApiService.summarize(selectedText, sysPrompt, callback);
}


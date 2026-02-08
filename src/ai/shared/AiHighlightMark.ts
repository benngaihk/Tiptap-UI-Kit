import type { Editor } from '@tiptap/core';

import { Mark, mergeAttributes } from '@tiptap/core';

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
export const AiHighlightMark = Mark.create<AiHighlightOptions>({
  name: 'aiHighlight',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'ai-highlight',
      },
    };
  },

  addAttributes() {
    return {
      originalText: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-original-text'),
        renderHTML: (attributes) => {
          if (!attributes.originalText) {
            return {};
          }
          return {
            'data-original-text': attributes.originalText,
          };
        },
      },
      suggestedText: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggested-text'),
        renderHTML: (attributes) => {
          if (!attributes.suggestedText) {
            return {};
          }
          return {
            'data-suggested-text': attributes.suggestedText,
          };
        },
      },
      isStreaming: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute('data-is-streaming') === 'true',
        renderHTML: (attributes) => {
          return {
            'data-is-streaming': attributes.isStreaming ? 'true' : 'false',
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span.ai-highlight',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          return {
            originalText: element.getAttribute('data-original-text'),
            suggestedText: element.getAttribute('data-suggested-text'),
            isStreaming: element.getAttribute('data-is-streaming') === 'true',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setAiHighlight:
        (data?: AiSuggestionData) =>
        ({ commands }) => {
          return commands.setMark(this.name, data || {});
        },
      unsetAiHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

/**
 * Helper function to add AI highlight to a specific range
 */
export function addAiHighlight(
  editor: Editor,
  from: number,
  to: number,
  data?: AiSuggestionData,
): void {
  const { state } = editor;
  const { tr, doc } = state;
  const aiHighlightMark = state.schema.marks.aiHighlight;

  if (!aiHighlightMark) {
    console.warn('[AI Highlight] aiHighlight mark not found in schema');
    return;
  }

  // 验证位置是否有效
  const docSize = doc.content.size;
  if (from < 0 || to < 0 || from > docSize || to > docSize || from > to) {
    console.warn('[AI Highlight] Invalid range for add:', { from, to, docSize });
    return;
  }

  tr.addMark(from, to, aiHighlightMark.create(data || {}));
  editor.view.dispatch(tr);
}

/**
 * Helper function to update AI highlight data
 */
export function updateAiHighlight(
  editor: Editor,
  from: number,
  to: number,
  data: Partial<AiSuggestionData>,
): void {
  const { state } = editor;
  const { tr, doc } = state;
  const aiHighlightMark = state.schema.marks.aiHighlight;

  if (!aiHighlightMark) {
    console.warn('[AI Highlight] aiHighlight mark not found in schema');
    return;
  }

  // 验证位置是否有效
  const docSize = doc.content.size;
  if (from < 0 || to < 0 || from > docSize || to > docSize || from > to) {
    console.warn('[AI Highlight] Invalid range for update:', { from, to, docSize });
    return;
  }

  // Find the existing mark
  let existingMark: any = null;
  doc.nodesBetween(from, to, (node) => {
    const mark = node.marks.find((m) => m.type.name === 'aiHighlight');
    if (mark) {
      existingMark = mark;
      return false;
    }
  });

  if (existingMark && existingMark.attrs) {
    // Merge existing attributes with new data
    const attrs = existingMark.attrs as Record<string, any>;
    const newAttrs = { ...attrs, ...data };
    tr.removeMark(from, to, aiHighlightMark);
    tr.addMark(from, to, aiHighlightMark.create(newAttrs));
    editor.view.dispatch(tr);
  }
}

/**
 * Helper function to remove all AI highlights
 */
export function removeAiHighlight(editor: Editor): void {
  const { state } = editor;
  const { tr, doc } = state;

  doc.descendants((node, pos) => {
    if (node.marks.some((mark) => mark.type.name === 'aiHighlight')) {
      const from = pos;
      const to = pos + node.nodeSize;
      tr.removeMark(from, to, state.schema.marks.aiHighlight);
    }
  });

  editor.view.dispatch(tr);
}

/**
 * Helper function to get AI suggestion data from a mark at position
 */
export function getAiSuggestionData(
  editor: Editor,
  pos: number,
): AiSuggestionData | null {
  const { state } = editor;
  const { doc } = state;

  const $pos = doc.resolve(pos);
  const marks = $pos.marks();
  const aiMark = marks.find((mark) => mark.type.name === 'aiHighlight');

  if (aiMark) {
    const attrs = aiMark.attrs as Record<string, any>;
    if (attrs) {
      return {
        originalText: attrs.originalText || '',
        suggestedText: attrs.suggestedText || '',
        isStreaming: attrs.isStreaming || false,
      };
    }
  }

  return null;
}


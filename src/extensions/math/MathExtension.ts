/**
 * Math Extension
 * @description Tiptap 数学公式扩展，支持 LaTeX 语法和 KaTeX 渲染
 */

import { Node, mergeAttributes, InputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { MathExtensionOptions } from './types'
import { DEFAULT_KATEX_OPTIONS } from './types'
import MathNodeView from './MathNodeView.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    math: {
      /** 插入行内公式 */
      insertInlineMath: (latex?: string) => ReturnType
      /** 插入块级公式 */
      insertBlockMath: (latex?: string) => ReturnType
      /** 更新公式内容 */
      updateMath: (latex: string) => ReturnType
    }
  }
}

export const MathExtension = Node.create<MathExtensionOptions>({
  name: 'math',

  group: 'inline',

  inline: true,

  atom: true,

  addOptions() {
    return {
      inline: true,
      block: true,
      katexOptions: DEFAULT_KATEX_OPTIONS,
    }
  },

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: element => element.getAttribute('data-latex') || element.textContent || '',
        renderHTML: attributes => ({
          'data-latex': attributes.latex,
        }),
      },
      block: {
        default: false,
        parseHTML: element => element.getAttribute('data-block') === 'true',
        renderHTML: attributes => ({
          'data-block': attributes.block ? 'true' : 'false',
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math"]',
      },
      {
        tag: 'div[data-type="math"]',
      },
      // 支持从 Markdown 粘贴的 LaTeX
      {
        tag: 'span.math-inline',
      },
      {
        tag: 'div.math-block',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const isBlock = HTMLAttributes['data-block'] === 'true'
    const tag = isBlock ? 'div' : 'span'
    return [
      tag,
      mergeAttributes(HTMLAttributes, {
        'data-type': 'math',
        class: isBlock ? 'math-node math-block' : 'math-node math-inline',
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(MathNodeView)
  },

  addCommands() {
    return {
      insertInlineMath:
        (latex = '') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { latex, block: false },
          })
        },

      insertBlockMath:
        (latex = '') =>
        ({ chain }) => {
          // 块级公式作为段落插入
          return chain()
            .insertContent({
              type: 'paragraph',
              content: [
                {
                  type: this.name,
                  attrs: { latex, block: true },
                },
              ],
            })
            .run()
        },

      updateMath:
        (latex: string) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { latex })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      // Ctrl/Cmd + M: 插入行内公式
      'Mod-m': () => this.editor.commands.insertInlineMath(),
      // Ctrl/Cmd + Shift + M: 插入块级公式
      'Mod-Shift-m': () => this.editor.commands.insertBlockMath(),
    }
  },

  addInputRules() {
    // 支持 $...$ 语法（行内公式）
    const nodeType = this.type

    return [
      new InputRule({
        // 匹配 $latex$ 格式
        find: /\$([^$]+)\$$/,
        handler: ({ state, range, match }) => {
          const latex = match[1]
          if (!latex) return null

          const { tr } = state
          tr.replaceWith(range.from, range.to, nodeType.create({ latex, block: false }))
        },
      }),
    ]
  },
})

export default MathExtension

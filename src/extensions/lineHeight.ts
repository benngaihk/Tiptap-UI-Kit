/**
 * LineHeight Extension - 行间距扩展
 * @description 自定义行间距扩展
 */

import { Extension } from '@tiptap/core'

export interface LineHeightOptions {
  types: string[]
  defaultLineHeight: string
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: '1.5',
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }) => {
          return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight }))
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight: null }))
        },
    }
  },
})


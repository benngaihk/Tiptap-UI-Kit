/**
 * PasteWord Extension - 粘贴 Word 文档扩展
 * @description 支持粘贴 Word 文档内容
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const PasteWord = Extension.create({
  name: 'pasteWord',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteWord'),
        props: {
          transformPastedHTML: (html: string) => {
            if (!html) return html
            
            // 简单的 Word 粘贴处理
            // 移除 Word 特定的样式和标签
            return html
              .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')
              .replace(/<!--[\s\S]*?-->/gi, '')
              .replace(/<style>[\s\S]*?<\/style>/gi, '')
              .replace(/<meta[\s\S]*?>/gi, '')
              .replace(/<link[\s\S]*?>/gi, '')
          },
        },
      }),
    ]
  },
})


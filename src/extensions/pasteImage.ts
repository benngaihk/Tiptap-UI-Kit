/**
 * PasteImage Extension - 粘贴图片扩展
 * @description 支持粘贴图片功能
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const PasteImage = Extension.create({
  name: 'pasteImage',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteImage'),
        props: {
          handlePaste: (view, event: ClipboardEvent) => {
            if (!view || !event.clipboardData) {
              return false
            }

            const items = Array.from(event.clipboardData.items)
            const imageItem = items.find((item) => item.type.indexOf('image') !== -1)

            if (imageItem) {
              const file = imageItem.getAsFile()
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  if (!e.target?.result) return
                  
                  const src = e.target.result as string
                  const { state, dispatch } = view
                  const { schema } = state
                  
                  if (schema.nodes.image) {
                    const imageNode = schema.nodes.image.create({ src })
                    const transaction = state.tr.replaceSelectionWith(imageNode)
                    dispatch(transaction)
                  }
                }
                reader.readAsDataURL(file)
                return true
              }
            }
            return false
          },
        },
      }),
    ]
  },
})


/**
 * ListShortcuts Extension - 列表快捷键扩展
 * @description 提供列表相关的快捷键支持
 */

import { Extension } from '@tiptap/core'

export const ListShortcuts = Extension.create({
  name: 'listShortcuts',

  addKeyboardShortcuts() {
    return {
      // Enter 键在列表项中创建新项
      Enter: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        if ($from.node(-1)?.type.name === 'taskItem') {
          return editor.commands.splitListItem('taskItem')
        }
        if ($from.node(-1)?.type.name === 'listItem') {
          return editor.commands.splitListItem('listItem')
        }
        return false
      },
      // Shift+Enter 在列表项中创建新行
      'Shift-Enter': ({ editor }) => {
        return editor.commands.first([
          () => editor.commands.newlineInCode(),
          () => editor.commands.createParagraphNear(),
        ])
      },
    }
  },
})


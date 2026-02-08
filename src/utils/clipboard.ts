/**
 * Clipboard Utilities
 * @description 剪贴板操作工具函数
 */

import type { Editor } from '@tiptap/core'

/**
 * 复制内容到剪贴板
 */
export async function copyToClipboard(
  editor: Editor,
  from: number,
  to: number
): Promise<boolean> {
  try {
    const slice = editor.state.doc.slice(from, to)
    const text = slice.content.textBetween(0, slice.content.size, '\n')

    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('[clipboard] Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * 剪切内容到剪贴板
 */
export async function cutToClipboard(
  editor: Editor,
  from: number,
  to: number
): Promise<boolean> {
  try {
    const copied = await copyToClipboard(editor, from, to)

    if (copied) {
      editor.chain().deleteRange({ from, to }).run()
      return true
    }

    return false
  } catch (error) {
    console.error('[clipboard] Failed to cut to clipboard:', error)
    return false
  }
}

/**
 * 从剪贴板粘贴内容
 */
export async function pasteFromClipboard(
  editor: Editor,
  position?: number
): Promise<boolean> {
  try {
    const text = await navigator.clipboard.readText()

    if (position !== undefined) {
      editor.chain().focus().insertContentAt(position, text).run()
    } else {
      editor.chain().focus().insertContent(text).run()
    }

    return true
  } catch (error) {
    console.error('[clipboard] Failed to paste from clipboard:', error)
    return false
  }
}

/**
 * 复制块内容
 */
export async function copyBlock(
  editor: Editor,
  from: number,
  to: number
): Promise<boolean> {
  return await copyToClipboard(editor, from, to)
}

/**
 * 剪切块内容
 */
export async function cutBlock(
  editor: Editor,
  from: number,
  to: number
): Promise<boolean> {
  return await cutToClipboard(editor, from, to)
}

/**
 * 删除块内容
 */
export function deleteBlock(editor: Editor, from: number, to: number): boolean {
  try {
    editor.chain().deleteRange({ from, to }).run()
    return true
  } catch (error) {
    console.error('[clipboard] Failed to delete block:', error)
    return false
  }
}

/**
 * 选中块内容
 */
export function selectBlock(editor: Editor, from: number, to: number): boolean {
  try {
    editor.chain().setTextSelection({ from, to }).run()
    return true
  } catch (error) {
    console.error('[clipboard] Failed to select block:', error)
    return false
  }
}

/**
 * 选中节点内容
 */
export function selectNodeContent(
  editor: Editor,
  from: number,
  to: number
): boolean {
  try {
    const contentStart = from + 1
    const contentEnd = to - 1

    if (contentStart < contentEnd) {
      editor.chain().setTextSelection({ from: contentStart, to: contentEnd }).run()
      return true
    }

    return false
  } catch (error) {
    console.error('[clipboard] Failed to select node content:', error)
    return false
  }
}

/**
 * 检查剪贴板权限
 */
export async function hasClipboardPermission(): Promise<boolean> {
  try {
    if (!navigator.clipboard) {
      return false
    }

    if ('permissions' in navigator) {
      const readPermission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName,
      })
      const writePermission = await navigator.permissions.query({
        name: 'clipboard-write' as PermissionName,
      })

      return (
        readPermission.state === 'granted' && writePermission.state === 'granted'
      )
    }

    return true
  } catch (error) {
    console.warn('[clipboard] Failed to check clipboard permission:', error)
    return false
  }
}



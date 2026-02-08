/**
 * Editor Commands Utilities
 * @description 编辑器命令执行工具函数
 */

import type { Ref } from 'vue'
import type { Editor } from '@tiptap/core'

/**
 * 链式命令类型
 */
export type EditorChain = ReturnType<Editor['chain']>

/**
 * 命令构建函数类型
 */
export type CommandBuilder = (chain: EditorChain) => EditorChain

/**
 * 创建命令执行器
 * @description 创建一个命令执行函数，自动处理 editor 实例检查和焦点管理
 * @param editor - 编辑器实例引用
 * @returns 命令执行函数
 *
 * @example
 * ```typescript
 * const runCommand = createCommandRunner(editor)
 * const toggleBold = runCommand((chain) => chain.toggleBold())
 * toggleBold() // 执行粗体切换
 * ```
 */
export function createCommandRunner(editor: Ref<Editor | null | undefined>) {
  return (fn: CommandBuilder) => () => {
    const e = editor.value
    if (!e) {
      console.warn('[editorCommands] Editor instance is null or undefined')
      return
    }
    fn(e.chain().focus()).run()
  }
}

/**
 * 创建不带焦点的命令执行器
 * @description 与 createCommandRunner 类似，但不自动设置焦点
 * @param editor - 编辑器实例引用
 * @returns 命令执行函数
 */
export function createCommandRunnerWithoutFocus(editor: Ref<Editor | null | undefined>) {
  return (fn: CommandBuilder) => () => {
    const e = editor.value
    if (!e) {
      console.warn('[editorCommands] Editor instance is null or undefined')
      return
    }
    fn(e.chain()).run()
  }
}

/**
 * 直接执行命令
 * @description 立即执行一个编辑器命令
 * @param editor - 编辑器实例引用
 * @param fn - 命令构建函数
 * @param withFocus - 是否自动聚焦，默认 true
 * @returns 命令是否执行成功
 *
 * @example
 * ```typescript
 * executeCommand(editor, (chain) => chain.toggleBold())
 * ```
 */
export function executeCommand(
  editor: Ref<Editor | null | undefined>,
  fn: CommandBuilder,
  withFocus = true
): boolean {
  const e = editor.value
  if (!e) {
    console.warn('[editorCommands] Editor instance is null or undefined')
    return false
  }

  const chain = withFocus ? e.chain().focus() : e.chain()
  return fn(chain).run()
}

/**
 * 批量执行命令
 * @description 按顺序执行多个命令
 * @param editor - 编辑器实例引用
 * @param commands - 命令构建函数数组
 * @param withFocus - 是否自动聚焦，默认 true
 * @returns 所有命令是否都执行成功
 *
 * @example
 * ```typescript
 * executeBatchCommands(editor, [
 *   (chain) => chain.toggleBold(),
 *   (chain) => chain.setColor('#ff0000')
 * ])
 * ```
 */
export function executeBatchCommands(
  editor: Ref<Editor | null | undefined>,
  commands: CommandBuilder[],
  withFocus = true
): boolean {
  const e = editor.value
  if (!e) {
    console.warn('[editorCommands] Editor instance is null or undefined')
    return false
  }

  let chain = withFocus ? e.chain().focus() : e.chain()

  for (const command of commands) {
    chain = command(chain)
  }

  return chain.run()
}



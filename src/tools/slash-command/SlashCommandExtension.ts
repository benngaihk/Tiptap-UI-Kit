/**
 * SlashCommand Extension - 斜杠命令扩展
 * @description 在空行输入 / 时弹出块类型选择菜单（类似 Notion）
 * @features
 * - 监听 / 输入，在光标位置显示命令菜单
 * - 支持输入过滤（如 /h1, /list）
 * - 键盘导航（上/下/回车/ESC）
 * - 自动关闭：点击外部、光标移动、删除 /
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

// ============================================================================
// 常量
// ============================================================================

export const slashCommandKey = new PluginKey('slashCommand')

// ============================================================================
// 类型定义
// ============================================================================

export interface SlashCommandState {
  active: boolean
  range: { from: number; to: number } | null
  query: string
  decorationPosition: { x: number; y: number } | null
}

export interface SlashCommandOptions {
  onActivate?: (state: SlashCommandState) => void
  onDeactivate?: () => void
  onQueryChange?: (query: string) => void
}

// ============================================================================
// 扩展定义
// ============================================================================

export const SlashCommandExtension = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      onActivate: undefined,
      onDeactivate: undefined,
      onQueryChange: undefined,
    }
  },

  addProseMirrorPlugins() {
    const extensionOptions = this.options

    return [
      new Plugin({
        key: slashCommandKey,

        state: {
          init(): SlashCommandState {
            return { active: false, range: null, query: '', decorationPosition: null }
          },

          apply(tr, prev, _oldState, newState): SlashCommandState {
            // 如果有显式标记关闭菜单
            const meta = tr.getMeta(slashCommandKey)
            if (meta?.deactivate) {
              return { active: false, range: null, query: '', decorationPosition: null }
            }

            // 没有文档变化且选区未变，保持当前状态
            if (!tr.docChanged && !tr.selectionSet) {
              return prev
            }

            const { selection } = newState
            const { $from } = selection

            // 只处理光标选区（非范围选区）
            if (!selection.empty) {
              if (prev.active) return { active: false, range: null, query: '', decorationPosition: null }
              return prev
            }

            // 获取当前段落文本
            const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc')

            // 匹配以 / 开头的文本
            const match = textBefore.match(/^\/(\S*)$/)

            if (match) {
              const query = match[1]
              const from = $from.start()
              const to = $from.pos

              return {
                active: true,
                range: { from, to },
                query,
                decorationPosition: null, // 由组件计算
              }
            }

            // 没有匹配，如果之前是激活状态则关闭
            if (prev.active) {
              return { active: false, range: null, query: '', decorationPosition: null }
            }

            return prev
          },
        },

        view() {
          return {
            update(view) {
              const state = slashCommandKey.getState(view.state) as SlashCommandState | undefined
              if (!state) return

              if (state.active && state.range) {
                // 计算光标位置
                const coords = view.coordsAtPos(state.range.from)
                const newState: SlashCommandState = {
                  ...state,
                  decorationPosition: { x: coords.left, y: coords.bottom },
                }
                extensionOptions.onActivate?.(newState)
                extensionOptions.onQueryChange?.(state.query)
              } else {
                extensionOptions.onDeactivate?.()
              }
            },
          }
        },
      }),
    ]
  },
})

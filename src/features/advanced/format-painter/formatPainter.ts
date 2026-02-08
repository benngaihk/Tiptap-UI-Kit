/**
 * FormatPainter Extension - 格式刷
 * @description 采样当前选区样式并应用到目标选区
 */
import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

// 为自定义命令添加类型声明，以扩展 RawCommands
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    formatPainter: {
      /** 
       * 开启格式刷并采样当前选区样式
       * @param mode - 模式：1 为单次模式（默认），2 为连续模式
       */
      startFormatPainting: (mode?: 1 | 2) => ReturnType
      /** 开启格式刷连续应用模式 */
      startContinuousFormatPainting: () => ReturnType
      /** 将采样到的样式应用到当前选区 */
      applyFormat: () => ReturnType
      /** 取消格式刷状态并清除缓存 */
      cancelFormatPainting: () => ReturnType
      /** 切换连续应用模式 */
      toggleContinuousMode: () => ReturnType
    }
  }
}

export interface FormatPainterStorage {
  /** 格式刷是否激活 */
  isActive: boolean
  /** 是否为连续应用模式 */
  isContinuous: boolean
  /** 采样的格式 */
  formats: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strike?: boolean
    subscript?: boolean
    superscript?: boolean
    color?: string | null
    highlight?: string | null
    fontFamily?: string | null
    fontSize?: string | null
    textAlign?: 'left' | 'center' | 'right' | 'justify' | null
    lineHeight?: string | null
  }
}

/** 本地存储的键名 */
const STORAGE_KEY = 'tiptap-format-painter-formats'

export type FormatPainterFormats = FormatPainterStorage['formats']

/**
 * 采样当前选区的格式样式
 * @param editor - Tiptap 编辑器实例
 * @returns 格式对象，如果采样失败则返回 null
 * @description 从编辑器中提取当前选区的所有格式信息，包括文本样式、颜色、对齐等
 */
export function sampleFormats(editor: Editor): FormatPainterFormats | null {
  try {
    const formats: FormatPainterFormats = {}

    // 基础文本样式
    formats.bold = editor.isActive('bold')
    formats.italic = editor.isActive('italic')
    formats.underline = editor.isActive('underline')
    formats.strike = editor.isActive('strike')
    formats.subscript = editor.isActive('subscript')
    formats.superscript = editor.isActive('superscript')

    // 从 textStyle 中获取颜色和字体样式
    const textStyleAttrs = editor.getAttributes('textStyle') as {
      color?: string
      fontFamily?: string
      fontSize?: string
      lineHeight?: string
    }
    formats.color = textStyleAttrs?.color ?? null
    formats.fontFamily = textStyleAttrs?.fontFamily ?? null
    formats.fontSize = textStyleAttrs?.fontSize ?? null
    formats.lineHeight = textStyleAttrs?.lineHeight ?? null

    // 从 highlight mark 中获取背景高亮颜色
    const highlightAttrs = editor.getAttributes('highlight') as { color?: string }
    formats.highlight = highlightAttrs?.color ?? null

    // 对齐（可能存在于段落或标题上）
    const paragraphAttrs = editor.getAttributes('paragraph') as {
      textAlign?: 'left' | 'center' | 'right' | 'justify'
    }
    const headingAttrs = editor.getAttributes('heading') as {
      textAlign?: 'left' | 'center' | 'right' | 'justify'
    }
    formats.textAlign = paragraphAttrs?.textAlign ?? headingAttrs?.textAlign ?? null

    return formats
  } catch (error) {
    return null
  }
}

/**
 * 保存格式到浏览器本地存储
 * @param formats - 格式对象
 */
function saveFormatsToStorage(formats: FormatPainterFormats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formats))
  } catch (error) {
    // ignore
  }
}

/**
 * 从浏览器本地存储加载格式
 * @returns 格式对象，如果不存在则返回 null
 */
function loadFormatsFromStorage(): FormatPainterFormats | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data) as FormatPainterFormats
    }
  } catch (error) {
    // ignore
  }
  return null
}

/**
 * 清除浏览器本地存储中的格式
 */
function clearFormatsFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    // ignore
  }
}

/**
 * 更新格式刷光标样式
 * @param editor - Tiptap 编辑器实例
 * @param add - 是否添加样式类，true 为添加，false 为移除
 * @description 添加或移除格式刷光标样式类
 */
function updateCursorStyle(editor: Editor, add: boolean): void {
  try {
    const dom = editor.view.dom as HTMLElement
    if (add) {
      dom.classList.add('cursor-format-painter')
    } else {
      dom.classList.remove('cursor-format-painter')
    }
  } catch (error) {
    // ignore
  }
}

/**
 * 是否处于“多人协作”状态
 * @description
 * - 仅检测到 collaboration 扩展并不代表一定是多人（也可能只是自己在线）
 * - 协作人数由业务层写入 `editor.storage.__collaborationUsersCount`
 * - 仅当人数 > 1 时才认为是多人协作（需要禁用格式刷）
 */
function isCollaborationMultiUser(editor: Editor): boolean {
  try {
    const hasCollaboration = editor.extensionManager.extensions.some((ext) => ext.name === 'collaboration')
    if (!hasCollaboration) return false

    // 业务层注入：TiptapProEditor.vue 会同步此值
    const anyEditor = editor as any
    const count = Number(anyEditor?.storage?.__collaborationUsersCount ?? 0)
    return count > 1
  } catch (error) {
    return false
  }
}

export const FormatPainter = Extension.create<{}, FormatPainterStorage>({
  name: 'formatPainter',

  addStorage() {
    // 尝试从本地存储恢复格式
    const savedFormats = loadFormatsFromStorage()
    return {
      isActive: false,
      isContinuous: false,
      formats: savedFormats || {},
    } as FormatPainterStorage
  },

  addCommands() {
    return {
      /**
       * 采样当前选区的格式
       * @param mode - 模式：1 为单次模式（默认），2 为连续模式
       * @description 获取选中文本的所有格式信息并保存，根据 mode 决定是单次还是连续应用
       */
      startFormatPainting:
        (mode?: 1 | 2) =>
        ({ editor }) => {
          // 多人协作时禁用格式刷
          if (isCollaborationMultiUser(editor)) {
            return false
          }

          // 检查是否有选中内容
          try {
            const sel = editor.state.selection
            if (!sel || sel.empty) {
              return false
            }
          } catch (error) {
            return false
          }

          // 采样格式信息
          const formats = sampleFormats(editor)
          if (!formats) {
            return false
          }

          // 保存格式到内存和本地存储
          this.storage.formats = formats
          this.storage.isActive = true
          // 如果传入 2 则为连续模式，否则（1 或 undefined）为单次模式
          this.storage.isContinuous = mode === 2
          saveFormatsToStorage(formats)

          // 更新光标样式
          updateCursorStyle(editor, true)

          return true
        },

      /**
       * 采样当前选区的格式（连续应用模式）
       * @description 获取选中文本的所有格式信息并保存，可以连续应用多次
       */
      startContinuousFormatPainting:
        () =>
        ({ editor }) => {
          // 多人协作时禁用格式刷
          if (isCollaborationMultiUser(editor)) {
            return false
          }

          // 检查是否有选中内容
          try {
            const sel = editor.state.selection
            if (!sel || sel.empty) {
              return false
            }
          } catch (error) {
            return false
          }

          // 采样格式信息
          const formats = sampleFormats(editor)
          if (!formats) {
            return false
          }

          // 保存格式到内存和本地存储
          this.storage.formats = formats
          this.storage.isActive = true
          this.storage.isContinuous = true
          saveFormatsToStorage(formats)

          // 更新光标样式
          updateCursorStyle(editor, true)

          return true
        },

      /**
       * 将保存的格式应用到当前选区
       * @description 将之前采样的格式应用到当前选中的文本
       */
      applyFormat:
        () =>
        ({ editor }) => {
          // 多人协作时禁用格式刷
          if (isCollaborationMultiUser(editor)) {
            // 如果格式刷已激活，则取消激活状态
            if (this.storage.isActive) {
              this.storage.isActive = false
              this.storage.isContinuous = false
              updateCursorStyle(editor, false)
            }
            return false
          }

          // 检查格式刷是否已激活
          if (!this.storage.isActive) {
            return false
          }

          // 检查是否有选中内容
          try {
            const sel = editor.state.selection
            if (!sel || sel.empty) {
              return false
            }
          } catch (error) {
            return false
          }

          // 检查是否有格式信息（优先从内存，其次从本地存储）
          let formats = this.storage.formats
          if (!formats || Object.keys(formats).length === 0) {
            const savedFormats = loadFormatsFromStorage()
            if (savedFormats) {
              this.storage.formats = savedFormats
              formats = savedFormats
            }
          }

          if (!formats || Object.keys(formats).length === 0) {
            return false
          }

          const { from, to } = editor.state.selection

          try {
            // 应用文本级格式
            const chain = editor.chain().focus()

            // 处理粗体
            if (formats.bold) chain.setMark('bold')
            else chain.unsetMark('bold')

            // 处理斜体
            if (formats.italic) chain.setMark('italic')
            else chain.unsetMark('italic')

            // 处理下划线
            if (formats.underline) chain.setMark('underline')
            else chain.unsetMark('underline')

            // 处理删除线
            if (formats.strike) chain.setMark('strike')
            else chain.unsetMark('strike')

            // 处理上下标（互斥，先清除再设置）
            chain.unsetMark('subscript').unsetMark('superscript')
            if (formats.subscript) chain.setMark('subscript')
            else if (formats.superscript) chain.setMark('superscript')

            // 构建 textStyle 属性对象
            const textStyleAttrs: any = {}
            if (formats.color) textStyleAttrs.color = formats.color
            if (formats.fontFamily) textStyleAttrs.fontFamily = formats.fontFamily
            if (formats.fontSize) textStyleAttrs.fontSize = formats.fontSize

            // 应用 textStyle（如果有属性）
            if (Object.keys(textStyleAttrs).length > 0) {
              chain.setMark('textStyle', textStyleAttrs)
            } else {
              chain.unsetMark('textStyle')
            }

            // 处理背景高亮
            if (formats.highlight) {
              ;(chain as any).setHighlight({ color: formats.highlight })
            } else {
              ;(chain as any).unsetHighlight?.()
            }

            // 执行所有文本级格式
            chain.run()

            // 处理段落级格式（对齐和行距）
            if (formats.textAlign) {
              editor.chain().focus().setTextSelection({ from, to }).setTextAlign(formats.textAlign).run()
            }

            if (formats.lineHeight) {
              editor.chain().focus().setTextSelection({ from, to }).setLineHeight(formats.lineHeight).run()
            }
          } catch (error) {
            return false
          }

          // 如果不是连续模式，应用后关闭格式刷
          if (!this.storage.isContinuous) {
            this.storage.isActive = false
            updateCursorStyle(editor, false)
          }

          return true
        },

      /**
       * 取消格式刷状态并清除缓存
       * @description 清除格式刷的激活状态、保存的格式信息以及浏览器缓存
       */
      cancelFormatPainting:
        () =>
        ({ editor }) => {
          this.storage.isActive = false
          this.storage.isContinuous = false
          this.storage.formats = {}
          clearFormatsFromStorage()
          updateCursorStyle(editor, false)
          return true
        },

      /**
       * 切换连续应用模式
       * @description 切换格式刷的连续应用模式开关
       */
      toggleContinuousMode:
        () =>
        () => {
          this.storage.isContinuous = !this.storage.isContinuous
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const ext = this
    return [
      new Plugin({
        props: {
          // 监听键盘事件，ESC 键退出格式刷
          handleKeyDown(_view, event: KeyboardEvent) {
            const storage = ext.storage as FormatPainterStorage
            if (storage.isActive && event.key === 'Escape') {
              ext.editor?.commands.cancelFormatPainting()
              return true // 阻止默认行为
            }
            return false
          },

          // 监听鼠标抬起事件，在格式刷激活时自动应用格式
          handleDOMEvents: {
            mouseup: () => {
              const storage = ext.storage as FormatPainterStorage
              if (storage.isActive && ext.editor) {
                // 使用 requestAnimationFrame 代替 setTimeout，确保在下一帧执行
                requestAnimationFrame(() => {
                  // 再次检查格式刷是否仍然激活（可能在延迟期间被取消）
                  if (!storage.isActive || !ext.editor) {
                    return
                  }
                  
                  try {
                    // 获取当前最新的选区状态
                    const { state } = ext.editor
                    const { empty } = state.selection
                    
                    // 如果有选区，自动应用格式
                    if (!empty) {
                      ext.editor.commands.applyFormat()
                    }
                  } catch (error) {
                    // ignore
                  }
                })
              }
              return false
            },
          },
        },
      }),
    ]
  },
})


/**
 * Core Extensions - 核心扩展配置
 * @description 根据版本动态加载编辑器扩展
 */

import type { AnyExtension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { ResizableImage } from '@/features/basic/image'
import { Link } from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
// import { CodeBlock } from '@tiptap/extension-code-block'
import { FontFamily } from '@tiptap/extension-font-family'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { CharacterCount } from '@tiptap/extension-character-count'
import { FontSize } from './fontSize'
import { PasteImage } from './pasteImage'
import { PasteWord } from './pasteWord'
import { ListShortcuts } from './listShortcuts'
import { LineHeight } from './lineHeight'
import { FormatPainter } from '@/features/advanced/format-painter'
import { MathExtension } from '@/extensions/math'
import {
  CustomAiExtension,
  ContinueWritingExtension,
  PolishExtension,
  SummarizeExtension,
  TranslationExtension,
  AiHighlightMark,
} from '@/ai'

/**
 * 编辑器版本类型
 */
export type EditorVersion = 'basic' | 'advanced' | 'premium' | 'all' | 1 | 2 | 3 | 4

/**
 * 扩展配置选项
 */
export interface ExtensionsOptions {
  /** 是否启用图片增强功能（拖拽大小调整），默认 true */
  enableImageResize?: boolean
  /** 是否禁用历史记录扩展（协作模式下需要禁用），默认 false */
  disableHistory?: boolean
}

/**
 * 根据版本获取扩展配置
 * @param _version 编辑器版本（目前所有版本使用相同扩展，后续可根据版本区分）
 * @param optionsOrEnableImageResize 配置选项或是否启用图片增强功能（兼容旧 API）
 * @returns 扩展配置数组
 */
export function getExtensionsByVersion(
  _version: EditorVersion = 'basic',
  optionsOrEnableImageResize: boolean | ExtensionsOptions = true
): AnyExtension[] {
  // 兼容旧 API：如果传入 boolean，转换为配置对象
  const options: ExtensionsOptions = typeof optionsOrEnableImageResize === 'boolean'
    ? { enableImageResize: optionsOrEnableImageResize }
    : optionsOrEnableImageResize

  const { enableImageResize = true, disableHistory = false } = options

  // TODO: 根据 version 参数区分不同版本的扩展配置
  const extensions: AnyExtension[] = []

  // 基础扩展（所有版本都包含）
  // 协作模式下禁用 history，因为 @tiptap/extension-collaboration 自带历史管理
  const starterKitConfig: Record<string, unknown> = {
    // 禁用一些高级功能，在基础版中通过其他扩展提供
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    // 禁用 link 和 underline，因为后面会单独添加配置版本
    link: false,
    underline: false,
  }
  
  // 协作模式下禁用 history
  if (disableHistory) {
    starterKitConfig.history = false
  }
  
  extensions.push(StarterKit.configure(starterKitConfig))

  // 占位符扩展
  extensions.push(
    Placeholder.configure({
      placeholder: '开始编辑你的文档...',
    })
  )

  // 文本对齐扩展
  extensions.push(
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    })
  )

  // 下划线扩展
  extensions.push(Underline)

  // 颜色和文本样式扩展
  extensions.push(Color)
  extensions.push(TextStyle)
  extensions.push(Highlight.configure({
    multicolor: true,
  }))

  // 图片扩展（使用可调整大小的图片扩展，支持拖拽大小调整）
  extensions.push(
    ResizableImage.configure({
      inline: true,
      allowBase64: true,
      enableResize: enableImageResize, // 根据配置决定是否启用图片增强功能
    })
  )

  // 链接扩展
  extensions.push(
    Link.configure({
      openOnClick: true, // 允许点击链接跳转
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    })
  )

  // 列表扩展
  extensions.push(TaskList)
  extensions.push(
    TaskItem.configure({
      nested: true,
    })
  )

  // 代码块扩展（StarterKit 已包含）
  // extensions.push(
  //   CodeBlock.configure({
  //     languageClassPrefix: 'language-',
  //   })
  // )

  // 表格扩展
  extensions.push(
    Table.configure({
      resizable: true,
    })
  )
  extensions.push(TableRow)
  extensions.push(TableCell)
  extensions.push(TableHeader)

  // 字体扩展
  extensions.push(FontFamily)
  extensions.push(FontSize)

  // 上标下标扩展
  extensions.push(Subscript)
  extensions.push(Superscript)

  // 行间距扩展
  extensions.push(LineHeight)

  // 字数统计扩展
  extensions.push(CharacterCount)

  // 粘贴扩展
  extensions.push(PasteImage)
  extensions.push(PasteWord)
  extensions.push(ListShortcuts)

  // 格式刷扩展
  extensions.push(FormatPainter)

  // 数学公式扩展
  extensions.push(MathExtension)

  // AI 功能扩展
  extensions.push(AiHighlightMark)
  extensions.push(CustomAiExtension)
  extensions.push(ContinueWritingExtension)
  extensions.push(PolishExtension)
  extensions.push(SummarizeExtension)
  extensions.push(TranslationExtension)

  return extensions
}

/**
 * 获取基础版扩展配置
 * @description 为了保持向后兼容，此函数内部调用 getExtensionsByVersion('basic')
 * @deprecated 建议直接使用 getExtensionsByVersion('basic') 或 getExtensionsByVersion(2)
 */
export function getBasicExtensions() {
  return getExtensionsByVersion('basic')
}

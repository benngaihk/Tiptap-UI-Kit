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
import { Video } from './video'
import { ListShortcuts } from './listShortcuts'
import { LineHeight } from './lineHeight'
import { FormatPainter } from '@/features/advanced/format-painter'
import { MathExtension } from '@/extensions/math'
import { t } from '@/locales'
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
 * - 'minimal' / 1：最小集（基础文本格式 + 列表 + 撤销重做）
 * - 'basic' / 2：基础集（颜色、对齐、图片、链接等，不含表格 / 数学公式 / 格式刷 / AI）
 * - 'advanced' / 'premium' / 'all' / 'full' / 3 / 4：完整集（与历史行为一致，全量加载）
 */
export type EditorVersion =
  | 'minimal'
  | 'basic'
  | 'advanced'
  | 'premium'
  | 'all'
  | 'full'
  | 1
  | 2
  | 3
  | 4

/** 内部功能等级：1=minimal 2=basic 3=full（advanced/premium/all 均为全量，保持向后兼容） */
type ExtensionTier = 1 | 2 | 3

function resolveTier(version: EditorVersion): ExtensionTier {
  switch (version) {
    case 'minimal':
    case 1:
      return 1
    case 'basic':
    case 2:
      return 2
    // advanced/premium/all/full 保持与历史行为一致：全量加载
    case 'advanced':
    case 'premium':
    case 'all':
    case 'full':
    case 3:
    case 4:
    default:
      return 3
  }
}

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
 * @param version 编辑器版本。不传时默认全量加载（与历史行为一致）；
 *                'minimal' / 'basic' 只加载对应子集（表格、数学公式、格式刷、AI 等重扩展被剔除）
 * @param optionsOrEnableImageResize 配置选项或是否启用图片增强功能（兼容旧 API）
 * @returns 扩展配置数组
 */
export function getExtensionsByVersion(
  version: EditorVersion = 'all',
  optionsOrEnableImageResize: boolean | ExtensionsOptions = true
): AnyExtension[] {
  // 兼容旧 API：如果传入 boolean，转换为配置对象
  const options: ExtensionsOptions = typeof optionsOrEnableImageResize === 'boolean'
    ? { enableImageResize: optionsOrEnableImageResize }
    : optionsOrEnableImageResize

  const { enableImageResize = true, disableHistory = false } = options

  const tier = resolveTier(version)
  const extensions: AnyExtension[] = []

  // ===== 最小集（所有版本都包含）：基础文本格式、列表、撤销重做 =====
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

  // 占位符扩展（函数形式：语言切换后能取到新文案）
  extensions.push(
    Placeholder.configure({
      placeholder: () => t('placeholder.default'),
    })
  )

  // 下划线扩展
  extensions.push(Underline)

  // 任务列表扩展
  extensions.push(TaskList)
  extensions.push(
    TaskItem.configure({
      nested: true,
    })
  )

  // 列表快捷键、字数统计（轻量，所有版本都包含）
  extensions.push(ListShortcuts)
  extensions.push(CharacterCount)

  if (tier < 2) {
    return extensions
  }

  // ===== 基础集（basic 及以上）：颜色、对齐、图片、链接、字体等 =====

  // 文本对齐扩展
  extensions.push(
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    })
  )

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

  // 字体扩展
  extensions.push(FontFamily)
  extensions.push(FontSize)

  // 上标下标扩展
  extensions.push(Subscript)
  extensions.push(Superscript)

  // 行间距扩展
  extensions.push(LineHeight)

  // 视频扩展
  extensions.push(
    Video.configure({
      inline: false,
      allowBase64: true,
    })
  )

  // 粘贴扩展
  extensions.push(PasteImage)
  extensions.push(PasteWord)

  if (tier < 3) {
    return extensions
  }

  // ===== 完整集（advanced / premium / all）：表格、格式刷、数学公式、AI =====

  // 表格扩展
  extensions.push(
    Table.configure({
      resizable: true,
    })
  )
  extensions.push(TableRow)
  extensions.push(TableCell)
  extensions.push(TableHeader)

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
 * @description 此函数内部调用 getExtensionsByVersion('basic')。
 *              注意：basic 版本现在只加载基础子集（不含表格 / 数学公式 / 格式刷 / AI），
 *              如需全量扩展请使用 getExtensionsByVersion('all')
 * @deprecated 建议直接使用 getExtensionsByVersion('basic') 或 getExtensionsByVersion(2)
 */
export function getBasicExtensions() {
  return getExtensionsByVersion('basic')
}

/**
 * DragHandleMenu 配置
 * @description 菜单项配置和操作辅助函数
 */

import type { Editor } from '@tiptap/core'
import type { Component } from 'vue'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  ScissorOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'

// 使用共享工具函数
import { selectNodeContent, cutBlock, copyBlock, deleteBlock } from '@/utils/clipboard'

// ============================================================================
// 类型定义
// ============================================================================

export interface HeadingMenuItem {
  level: number
  title: string
  action: () => void
}

export interface NamedMenuItem {
  name: string
  icon?: Component
  title: string
  action: () => void
}

export interface MenuConfig {
  headings: HeadingMenuItem[]
  textFormats: NamedMenuItem[]
  listItems: NamedMenuItem[]
}

// ============================================================================
// 常量
// ============================================================================

export const COLORS = [
  '#000000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#9900ff',
]

// ============================================================================
// 菜单配置生成器
// ============================================================================

// ============================================================================
// 菜单配置生成器
// ============================================================================

/**
 * 创建菜单配置
 * @description 生成拖拽手柄菜单的配置项
 */
export function createMenuConfig(
  editor: Editor,
  nodePos: number,
  nodeTo: number,
  onClose: () => void,
  t: (key: string) => string
): MenuConfig {
  const nodeFrom = nodePos

  /**
   * 创建标题菜单项
   */
  const createHeadingItem = (level: number): HeadingMenuItem => ({
    level,
    title: t(`editor.h${level}`),
    action: () => {
      // @ts-ignore - toggleHeading 由 StarterKit 动态添加
      editor.chain().focus().setTextSelection(nodeFrom).toggleHeading({ level }).run()
      onClose()
    },
  })

  /**
   * 创建文本格式菜单项
   */
  const createTextFormatItem = (
    name: string,
    icon: Component,
    titleKey: string,
    command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>
  ): NamedMenuItem => ({
    name,
    icon,
    title: t(titleKey),
    action: () => {
      selectNodeContent(editor, nodeFrom, nodeTo)
      // @ts-ignore - 命令由扩展动态添加
      command(editor.chain().focus()).run()
      onClose()
    },
  })

  /**
   * 创建列表菜单项
   */
  const createListItem = (
    name: string,
    icon: Component,
    titleKey: string,
    command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>
  ): NamedMenuItem => ({
    name,
    icon,
    title: t(titleKey),
    action: () => {
      // @ts-ignore - 命令由扩展动态添加
      command(editor.chain().focus().setTextSelection(nodeFrom)).run()
      onClose()
    },
  })

  return {
    // 标题
    headings: [1, 2, 3].map(createHeadingItem),

    // 文本格式
    textFormats: [
      createTextFormatItem('bold', BoldOutlined, 'editor.bold', (chain) => chain.toggleBold()),
      createTextFormatItem('italic', ItalicOutlined, 'editor.italic', (chain) => chain.toggleItalic()),
      createTextFormatItem('underline', UnderlineOutlined, 'editor.underline', (chain) => chain.toggleUnderline()),
      createTextFormatItem('strike', StrikethroughOutlined, 'editor.strike', (chain) => chain.toggleStrike()),
    ],

    // 列表
    listItems: [
      createListItem('bulletList', UnorderedListOutlined, 'editor.bulletList', (chain) => chain.toggleBulletList()),
      createListItem('orderedList', OrderedListOutlined, 'editor.orderedList', (chain) => chain.toggleOrderedList()),
      createListItem('taskList', CheckSquareOutlined, 'editor.taskList', (chain) => chain.toggleTaskList()),
    ],
  }
}

/**
 * 创建编辑操作菜单项
 * @description 生成剪切、复制、删除等编辑操作菜单项
 */
export function createEditActions(
  editor: Editor,
  nodePos: number,
  nodeTo: number,
  onClose: () => void,
  t: (key: string) => string
) {
  return [
    {
      icon: ScissorOutlined,
      title: t('editor.cut'),
      action: async () => {
        await cutBlock(editor, nodePos, nodeTo)
        onClose()
      },
    },
    {
      icon: CopyOutlined,
      title: t('editor.copy'),
      action: async () => {
        await copyBlock(editor, nodePos, nodeTo)
        onClose()
      },
    },
    {
      icon: DeleteOutlined,
      title: t('editor.delete'),
      action: () => {
        deleteBlock(editor, nodePos, nodeTo)
        onClose()
      },
      danger: true,
    },
  ]
}


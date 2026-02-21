/**
 * TiptapPro Tenant Editor Types
 * @description 编辑器类型定义（支持版本配置）
 */
import type { JSONContent } from '@tiptap/core'
import type { Editor } from '@tiptap/vue-3'

/**
 * 版本类型
 */
export type EditorVersion = 'basic' | 'advanced' | 'premium'

/**
 * 编辑器功能配置
 */
export interface FeatureConfig {
  /** 是否启用拖拽功能 */
  dragHandle?: boolean
  /** 是否启用六个点（拖拽手柄菜单）功能 */
  dragHandleMenu?: boolean
  /** 是否启用表格功能 */
  table?: boolean
  /** 是否启用表格工具栏（默认关闭，需显式开启） */
  tableToolbar?: boolean
  /** 是否启用@提及功能 */
  mention?: boolean
  /** 是否启用斜杠命令菜单（输入 / 弹出块类型选择） */
  slashCommand?: boolean
  /** 是否启用悬浮框功能 */
  floatingMenu?: boolean
  /** 是否启用图片工具栏功能 */
  image?: boolean
  /** 是否启用链接悬浮框功能 */
  linkBubbleMenu?: boolean
  /** 是否启用协作编辑功能 */
  collaboration?: boolean
  /** 是否启用头部导航 */
  headerNav?: boolean
  /** 是否启用底部导航 */
  footerNav?: boolean
}

/**
 * 版本配置接口
 */
export interface VersionConfig {
  /** 版本类型（基础版/进阶版/高级版） */
  version?: EditorVersion
  /** 功能开关配置 */
  features?: {
    /** 基础版功能 */
    basic?: boolean
    /** 进阶版功能 */
    advanced?: boolean
    /** AI功能 */
    ai?: boolean
    /** 协作编辑 */
    collaboration?: boolean
    /** 头部导航 */
    headerNav?: boolean
    /** 底部导航 */
    footerNav?: boolean
    /** 预览模式 */
    previewMode?: boolean
  }
}

/**
 * 编辑器 Props
 */
export interface TiptapProEditorProps {
  /** 版本配置 */
  version?: EditorVersion
  /** 版本配置对象（与 version 二选一） */
  versionConfig?: VersionConfig
  /** 缩放条位置：底部固定或工具栏下方 */
  zoomBarPlacement?: 'bottom' | 'belowToolbar'
  /** 是否为只读模式 */
  readonly?: boolean
  /** 是否为预览模式（无头部/底部导航，不可编辑，不可点击） */
  previewMode?: boolean
  /** 文档ID(用于加载和保存以及协同房间) */
  documentId?: string
  /** 初始内容 - 可以是 HTML 字符串或 JSON 对象（ProseMirror 格式） */
  initialContent?: string | object
  /** 表格悬浮框显示模式：1=聚焦显示；2=单元格选中显示 */
  tableMenuShowMode?: 1 | 2
  /** 功能配置（兼容旧版） */
  features?: FeatureConfig
  /** 语言设置 */
  locale?: string
}

/**
 * 协作用户信息
 */
export interface CollaboratorInfo {
  id: string | number
  name: string
  color: string
}

/**
 * 编辑器实例引用
 */
export interface EditorInstance {
  editor: Editor | null
  getEditor: () => Editor | null
  getJSON: () => JSONContent | null
  getHTML: () => string
  getText: () => string
}

/**
 * 编辑器暴露的方法
 */
export interface TiptapProEditorExpose {
  getEditor: () => Editor | null
  getJSON: () => JSONContent | null
  getHTML: () => string
  getText: () => string
}


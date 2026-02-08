/**
 * Collaboration Types - 协作编辑类型定义
 * @description 协作编辑相关的类型定义
 */

/**
 * 协作用户信息
 */
export interface CollaboratorInfo {
  /** 用户ID */
  id: string | number
  /** 用户名称 */
  name: string
  /** 用户颜色（用于光标和选区高亮） */
  color: string
}

/**
 * 用户信息（用于设置 awareness）
 */
export interface UserInfo {
  /** 用户ID */
  id: string | number
  /** 用户名称 */
  name: string
}

/**
 * 协作编辑初始化选项
 */
export interface CollaborationInitOptions {
  /** 文档ID */
  documentId: string
  /** 是否为只读模式 */
  readonly?: boolean
  /** 初始内容（用于新文档或单人编辑场景） */
  initialContent?: string | object
  /** 编辑器实例（用于设置初始内容） */
  editor?: any
  /** 用户信息获取函数 */
  getUserInfo?: () => UserInfo
  /** 协作状态变化回调 */
  onCollaboratorsChange?: (count: number) => void
  /** 协作用户列表变化回调 */
  onCollaboratorsListChange?: (users: CollaboratorInfo[]) => void
}

/**
 * 协作编辑实例
 */
export interface CollaborationInstance {
  /** Yjs 文档实例 */
  doc: any
  /** WebSocket Provider 实例 */
  provider: any
  /** 设置编辑器实例（用于在编辑器创建后更新引用） */
  setEditor?: (editor: any) => void
  /** 销毁函数 */
  destroy: () => void
}


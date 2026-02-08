/**
 * Version History Types
 * @description 版本历史系统类型定义
 */

import type { JSONContent } from '@tiptap/core'

/** 版本记录 */
export interface Version {
  /** 版本 ID */
  id: string
  /** 版本名称（可选，用户可手动命名） */
  name?: string
  /** 文档内容（JSON 格式） */
  content: JSONContent
  /** 创建时间戳 */
  createdAt: number
  /** 是否为自动保存 */
  isAutoSave: boolean
  /** 字数统计 */
  wordCount?: number
}

/** 版本差异 */
export interface VersionDiff {
  /** 旧版本 ID */
  oldVersionId: string
  /** 新版本 ID */
  newVersionId: string
  /** 差异内容（行级） */
  changes: DiffChange[]
}

/** 差异变更项 */
export interface DiffChange {
  /** 变更类型 */
  type: 'add' | 'remove' | 'unchanged'
  /** 文本内容 */
  text: string
  /** 行号 */
  lineNumber?: number
}

/** 版本历史配置 */
export interface VersionHistoryConfig {
  /** 文档 ID（用于存储隔离） */
  documentId: string
  /** 最大保存版本数 */
  maxVersions?: number
  /** 自动保存间隔（毫秒），0 表示禁用 */
  autoSaveInterval?: number
  /** 是否启用 */
  enabled?: boolean
}

/** 版本历史状态 */
export interface VersionHistoryState {
  /** 所有版本 */
  versions: Version[]
  /** 当前选中的版本 ID（用于预览） */
  selectedVersionId: string | null
  /** 对比的版本 ID（用于对比视图） */
  compareVersionId: string | null
  /** 是否正在加载 */
  loading: boolean
  /** 面板是否打开 */
  panelOpen: boolean
}

/** 默认配置 */
export const DEFAULT_VERSION_HISTORY_CONFIG: Required<Omit<VersionHistoryConfig, 'documentId'>> = {
  maxVersions: 50,
  autoSaveInterval: 60000, // 1 分钟
  enabled: true,
}

/** 存储键前缀 */
export const STORAGE_KEY_PREFIX = 'tiptap-version-history'

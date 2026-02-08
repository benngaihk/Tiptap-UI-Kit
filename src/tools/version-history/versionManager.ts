/**
 * Version Manager
 * @description 版本历史 localStorage 管理器
 */

import type { JSONContent } from '@tiptap/core'
import type { Version, VersionHistoryConfig, DiffChange } from './types'
import { STORAGE_KEY_PREFIX, DEFAULT_VERSION_HISTORY_CONFIG } from './types'

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 获取存储键
 */
function getStorageKey(documentId: string): string {
  return `${STORAGE_KEY_PREFIX}-${documentId}`
}

/**
 * 安全的 localStorage 操作
 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * 将 JSON 内容转换为纯文本（用于对比和字数统计）
 */
export function jsonToPlainText(content: JSONContent): string {
  if (!content) return ''

  const extractText = (node: JSONContent): string => {
    if (node.type === 'text' && node.text) {
      return node.text
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('')
    }

    return ''
  }

  const nodes = content.content || []
  return nodes
    .map((node: JSONContent) => extractText(node))
    .filter(Boolean)
    .join('\n')
}

/**
 * 统计字数
 */
export function countWords(text: string): number {
  // 中文按字符计数，英文按单词计数
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = text
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0).length
  return chineseChars + englishWords
}

/**
 * 简单的文本差异对比
 */
export function computeDiff(oldText: string, newText: string): DiffChange[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const changes: DiffChange[] = []

  // 使用简单的 LCS 算法进行对比
  const maxLen = Math.max(oldLines.length, newLines.length)

  let oldIdx = 0
  let newIdx = 0

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx]
    const newLine = newLines[newIdx]

    if (oldIdx >= oldLines.length) {
      // 新增行
      changes.push({ type: 'add', text: newLine, lineNumber: newIdx + 1 })
      newIdx++
    } else if (newIdx >= newLines.length) {
      // 删除行
      changes.push({ type: 'remove', text: oldLine, lineNumber: oldIdx + 1 })
      oldIdx++
    } else if (oldLine === newLine) {
      // 相同行
      changes.push({ type: 'unchanged', text: newLine, lineNumber: newIdx + 1 })
      oldIdx++
      newIdx++
    } else {
      // 找到下一个匹配点
      let foundInNew = newLines.slice(newIdx + 1).indexOf(oldLine)
      let foundInOld = oldLines.slice(oldIdx + 1).indexOf(newLine)

      if (foundInNew >= 0 && (foundInOld < 0 || foundInNew <= foundInOld)) {
        // 新版本有插入
        changes.push({ type: 'add', text: newLine, lineNumber: newIdx + 1 })
        newIdx++
      } else if (foundInOld >= 0) {
        // 旧版本有删除
        changes.push({ type: 'remove', text: oldLine, lineNumber: oldIdx + 1 })
        oldIdx++
      } else {
        // 修改
        changes.push({ type: 'remove', text: oldLine, lineNumber: oldIdx + 1 })
        changes.push({ type: 'add', text: newLine, lineNumber: newIdx + 1 })
        oldIdx++
        newIdx++
      }
    }

    // 防止无限循环
    if (oldIdx + newIdx > maxLen * 3) break
  }

  return changes
}

/**
 * 版本管理器
 */
export class VersionManager {
  private documentId: string
  private config: Required<Omit<VersionHistoryConfig, 'documentId'>>

  constructor(config: VersionHistoryConfig) {
    this.documentId = config.documentId
    this.config = {
      maxVersions: config.maxVersions ?? DEFAULT_VERSION_HISTORY_CONFIG.maxVersions,
      autoSaveInterval: config.autoSaveInterval ?? DEFAULT_VERSION_HISTORY_CONFIG.autoSaveInterval,
      enabled: config.enabled ?? DEFAULT_VERSION_HISTORY_CONFIG.enabled,
    }
  }

  /**
   * 获取所有版本
   */
  getVersions(): Version[] {
    const data = safeGetItem(getStorageKey(this.documentId))
    if (!data) return []

    try {
      const versions = JSON.parse(data) as Version[]
      // 按时间倒序排列
      return versions.sort((a, b) => b.createdAt - a.createdAt)
    } catch {
      return []
    }
  }

  /**
   * 获取单个版本
   */
  getVersion(versionId: string): Version | null {
    const versions = this.getVersions()
    return versions.find(v => v.id === versionId) || null
  }

  /**
   * 保存新版本
   */
  saveVersion(content: JSONContent, name?: string, isAutoSave: boolean = false): Version {
    const versions = this.getVersions()
    const plainText = jsonToPlainText(content)

    const newVersion: Version = {
      id: generateId(),
      name,
      content,
      createdAt: Date.now(),
      isAutoSave,
      wordCount: countWords(plainText),
    }

    // 添加到开头
    versions.unshift(newVersion)

    // 限制版本数量
    const trimmedVersions = versions.slice(0, this.config.maxVersions)

    // 保存
    safeSetItem(getStorageKey(this.documentId), JSON.stringify(trimmedVersions))

    return newVersion
  }

  /**
   * 删除版本
   */
  deleteVersion(versionId: string): boolean {
    const versions = this.getVersions()
    const filtered = versions.filter(v => v.id !== versionId)

    if (filtered.length === versions.length) {
      return false
    }

    safeSetItem(getStorageKey(this.documentId), JSON.stringify(filtered))
    return true
  }

  /**
   * 重命名版本
   */
  renameVersion(versionId: string, name: string): boolean {
    const versions = this.getVersions()
    const version = versions.find(v => v.id === versionId)

    if (!version) return false

    version.name = name
    safeSetItem(getStorageKey(this.documentId), JSON.stringify(versions))
    return true
  }

  /**
   * 对比两个版本
   */
  compareVersions(oldVersionId: string, newVersionId: string): DiffChange[] {
    const oldVersion = this.getVersion(oldVersionId)
    const newVersion = this.getVersion(newVersionId)

    if (!oldVersion || !newVersion) return []

    const oldText = jsonToPlainText(oldVersion.content)
    const newText = jsonToPlainText(newVersion.content)

    return computeDiff(oldText, newText)
  }

  /**
   * 清除所有版本
   */
  clearAllVersions(): void {
    try {
      localStorage.removeItem(getStorageKey(this.documentId))
    } catch {
      // ignore
    }
  }

  /**
   * 检查是否应该自动保存（内容发生变化）
   */
  shouldAutoSave(content: JSONContent): boolean {
    const versions = this.getVersions()
    if (versions.length === 0) return true

    const latestVersion = versions[0]
    const currentText = jsonToPlainText(content)
    const latestText = jsonToPlainText(latestVersion.content)

    // 内容不同才保存
    return currentText !== latestText
  }
}

/**
 * 创建版本管理器
 */
export function createVersionManager(config: VersionHistoryConfig): VersionManager {
  return new VersionManager(config)
}

/**
 * Version History Composable
 * @description 版本历史 Vue Composable
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { Editor } from '@tiptap/core'
import type { Version, DiffChange } from './types'
import { DEFAULT_VERSION_HISTORY_CONFIG } from './types'
import { VersionManager } from './versionManager'

export interface UseVersionHistoryOptions {
  /** 编辑器实例 */
  editor: Ref<Editor | null | undefined>
  /** 文档 ID */
  documentId: string
  /** 最大版本数 */
  maxVersions?: number
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number
  /** 是否启用 */
  enabled?: boolean
}

export interface UseVersionHistoryReturn {
  // 状态
  versions: Ref<Version[]>
  selectedVersion: Ref<Version | null>
  compareVersion: Ref<Version | null>
  diffChanges: Ref<DiffChange[]>
  panelOpen: Ref<boolean>
  loading: Ref<boolean>

  // 方法
  saveVersion: (name?: string) => Version | null
  deleteVersion: (versionId: string) => boolean
  renameVersion: (versionId: string, name: string) => boolean
  restoreVersion: (versionId: string) => boolean
  selectVersion: (versionId: string | null) => void
  setCompareVersion: (versionId: string | null) => void
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  refreshVersions: () => void
}

/**
 * 版本历史 Composable
 */
export function useVersionHistory(options: UseVersionHistoryOptions): UseVersionHistoryReturn {
  const {
    editor,
    documentId,
    maxVersions = DEFAULT_VERSION_HISTORY_CONFIG.maxVersions,
    autoSaveInterval = DEFAULT_VERSION_HISTORY_CONFIG.autoSaveInterval,
    enabled = DEFAULT_VERSION_HISTORY_CONFIG.enabled,
  } = options

  // 状态
  const versions = ref<Version[]>([])
  const selectedVersionId = ref<string | null>(null)
  const compareVersionId = ref<string | null>(null)
  const panelOpen = ref(false)
  const loading = ref(false)

  // 管理器实例
  let manager: VersionManager | null = null
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null

  // 计算属性
  const selectedVersion = computed(() => {
    if (!selectedVersionId.value) return null
    return versions.value.find(v => v.id === selectedVersionId.value) || null
  })

  const compareVersion = computed(() => {
    if (!compareVersionId.value) return null
    return versions.value.find(v => v.id === compareVersionId.value) || null
  })

  const diffChanges = computed(() => {
    if (!selectedVersionId.value || !compareVersionId.value || !manager) {
      return []
    }
    return manager.compareVersions(compareVersionId.value, selectedVersionId.value)
  })

  // 初始化
  function init() {
    if (!enabled || !documentId) return

    manager = new VersionManager({
      documentId,
      maxVersions,
      autoSaveInterval,
      enabled,
    })

    refreshVersions()
    startAutoSave()
  }

  // 刷新版本列表
  function refreshVersions() {
    if (!manager) return
    versions.value = manager.getVersions()
  }

  // 保存版本
  function saveVersion(name?: string): Version | null {
    if (!manager || !editor.value) return null

    const content = editor.value.getJSON()
    const version = manager.saveVersion(content, name, false)
    refreshVersions()
    return version
  }

  // 删除版本
  function deleteVersion(versionId: string): boolean {
    if (!manager) return false

    const result = manager.deleteVersion(versionId)
    if (result) {
      refreshVersions()
      // 如果删除的是当前选中的版本，清除选中状态
      if (selectedVersionId.value === versionId) {
        selectedVersionId.value = null
      }
      if (compareVersionId.value === versionId) {
        compareVersionId.value = null
      }
    }
    return result
  }

  // 重命名版本
  function renameVersion(versionId: string, name: string): boolean {
    if (!manager) return false

    const result = manager.renameVersion(versionId, name)
    if (result) {
      refreshVersions()
    }
    return result
  }

  // 恢复版本
  function restoreVersion(versionId: string): boolean {
    if (!manager || !editor.value) return false

    const version = manager.getVersion(versionId)
    if (!version) return false

    // 先保存当前版本
    const content = editor.value.getJSON()
    if (manager.shouldAutoSave(content)) {
      manager.saveVersion(content, undefined, true)
    }

    // 恢复内容
    editor.value.commands.setContent(version.content)
    refreshVersions()

    return true
  }

  // 选择版本（预览）
  function selectVersion(versionId: string | null) {
    selectedVersionId.value = versionId
  }

  // 设置对比版本
  function setCompareVersion(versionId: string | null) {
    compareVersionId.value = versionId
  }

  // 面板控制
  function openPanel() {
    panelOpen.value = true
    refreshVersions()
  }

  function closePanel() {
    panelOpen.value = false
    selectedVersionId.value = null
    compareVersionId.value = null
  }

  function togglePanel() {
    if (panelOpen.value) {
      closePanel()
    } else {
      openPanel()
    }
  }

  // 自动保存
  function startAutoSave() {
    if (!enabled || autoSaveInterval <= 0) return

    stopAutoSave()

    autoSaveTimer = setInterval(() => {
      if (!manager || !editor.value) return

      const content = editor.value.getJSON()
      if (manager.shouldAutoSave(content)) {
        manager.saveVersion(content, undefined, true)
        refreshVersions()
      }
    }, autoSaveInterval)
  }

  function stopAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
      autoSaveTimer = null
    }
  }

  // 生命周期
  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    stopAutoSave()
  })

  // 监听 documentId 变化
  watch(() => documentId, (newId, oldId) => {
    if (newId !== oldId) {
      stopAutoSave()
      selectedVersionId.value = null
      compareVersionId.value = null
      init()
    }
  })

  return {
    // 状态
    versions,
    selectedVersion,
    compareVersion,
    diffChanges,
    panelOpen,
    loading,

    // 方法
    saveVersion,
    deleteVersion,
    renameVersion,
    restoreVersion,
    selectVersion,
    setCompareVersion,
    openPanel,
    closePanel,
    togglePanel,
    refreshVersions,
  }
}

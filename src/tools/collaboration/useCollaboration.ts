/**
 * useCollaboration - 协作编辑状态管理 Composable
 * @description 提供协作编辑的完整状态管理
 */

import { ref, computed, readonly, shallowRef } from 'vue'
import type { CollaboratorInfo, CollaborationInstance, CollaborationInitOptions, UserInfo } from './types'
import { initCollaboration, createCollaborationExtensions } from './collaboration'
import { logger } from './utils'

/** Composable 配置 */
export interface UseCollaborationOptions {
  getUserInfo?: () => UserInfo
  onCollaboratorsChange?: (count: number) => void
  onCollaboratorsListChange?: (users: CollaboratorInfo[]) => void
}

/** 初始化选项（不含回调） */
type InitOptions = Omit<CollaborationInitOptions, 'onCollaboratorsChange' | 'onCollaboratorsListChange'>

/**
 * 协作编辑状态管理
 */
export function useCollaboration(options: UseCollaborationOptions = {}) {
  // 核心状态
  const enabled = ref(false)
  const instance = shallowRef<CollaborationInstance | null>(null)
  const initializing = ref(false)
  const connected = computed(() => !!instance.value)

  // 协作者状态
  const collaboratorsCount = ref(0)
  const collaboratorsList = ref<CollaboratorInfo[]>([])

  // 内部回调
  const onCountChange = (count: number) => {
    collaboratorsCount.value = count
    options.onCollaboratorsChange?.(count)
  }

  const onListChange = (users: CollaboratorInfo[]) => {
    collaboratorsList.value = users
    options.onCollaboratorsListChange?.(users)
  }

  /** 开启协作 */
  const enable = async (initOptions: InitOptions): Promise<CollaborationInstance | null> => {
    if (enabled.value && instance.value) {
      logger.info('协作已启用，跳过')
      return instance.value
    }

    if (initializing.value) {
      logger.info('正在初始化中')
      return null
    }

    try {
      initializing.value = true
      enabled.value = true

      const result = await initCollaboration({
        ...initOptions,
        getUserInfo: initOptions.getUserInfo ?? options.getUserInfo,
        onCollaboratorsChange: onCountChange,
        onCollaboratorsListChange: onListChange,
      })

      if (result) {
        instance.value = result
        logger.success('协作已启用')
      } else {
        enabled.value = false
        logger.warn('协作初始化失败')
      }

      return result
    } catch (error) {
      enabled.value = false
      logger.error('启用协作失败:', error)
      return null
    } finally {
      initializing.value = false
    }
  }

  /** 关闭协作 */
  const disable = () => {
    if (instance.value) {
      try {
        instance.value.destroy()
        logger.success('协作已关闭')
      } catch (error) {
        logger.error('关闭协作失败:', error)
      }
      instance.value = null
    }
    enabled.value = false
    initializing.value = false
    collaboratorsCount.value = 0
    collaboratorsList.value = []
  }

  /** 初始化并获取扩展 */
  const initWithExtensions = async (initOptions: InitOptions): Promise<any[]> => {
    const result = await enable(initOptions)
    if (!result) return []
    return createCollaborationExtensions(result, initOptions.getUserInfo ?? options.getUserInfo)
  }

  /** 更新编辑器引用 */
  const setEditor = (editor: any) => {
    instance.value?.setEditor?.(editor)
  }

  return {
    // 只读状态
    enabled: readonly(enabled),
    connected,
    initializing: readonly(initializing),
    instance: readonly(instance),
    collaboratorsCount: readonly(collaboratorsCount),
    collaboratorsList: readonly(collaboratorsList),
    // 方法
    enable,
    disable,
    initWithExtensions,
    setEditor,
    reset: disable,
  }
}

export type UseCollaborationReturn = ReturnType<typeof useCollaboration>

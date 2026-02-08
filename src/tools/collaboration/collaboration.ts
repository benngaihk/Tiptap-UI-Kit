/**
 * Collaboration - 协作编辑核心逻辑
 * @description 提供 Yjs + WebSocket 的协作编辑功能
 */

import type { AnyExtension } from '@tiptap/core'
import type { CollaborationInitOptions, CollaborationInstance, UserInfo } from './types'
import {
  getRandomColor,
  TimerManager,
  EventManager,
  isDocumentEmpty,
  getUniqueUsers,
  logger,
  normalizeWebSocketUrl,
  debounce,
} from './utils'

// 重新导出 getRandomColor，保持原有 API 兼容
export { getRandomColor }

/** 默认空文档 */
const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] }

/** 配置常量 */
const CONFIG = {
  /** 等待编辑器创建的最大重试次数 */
  MAX_EDITOR_WAIT_RETRIES: 10,
  /** 重试间隔（ms） */
  RETRY_INTERVAL: 500,
  /** 初始化延迟（ms） */
  INIT_DELAY: 1000,
  /** 防抖延迟（ms） */
  DEBOUNCE_DELAY: 200,
}

/**
 * 规范化内容格式
 * @description 确保内容是完整的文档对象（type: 'doc'）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeContent(content: any, options?: { silent?: boolean }): any {
  if (!content) return EMPTY_DOC
  if (typeof content === 'string') return content

  const log = options?.silent ? (() => {}) : logger.info.bind(logger)

  if (Array.isArray(content)) {
    log('数组格式内容，包装为文档对象')
    return { type: 'doc', content }
  }

  if (typeof content === 'object') {
    if (content.type === 'doc') return content
    if (Array.isArray(content.content)) {
      log('非 doc 类型对象，包装为文档对象')
      return { type: 'doc', content: content.content }
    }
    log('单节点对象，包装为文档对象')
    return { type: 'doc', content: [content] }
  }

  logger.warn('未知内容格式，使用空文档')
  return EMPTY_DOC
}

/** 获取内容节点数量 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getContentLength(content: any): number {
  if (Array.isArray(content)) return content.length
  return content?.content?.length ?? 0
}

/**
 * 判断是否应使用 initialContent
 */
function shouldUseInitialContent(
  isEmpty: boolean,
  onlineCount: number,
  initialContent: any,
  currentContent: any
): boolean {
  // 文档为空 → 使用 initialContent
  if (isEmpty) {
    logger.info('文档为空，使用 initialContent')
    return true
  }
  
  // 单人编辑 → 使用 initialContent
  if (onlineCount <= 1) {
    logger.info('单人编辑，使用 initialContent')
    return true
  }
  
  // 多人协同 → 比较内容长度
  const initialLen = getContentLength(initialContent)
  const currentLen = getContentLength(currentContent)
  
  if (initialLen > 0 && initialLen !== currentLen) {
    logger.info('内容长度不一致，使用 initialContent', { initialLen, currentLen })
    return true
  }
  
  logger.info('多人协同，使用 Yjs 数据')
  return false
}

/**
 * 初始化 Yjs 协同编辑
 */
export async function initCollaboration(
  options: CollaborationInitOptions
): Promise<CollaborationInstance | null> {
  const {
    documentId,
    readonly = false,
    initialContent,
    editor,
    getUserInfo: getUserInfoFn,
    onCollaboratorsChange,
    onCollaboratorsListChange,
  } = options

  if (readonly || !documentId) {
    logger.info('协作功能未启用', { readonly, hasDocId: !!documentId })
    return null
  }

  try {
    logger.info('初始化协作，文档ID:', documentId)

    // 并行导入依赖
    const [{ getWebSocketUrl }, Y, { WebsocketProvider }] = await Promise.all([
      import('@/api/websocket'),
      import('yjs'),
      import('y-websocket'),
    ])

    // 获取 WebSocket URL
    const wsUrl = normalizeWebSocketUrl(getWebSocketUrl(documentId))
    if (!wsUrl) {
      logger.error('WebSocket URL 无效')
      return null
    }

    // 创建 Yjs 文档和 Provider
    const doc = new Y.Doc()
    const roomName = `document-${documentId}`
    const wsProvider = new WebsocketProvider(wsUrl, roomName, doc, { connect: true })

    // 工具管理器
    const timerManager = new TimerManager()
    const eventManager = new EventManager()

    // 用户信息
    const userInfo = getUserInfoFn?.() ?? { id: 'anonymous', name: '匿名用户' }
    const userColor = getRandomColor()

    const setUserInfo = () => {
      wsProvider.awareness.setLocalStateField('user', {
        id: userInfo.id,
        name: userInfo.name,
        color: userColor,
      })
    }

    const getRoomStatus = () => {
      const users = getUniqueUsers(wsProvider.awareness)
      return { users, count: users.length }
    }

    // 状态变量
    let currentEditor = editor
    let contentInitialized = false
    let syncProcessed = false
    let retryCount = 0

    // WebSocket 状态处理
    eventManager.on(wsProvider, 'status', ({ status }: { status: string }) => {
      logger.info('连接状态:', status)
      if (status === 'connected') setUserInfo()
    })

    // 同步处理
    const handleSync = (isSynced: boolean) => {
      if (!isSynced || (syncProcessed && contentInitialized)) return

      // 等待编辑器
      if (!currentEditor) {
        if (retryCount >= CONFIG.MAX_EDITOR_WAIT_RETRIES) {
          logger.warn('编辑器等待超时')
          syncProcessed = true
          return
        }
        retryCount++
        timerManager.setTimeout(() => {
          currentEditor = options.editor ?? currentEditor
          handleSync(true)
        }, CONFIG.RETRY_INTERVAL)
        return
      }

      // 内容初始化
      if (initialContent && !contentInitialized && !syncProcessed) {
        syncProcessed = true
        
        timerManager.setTimeout(() => {
          if (contentInitialized) return
          
          currentEditor = currentEditor || options.editor
          if (!currentEditor) {
            logger.warn('编辑器未创建，跳过内容设置')
            return
          }

          const { count } = getRoomStatus()
          const currentContent = currentEditor.getJSON()
          const isEmpty = isDocumentEmpty(currentContent)
          
          contentInitialized = true

          if (shouldUseInitialContent(isEmpty, count, initialContent, currentContent)) {
            currentEditor.commands.setContent(normalizeContent(initialContent))
          }
        }, CONFIG.RETRY_INTERVAL)
      }
    }
    eventManager.on(wsProvider, 'sync', handleSync)

    // 协作者变化（防抖）
    const debouncedUpdate = debounce(() => {
      const { users, count } = getRoomStatus()
      onCollaboratorsChange?.(count)
      onCollaboratorsListChange?.(users)
    }, CONFIG.DEBOUNCE_DELAY)
    eventManager.on(wsProvider.awareness, 'change', debouncedUpdate.run)

    // 清理函数
    const cleanup = () => {
      debouncedUpdate.cancel()
      timerManager.clearAll()
      eventManager.removeAll()
    }

    // 包装 destroy
    const originalDestroy = wsProvider.destroy?.bind(wsProvider)
    wsProvider.destroy = () => {
      cleanup()
      originalDestroy?.()
    }

    // 初始化
    setUserInfo()
    timerManager.setTimeout(() => {
      const { users, count } = getRoomStatus()
      onCollaboratorsChange?.(count)
      onCollaboratorsListChange?.(users)
    }, CONFIG.INIT_DELAY)

    logger.success('协作初始化成功，房间:', roomName)

    return {
      doc,
      provider: wsProvider,
      setEditor: (newEditor: any) => {
        currentEditor = newEditor
        if (wsProvider.synced && !contentInitialized) {
          handleSync(true)
        }
      },
      destroy: () => {
        cleanup()
        try { wsProvider.destroy() } catch {}
        try { doc.destroy() } catch {}
        logger.success('协作实例已销毁')
      },
    }
  } catch (error) {
    logger.error('初始化失败:', error)
    return null
  }
}

/**
 * 创建协作编辑扩展
 */
export async function createCollaborationExtensions(
  instance: CollaborationInstance | null,
  getUserInfo?: () => UserInfo
): Promise<AnyExtension[]> {
  if (!instance) return []

  const [Collaboration, CollaborationCursor] = await Promise.all([
    import('@tiptap/extension-collaboration').then(m => m.default),
    import('@tiptap/extension-collaboration-cursor').then(m => m.default),
  ])

  const user = getUserInfo?.() ?? { id: 'anonymous', name: '匿名用户' }

  return [
    Collaboration.configure({ document: instance.doc }),
    CollaborationCursor.configure({
      provider: instance.provider,
      user: { id: user.id, name: user.name, color: getRandomColor() },
    }),
  ]
}

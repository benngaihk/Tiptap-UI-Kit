/**
 * Collaboration - 协作编辑工具模块
 * @description 提供 Yjs + WebSocket 的协作编辑功能
 */

// 类型导出
export * from './types'

// 核心功能
export {
  initCollaboration,
  createCollaborationExtensions,
  normalizeContent,
  getRandomColor,
} from './collaboration'

// 工具函数
export {
  logger,
  TimerManager,
  EventManager,
  isDocumentEmpty,
  getUniqueUsers,
  normalizeWebSocketUrl,
  debounce,
} from './utils'

// Composable
export { useCollaboration } from './useCollaboration'
export type { UseCollaborationOptions, UseCollaborationReturn } from './useCollaboration'

// 组件
export { default as CollaborationToggle } from './CollaborationToggle.vue'

// 样式文件需要在使用时单独导入
// import './tools/collaboration/collaboration.css'


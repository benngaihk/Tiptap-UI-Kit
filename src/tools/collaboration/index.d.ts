/**
 * Collaboration - 协作编辑工具模块
 * @description 提供 Yjs + WebSocket 的协作编辑功能
 */
export * from './types';
export { initCollaboration, createCollaborationExtensions, normalizeContent, getRandomColor, } from './collaboration';
export { logger, TimerManager, EventManager, isDocumentEmpty, getUniqueUsers, normalizeWebSocketUrl, debounce, } from './utils';
export { useCollaboration } from './useCollaboration';
export type { UseCollaborationOptions, UseCollaborationReturn } from './useCollaboration';
export { default as CollaborationToggle } from './CollaborationToggle.vue';
//# sourceMappingURL=index.d.ts.map
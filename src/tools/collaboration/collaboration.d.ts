/**
 * Collaboration - 协作编辑核心逻辑
 * @description 提供 Yjs + WebSocket 的协作编辑功能
 */
import type { CollaborationInitOptions, CollaborationInstance, UserInfo } from './types';
import { getRandomColor } from './utils';
export { getRandomColor };
/**
 * 规范化内容格式
 * @description 确保内容是完整的文档对象（type: 'doc'）
 */
export declare function normalizeContent(content: any, options?: {
    silent?: boolean;
}): any;
/**
 * 初始化 Yjs 协同编辑
 */
export declare function initCollaboration(options: CollaborationInitOptions): Promise<CollaborationInstance | null>;
/**
 * 创建协作编辑扩展
 */
export declare function createCollaborationExtensions(instance: CollaborationInstance | null, getUserInfo?: () => UserInfo): Promise<any[]>;
//# sourceMappingURL=collaboration.d.ts.map
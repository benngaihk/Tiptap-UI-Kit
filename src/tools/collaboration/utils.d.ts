/**
 * Collaboration Utils - 协作编辑工具函数
 */
import type { CollaboratorInfo } from './types';
/** 生成随机颜色 */
export declare function getRandomColor(): string;
export declare const logger: {
    info: () => void;
    warn: () => void;
    error: () => void;
    success: () => void;
};
/** 定时器管理器 */
export declare class TimerManager {
    private timeouts;
    private intervals;
    setTimeout(fn: () => void, delay: number): NodeJS.Timeout;
    setInterval(fn: () => void, delay: number): NodeJS.Timeout;
    clearTimeout(id: NodeJS.Timeout): void;
    clearAll(): {
        timeoutCount: number;
        intervalCount: number;
    };
}
/** 事件监听器管理器 */
export declare class EventManager {
    private listeners;
    on(target: any, event: string, handler: (...args: any[]) => void): void;
    removeAll(): number;
}
/** 获取去重用户列表 */
export declare function getUniqueUsers(awareness: any): CollaboratorInfo[];
/** 检查文档是否为空 */
export declare function isDocumentEmpty(content: any): boolean;
/** 防抖函数 */
export declare function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): {
    run: T;
    cancel: () => void;
};
/** 规范化 WebSocket URL */
export declare function normalizeWebSocketUrl(url: string | null | undefined): string | null;
//# sourceMappingURL=utils.d.ts.map
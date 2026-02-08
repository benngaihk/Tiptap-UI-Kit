/**
 * Clipboard Utilities
 * @description 剪贴板操作工具函数
 */
import type { Editor } from '@tiptap/core';
/**
 * 复制内容到剪贴板
 */
export declare function copyToClipboard(editor: Editor, from: number, to: number): Promise<boolean>;
/**
 * 剪切内容到剪贴板
 */
export declare function cutToClipboard(editor: Editor, from: number, to: number): Promise<boolean>;
/**
 * 从剪贴板粘贴内容
 */
export declare function pasteFromClipboard(editor: Editor, position?: number): Promise<boolean>;
/**
 * 复制块内容
 */
export declare function copyBlock(editor: Editor, from: number, to: number): Promise<boolean>;
/**
 * 剪切块内容
 */
export declare function cutBlock(editor: Editor, from: number, to: number): Promise<boolean>;
/**
 * 删除块内容
 */
export declare function deleteBlock(editor: Editor, from: number, to: number): boolean;
/**
 * 选中块内容
 */
export declare function selectBlock(editor: Editor, from: number, to: number): boolean;
/**
 * 选中节点内容
 */
export declare function selectNodeContent(editor: Editor, from: number, to: number): boolean;
/**
 * 检查剪贴板权限
 */
export declare function hasClipboardPermission(): Promise<boolean>;
//# sourceMappingURL=clipboard.d.ts.map
import type { Editor } from '@tiptap/core';
import type { ToolbarButtonConfig, HeadingConfig, ListToolConfig, MenuItemConfig } from './toolbar';
/**
 * 创建文本格式工具配置
 */
export declare function createTextFormatTools(editor: Editor): ToolbarButtonConfig[];
/**
 * 创建标题工具配置
 */
export declare function createHeadingTools(editor: Editor): HeadingConfig[];
/**
 * 创建列表工具配置
 */
export declare function createListTools(editor: Editor): ListToolConfig[];
/**
 * 创建 AI 工具菜单项配置
 * @param editor 编辑器实例
 * @param t 翻译函数，用于国际化
 */
export declare function createAiToolMenuItems(editor: Editor, t?: (key: string, params?: Record<string, any>) => string): MenuItemConfig[];
//# sourceMappingURL=toolbarConfigs.d.ts.map
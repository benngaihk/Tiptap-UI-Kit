/**
 * DragHandleMenu 配置
 * @description 菜单项配置和操作辅助函数
 */
import type { Editor } from '@tiptap/core';
import type { Component } from 'vue';
export interface HeadingMenuItem {
    level: number;
    title: string;
    action: () => void;
}
export interface NamedMenuItem {
    name: string;
    icon?: Component;
    title: string;
    action: () => void;
}
export interface MenuConfig {
    headings: HeadingMenuItem[];
    textFormats: NamedMenuItem[];
    listItems: NamedMenuItem[];
}
export declare const COLORS: string[];
/**
 * 创建菜单配置
 * @description 生成拖拽手柄菜单的配置项
 */
export declare function createMenuConfig(editor: Editor, nodePos: number, nodeTo: number, onClose: () => void, t: (key: string) => string): MenuConfig;
/**
 * 创建编辑操作菜单项
 * @description 生成剪切、复制、删除等编辑操作菜单项
 */
export declare function createEditActions(editor: Editor, nodePos: number, nodeTo: number, onClose: () => void, t: (key: string) => string): ({
    icon: import("@ant-design/icons-vue/lib/icons/ScissorOutlined").ScissorOutlinedIconType;
    title: string;
    action: () => Promise<void>;
    danger?: undefined;
} | {
    icon: import("@ant-design/icons-vue/lib/icons/DeleteOutlined").DeleteOutlinedIconType;
    title: string;
    action: () => void;
    danger: boolean;
})[];
//# sourceMappingURL=dragHandleMenuConfig.d.ts.map
/**
 * Toolbar Types
 * @description 工具栏相关的类型定义
 */
import type { Component } from 'vue';
import type { Editor } from '@tiptap/core';
/**
 * 文本格式类型名称
 */
export type TextFormatType = 'bold' | 'italic' | 'underline' | 'strike' | 'code';
/**
 * 文本格式配置接口
 */
export interface TextFormatConfig {
    /** 格式类型名称 */
    name: TextFormatType;
    /** 图标组件 */
    icon: Component;
    /** 格式标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * 工具栏按钮配置接口
 */
export interface ToolbarButtonConfig {
    /** 按钮名称/标识 */
    name: string;
    /** 按钮图标组件 */
    icon?: Component;
    /** 按钮标题（hover 提示） */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
    /** 是否禁用 */
    disabled?: boolean;
}
/**
 * 标题级别类型
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/**
 * 标题值类型（包含正文）
 */
export type HeadingValue = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
/**
 * 标题配置接口
 */
export interface HeadingConfig {
    /** 标题级别 (1-6) */
    level: HeadingLevel;
    /** 标题标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * 颜色工具配置接口
 */
export interface ColorToolConfig {
    /** 颜色类型（文本或背景） */
    type: 'text' | 'bg' | 'highlight';
    /** 工具标题 */
    title: string;
    /** 图标组件 */
    icon: Component;
    /** 选择颜色时执行的操作 */
    action: (color: string) => void;
}
/**
 * 表格操作配置接口
 */
export interface TableOperationConfig {
    /** 操作名称 */
    name: string;
    /** 图标组件 */
    icon: Component;
    /** 操作标题 */
    title: string;
    /** 对应的编辑器命令名称 */
    command: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * 列表类型名称
 */
export type ListType = 'bulletList' | 'orderedList' | 'taskList';
/**
 * 列表工具配置接口
 */
export interface ListToolConfig {
    /** 列表类型名称 */
    name: ListType;
    /** 图标组件 */
    icon: Component;
    /** 工具标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * 对齐方式类型
 */
export type AlignValue = 'left' | 'center' | 'right' | 'justify';
/**
 * 对齐工具配置接口
 */
export interface AlignToolConfig {
    /** 对齐方式 */
    value: AlignValue;
    /** 图标组件 */
    icon: Component;
    /** 工具标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * 插入工具配置接口
 */
export interface InsertToolConfig {
    /** 插入内容类型 */
    name: 'link' | 'image' | 'table' | 'codeBlock';
    /** 图标组件 */
    icon: Component;
    /** 工具标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * AI 工具配置接口
 */
export interface AiToolConfig {
    /** AI 功能名称 */
    name: 'continueWriting' | 'polish' | 'summarize' | 'translate' | 'customAi';
    /** 图标组件 */
    icon: Component;
    /** 工具标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void;
}
/**
 * 下拉菜单项接口
 */
export interface MenuItemConfig {
    /** 菜单项 key */
    key: string;
    /** 菜单项标签 */
    label: string;
    /** 图标组件（可选） */
    icon?: Component;
    /** 点击时执行的操作 */
    action: () => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否为危险操作（红色） */
    danger?: boolean;
    /** 是否激活（用于显示激活状态） */
    active?: boolean;
    /** 子菜单项（可选） */
    children?: MenuItemConfig[];
}
/**
 * 菜单分组接口
 */
export interface MenuGroupConfig {
    /** 分组标题 */
    title: string;
    /** 分组内的菜单项 */
    items: MenuItemConfig[];
}
/**
 * 工具栏配置工厂函数类型
 */
export type ToolbarConfigFactory<T> = (editor: Editor) => T[];
/**
 * 编辑操作配置接口
 */
export interface EditActionConfig {
    /** 图标组件 */
    icon: Component;
    /** 操作标题 */
    title: string;
    /** 点击时执行的操作 */
    action: () => void | Promise<void>;
    /** 是否为危险操作 */
    danger?: boolean;
}
/**
 * 选择器选项接口
 */
export interface SelectOption<T = string> {
    /** 显示标签 */
    label: string;
    /** 选项值 */
    value: T;
}
/**
 * 工具栏分组配置接口
 */
export interface ToolbarGroupConfig {
    /** 分组名称 */
    name: string;
    /** 分组内的按钮配置 */
    buttons: ToolbarButtonConfig[];
    /** 是否显示分隔线 */
    showDivider?: boolean;
}
/**
 * 完整工具栏配置接口
 */
export interface FullToolbarConfig {
    /** 文本格式工具 */
    textFormats: ToolbarButtonConfig[];
    /** 标题工具 */
    headings: HeadingConfig[];
    /** 颜色工具 */
    colorTools: ColorToolConfig[];
    /** 列表工具 */
    listTools: ListToolConfig[];
    /** 对齐工具 */
    alignTools: AlignToolConfig[];
    /** 插入工具 */
    insertTools: InsertToolConfig[];
    /** 表格工具 */
    tableTools?: {
        rowTools: TableOperationConfig[];
        colTools: TableOperationConfig[];
        cellTools: TableOperationConfig[];
    };
    /** AI 工具 */
    aiTools: AiToolConfig[];
}
/**
 * 浮动菜单配置接口
 */
export interface BubbleMenuConfig {
    /** 是否显示菜单 */
    shouldShow: (props: {
        editor: Editor;
        from: number;
        to: number;
        state: any;
    }) => boolean;
    /** 菜单位置 */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Tippy.js 配置选项 */
    tippyOptions?: Record<string, any>;
}
/**
 * 命令参数类型映射
 */
export interface CommandParams {
    toggleBold: [];
    toggleItalic: [];
    toggleUnderline: [];
    toggleStrike: [];
    toggleSubscript: [];
    toggleSuperscript: [];
    toggleCode: [];
    setColor: [color: string];
    setHighlight: [options: {
        color: string;
    }];
    setFontFamily: [fontFamily: string];
    setFontSize: [fontSize: string];
    setTextAlign: [align: AlignValue];
    toggleHeading: [options: {
        level: number;
    }];
    setHeading: [options: {
        level: number;
    }];
    setParagraph: [];
    toggleBulletList: [];
    toggleOrderedList: [];
    toggleTaskList: [];
    insertTable: [options: {
        rows: number;
        cols: number;
        withHeaderRow?: boolean;
    }];
    addRowBefore: [];
    addRowAfter: [];
    deleteRow: [];
    addColumnBefore: [];
    addColumnAfter: [];
    deleteColumn: [];
    mergeCells: [];
    splitCell: [];
    toggleHeaderRow: [];
    toggleHeaderColumn: [];
    deleteTable: [];
    setLink: [options: {
        href: string;
    }];
    unsetLink: [];
    setCodeBlock: [options: {
        language: string;
    }];
    insertContent: [content: string | Record<string, any>];
    setCellAttribute: [name: string, value: any];
}
/**
 * 编辑器状态类型
 */
export interface EditorStateInfo {
    /** 是否可撤销 */
    canUndo: boolean;
    /** 是否可重做 */
    canRedo: boolean;
    /** 当前激活的标记 */
    activeMarks: string[];
    /** 当前激活的节点 */
    activeNodes: string[];
    /** 当前段落样式 */
    paragraphStyle: string;
    /** 当前文本对齐方式 */
    textAlign: string;
    /** 是否在表格中 */
    isInTable: boolean;
    /** 是否有选区 */
    hasSelection: boolean;
    /** 选区是否为空 */
    isEmptySelection: boolean;
}
/**
 * 文本颜色类型
 * @note 实际类型从 TEXT_COLORS 常量推导，见 editorConstants.ts
 */
export type TextColor = string;
/**
 * 背景颜色类型
 * @note 实际类型从 BACKGROUND_COLORS 常量推导，见 editorConstants.ts
 */
export type BackgroundColor = string;
/**
 * 字体系列类型
 * @note 实际类型从 FONT_FAMILIES 常量推导，见 editorConstants.ts
 */
export type FontFamily = string;
/**
 * 字号类型
 * @note 实际类型从 FONT_SIZES 常量推导，见 editorConstants.ts
 */
export type FontSize = string;
/**
 * 行间距类型
 * @note 实际类型从 LINE_HEIGHTS 常量推导，见 editorConstants.ts
 */
export type LineHeight = string;
/**
 * 代码语言类型
 * @note 实际类型从 CODE_LANGUAGES 常量推导，见 shared/configs/editorConstants.ts
 */
export type CodeLanguage = string;
/**
 * 表格边框样式类型
 * @note 实际类型从 TABLE_BORDER_STYLES 常量推导，见 editorConstants.ts
 */
export type TableBorderStyle = string;
//# sourceMappingURL=toolbar.d.ts.map
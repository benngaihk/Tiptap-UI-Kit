/**
 * Editor Constants
 * @description 编辑器常量配置（颜色、字体、字号等）
 */
/**
 * 文本颜色选项
 */
export declare const TEXT_COLORS: readonly ["#000000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff"];
/**
 * 背景颜色选项
 */
export declare const BACKGROUND_COLORS: readonly ["#ffffff", "#f5f5f5", "#e8f5e9", "#e3f2fd", "#fff3e0", "#fce4ec", "#f3e5f5", "#e0f2f1"];
/**
 * 表格单元格背景颜色选项
 */
export declare const TABLE_CELL_COLORS: readonly ["#ffffff", "#f5f5f5", "#e8f5e9", "#e3f2fd", "#fff3e0", "#fce4ec", "#f3e5f5", "#e0f2f1"];
/**
 * 字体系列选项
 */
export declare const FONT_FAMILIES: readonly [{
    readonly label: "PMingLiU";
    readonly value: "PMingLiU";
}, {
    readonly label: "Microsoft YaHei";
    readonly value: "Microsoft YaHei";
}, {
    readonly label: "SimSun";
    readonly value: "SimSun";
}, {
    readonly label: "SimHei";
    readonly value: "SimHei";
}, {
    readonly label: "Arial";
    readonly value: "Arial";
}, {
    readonly label: "Times New Roman";
    readonly value: "Times New Roman";
}, {
    readonly label: "Courier New";
    readonly value: "Courier New";
}, {
    readonly label: "Monospace";
    readonly value: "monospace";
}];
/**
 * 字号选项（中文印刷标准）
 */
export declare const FONT_SIZES: readonly [{
    readonly label: "12";
    readonly value: "12px";
}, {
    readonly label: "14";
    readonly value: "14px";
}, {
    readonly label: "16";
    readonly value: "16px";
}, {
    readonly label: "18";
    readonly value: "18px";
}, {
    readonly label: "20";
    readonly value: "20px";
}, {
    readonly label: "24";
    readonly value: "24px";
}, {
    readonly label: "28";
    readonly value: "28px";
}, {
    readonly label: "32";
    readonly value: "32px";
}];
/**
 * 行间距选项
 */
export declare const LINE_HEIGHTS: readonly [{
    readonly label: "1.0";
    readonly value: "1";
}, {
    readonly label: "1.5";
    readonly value: "1.5";
}, {
    readonly label: "2.0";
    readonly value: "2";
}, {
    readonly label: "2.5";
    readonly value: "2.5";
}, {
    readonly label: "3.0";
    readonly value: "3";
}];
/**
 * 段落样式选项
 */
export declare const HEADING_OPTIONS: readonly [{
    readonly label: "正文";
    readonly value: "paragraph";
}, {
    readonly label: "H1";
    readonly value: "h1";
}, {
    readonly label: "H2";
    readonly value: "h2";
}, {
    readonly label: "H3";
    readonly value: "h3";
}, {
    readonly label: "H4";
    readonly value: "h4";
}, {
    readonly label: "H5";
    readonly value: "h5";
}, {
    readonly label: "H6";
    readonly value: "h6";
}];
/**
 * 代码块语言选项
 */
export declare const CODE_LANGUAGES: readonly ["javascript", "typescript", "python", "java", "html", "css", "json", "bash", "sql", "php", "go", "rust", "c", "cpp", "csharp", "swift", "kotlin", "ruby", "markdown", "xml"];
/**
 * 对齐方式选项
 */
export declare const TEXT_ALIGN_OPTIONS: readonly [{
    readonly label: "左对齐";
    readonly value: "left";
}, {
    readonly label: "居中";
    readonly value: "center";
}, {
    readonly label: "右对齐";
    readonly value: "right";
}, {
    readonly label: "两端对齐";
    readonly value: "justify";
}];
/**
 * 表格边框样式选项
 */
export declare const TABLE_BORDER_STYLES: readonly [{
    readonly label: "默认边框";
    readonly value: "default";
}, {
    readonly label: "无边框";
    readonly value: "none";
}, {
    readonly label: "外边框";
    readonly value: "outer";
}];
/**
 * 默认配置值
 */
export declare const DEFAULT_VALUES: {
    /** 默认字体 */
    readonly fontFamily: "PMingLiU";
    /** 默认字号 */
    readonly fontSize: "16px";
    /** 默认行间距 */
    readonly lineHeight: "1.5";
    /** 默认文本颜色 */
    readonly textColor: "#000000";
    /** 默认背景颜色 */
    readonly backgroundColor: "#ffffff";
    /** 默认对齐方式 */
    readonly textAlign: "left";
    /** 默认代码语言 */
    readonly codeLanguage: "javascript";
};
/**
 * 编辑器限制
 */
export declare const EDITOR_LIMITS: {
    /** 最小缩放比例 */
    readonly minZoom: 50;
    /** 最大缩放比例 */
    readonly maxZoom: 200;
    /** 缩放步长 */
    readonly zoomStep: 10;
    /** 最大文档长度（字符数） */
    readonly maxDocumentLength: 1000000;
    /** 最大标题级别 */
    readonly maxHeadingLevel: 6;
};
/**
 * 快捷键配置
 */
export declare const KEYBOARD_SHORTCUTS: {
    readonly bold: "Mod-b";
    readonly italic: "Mod-i";
    readonly underline: "Mod-u";
    readonly strike: "Mod-Shift-s";
    readonly code: "Mod-e";
    readonly codeBlock: "Mod-Shift-e";
    readonly link: "Mod-k";
    readonly undo: "Mod-z";
    readonly redo: readonly ["Mod-Shift-z", "Mod-y"];
    readonly paragraph: "Mod-Alt-0";
    readonly heading1: "Mod-Alt-1";
    readonly heading2: "Mod-Alt-2";
    readonly heading3: "Mod-Alt-3";
    readonly bulletList: "Mod-Shift-8";
    readonly orderedList: "Mod-Shift-7";
    readonly taskList: "Mod-Shift-9";
};
/**
 * UI 配置
 */
export declare const UI_CONFIG: {
    /** 工具栏按钮尺寸 */
    readonly toolbarButtonSize: 28;
    /** 工具栏高度 */
    readonly toolbarHeight: 56;
    /** 工具栏间距 */
    readonly toolbarGap: 6;
    /** 颜色面板列数 */
    readonly colorPanelColumns: 8;
    /** 颜色面板色块大小 */
    readonly colorItemSize: 24;
    /** 浮动菜单偏移 */
    readonly bubbleMenuOffset: 8;
};
/**
 * @note 所有类型定义已统一迁移到 shared/configs/toolbar.ts
 * 如需使用类型，请从 shared/configs/toolbar 导入
 * 此文件仅保留常量配置，类型定义已移除
 */
//# sourceMappingURL=editorConstants.d.ts.map
/**
 * Editor Constants
 * @description 编辑器常量配置（颜色、字体、字号等）
 */

/**
 * 文本颜色选项
 */
export const TEXT_COLORS = [
  '#000000', // 黑色
  '#ff0000', // 红色
  '#ff9900', // 橙色
  '#ffff00', // 黄色
  '#00ff00', // 绿色
  '#00ffff', // 青色
  '#0000ff', // 蓝色
  '#9900ff', // 紫色
] as const

/**
 * 背景颜色选项
 */
export const BACKGROUND_COLORS = [
  '#ffffff', // 白色
  '#f5f5f5', // 浅灰
  '#e8f5e9', // 浅绿
  '#e3f2fd', // 浅蓝
  '#fff3e0', // 浅橙
  '#fce4ec', // 浅粉
  '#f3e5f5', // 浅紫
  '#e0f2f1', // 浅青
] as const

/**
 * 表格单元格背景颜色选项
 */
export const TABLE_CELL_COLORS = BACKGROUND_COLORS

/**
 * 字体系列选项
 */
export const FONT_FAMILIES = [
  { label: 'PMingLiU', value: 'PMingLiU' },
  { label: 'Microsoft YaHei', value: 'Microsoft YaHei' },
  { label: 'SimSun', value: 'SimSun' },
  { label: 'SimHei', value: 'SimHei' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Monospace', value: 'monospace' },
] as const

/**
 * 字号选项（中文印刷标准）
 */
export const FONT_SIZES = [
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '32', value: '32px' },
] as const

/**
 * 行间距选项
 */
export const LINE_HEIGHTS = [
  { label: '1.0', value: '1' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
] as const

/**
 * 段落样式选项
 */
export const HEADING_OPTIONS = [
  { label: '正文', value: 'paragraph' },
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'H5', value: 'h5' },
  { label: 'H6', value: 'h6' },
] as const

/**
 * 代码块语言选项
 */
export const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'html',
  'css',
  'json',
  'bash',
  'sql',
  'php',
  'go',
  'rust',
  'c',
  'cpp',
  'csharp',
  'swift',
  'kotlin',
  'ruby',
  'markdown',
  'xml',
] as const

/**
 * 对齐方式选项
 */
export const TEXT_ALIGN_OPTIONS = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
  { label: '两端对齐', value: 'justify' },
] as const

/**
 * 表格边框样式选项
 */
export const TABLE_BORDER_STYLES = [
  { label: '默认边框', value: 'default' },
  { label: '无边框', value: 'none' },
  { label: '外边框', value: 'outer' },
] as const

/**
 * 默认配置值
 */
export const DEFAULT_VALUES = {
  /** 默认字体 */
  fontFamily: 'PMingLiU',
  /** 默认字号 */
  fontSize: '16px',
  /** 默认行间距 */
  lineHeight: '1.5',
  /** 默认文本颜色 */
  textColor: '#000000',
  /** 默认背景颜色 */
  backgroundColor: '#ffffff',
  /** 默认对齐方式 */
  textAlign: 'left',
  /** 默认代码语言 */
  codeLanguage: 'javascript',
} as const

/**
 * 编辑器限制
 */
export const EDITOR_LIMITS = {
  /** 最小缩放比例 */
  minZoom: 50,
  /** 最大缩放比例 */
  maxZoom: 200,
  /** 缩放步长 */
  zoomStep: 10,
  /** 最大文档长度（字符数） */
  maxDocumentLength: 1000000,
  /** 最大标题级别 */
  maxHeadingLevel: 6,
} as const

/**
 * 快捷键配置
 */
export const KEYBOARD_SHORTCUTS = {
  bold: 'Mod-b',
  italic: 'Mod-i',
  underline: 'Mod-u',
  strike: 'Mod-Shift-s',
  code: 'Mod-e',
  codeBlock: 'Mod-Shift-e',
  link: 'Mod-k',
  undo: 'Mod-z',
  redo: ['Mod-Shift-z', 'Mod-y'],
  paragraph: 'Mod-Alt-0',
  heading1: 'Mod-Alt-1',
  heading2: 'Mod-Alt-2',
  heading3: 'Mod-Alt-3',
  bulletList: 'Mod-Shift-8',
  orderedList: 'Mod-Shift-7',
  taskList: 'Mod-Shift-9',
} as const

/**
 * UI 配置
 */
export const UI_CONFIG = {
  /** 工具栏按钮尺寸 */
  toolbarButtonSize: 28,
  /** 工具栏高度 */
  toolbarHeight: 56,
  /** 工具栏间距 */
  toolbarGap: 6,
  /** 颜色面板列数 */
  colorPanelColumns: 8,
  /** 颜色面板色块大小 */
  colorItemSize: 24,
  /** 浮动菜单偏移 */
  bubbleMenuOffset: 8,
} as const

/**
 * @note 所有类型定义已统一迁移到 shared/configs/toolbar.ts
 * 如需使用类型，请从 shared/configs/toolbar 导入
 * 此文件仅保留常量配置，类型定义已移除
 */


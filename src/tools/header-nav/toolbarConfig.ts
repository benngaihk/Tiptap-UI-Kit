/**
 * Toolbar Configuration - 工具栏配置类型
 * @description 定义工具栏工具的显示配置
 */

/**
 * 工具栏工具配置接口
 */
export interface ToolbarToolsConfig {
  /** 是否显示文本格式工具（粗体、斜体、下划线、删除线） */
  textFormat?: boolean
  /** 是否显示颜色选择器（文本颜色、背景颜色） */
  colorPicker?: boolean
  /** 是否显示标题下拉菜单 */
  heading?: boolean
  /** 是否显示列表工具（有序、无序、任务列表） */
  list?: boolean
  /** 是否显示对齐工具 */
  align?: boolean
  /** 是否显示图片上传工具 */
  image?: boolean
  /** 是否显示代码块工具 */
  codeBlock?: boolean
  /** 是否显示链接工具 */
  link?: boolean
  /** 是否显示表格工具 */
  table?: boolean
  /** 是否显示撤销/重做工具 */
  undoRedo?: boolean
  /** 是否禁用撤销/重做工具（协作模式下需要禁用） */
  undoRedoDisabled?: boolean
  /** 是否显示清除格式工具 */
  clearFormat?: boolean
  /** 是否显示字体工具 */
  font?: boolean
  /** 是否显示行距工具 */
  lineHeight?: boolean
  /** 是否显示下标/上标工具 */
  subscriptSuperscript?: boolean
  /** 是否显示格式刷工具 */
  formatPainter?: boolean
  /** 是否禁用格式刷工具（协作模式多人时需要禁用） */
  formatPainterDisabled?: boolean
  /** 是否显示 Word 导入/导出工具 */
  word?: boolean
  /** 是否显示模板插入工具 */
  template?: boolean
  /** 是否显示图库工具 */
  gallery?: boolean
  /** 是否显示AI工具 */
  ai?: boolean
}

/**
 * 默认工具栏配置（显示所有工具）
 */
export const DEFAULT_TOOLBAR_CONFIG: ToolbarToolsConfig = {
  textFormat: true,
  colorPicker: true,
  heading: true,
  list: true,
  align: true,
  image: true,
  codeBlock: false,
  link: false,
  table: false,
  undoRedo: false,
  clearFormat: false,
  font: false,
  lineHeight: false,
  subscriptSuperscript: false,
  formatPainter: false,
  ai: true,
}

/**
 * 基础版工具栏配置（只显示基础功能）
 */
export const BASIC_TOOLBAR_CONFIG: ToolbarToolsConfig = {
  textFormat: true,
  colorPicker: true,
  heading: true,
  list: true,
  align: true,
  image: true,
  codeBlock: false,
  link: false,
  table: false,
  undoRedo: false,
  clearFormat: false,
  font: false,
  lineHeight: false,
  subscriptSuperscript: false,
  formatPainter: false,
  ai: true,
}

/**
 * 进阶版工具栏配置（包含更多功能）
 */
export const ADVANCED_TOOLBAR_CONFIG: ToolbarToolsConfig = {
  textFormat: true,
  colorPicker: true,
  heading: true,
  list: true,
  align: true,
  image: true,
  codeBlock: true,
  link: true,
  table: true,
  undoRedo: true,
  clearFormat: true,
  font: true,
  lineHeight: true,
  subscriptSuperscript: true,
  formatPainter: true,
  word: true,
  template: true,
  gallery: true,
  ai: true,
}


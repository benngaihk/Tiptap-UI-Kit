/**
 * Font - 字体功能模块
 * @description 提供字体、字号、行高等字体相关功能
 */

// 组件导出
export { default as FontFamilySelect } from './FontFamilySelect.vue'
export { default as FontSizeSelect } from './FontSizeSelect.vue'

// 扩展导出（从 shared/extensions 重新导出，避免重复）
export { FontSize } from '@/extensions/fontSize'
export { LineHeight } from '@/extensions/lineHeight'

// 常量导出（从 shared/configs/editorConstants 重新导出，避免重复）
export {
  FONT_FAMILIES,
  FONT_SIZES,
  LINE_HEIGHTS,
  DEFAULT_VALUES,
} from '@/configs/editorConstants'


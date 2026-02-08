/**
 * Heading Components - 标题组件统一导出
 */
export { default as HeadingDropdown } from './HeadingDropdown.vue'
export { default as HeadingButtons } from './HeadingButtons.vue'

// 类型导出（向后兼容）
// 注意：所有标题相关的类型（HeadingLevel、HeadingValue、HeadingConfig）已统一迁移到 shared/configs/toolbar.ts
// 建议新代码直接从 shared/configs/toolbar 导入，以获得更好的类型一致性
export type { HeadingLevel, HeadingValue, HeadingConfig } from '@/configs/toolbar'


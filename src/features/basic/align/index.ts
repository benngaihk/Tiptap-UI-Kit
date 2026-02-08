/**
 * Align Components - 对齐组件统一导出
 */
export { default as AlignDropdown } from './AlignDropdown.vue'

// 类型导出（向后兼容）
// 注意：所有对齐相关的类型（AlignValue、AlignToolConfig）已统一迁移到 shared/configs/toolbar.ts
// 建议新代码直接从 shared/configs/toolbar 导入，以获得更好的类型一致性
export type { AlignValue } from '@/configs/toolbar'


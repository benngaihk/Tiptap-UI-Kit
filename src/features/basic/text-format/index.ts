/**
 * Text Format Components - 文本格式组件统一导出
 */
export { default as TextFormatButtons } from './TextFormatButtons.vue'

// 类型导出（向后兼容）
// 注意：所有文本格式相关的类型（TextFormatType、TextFormatConfig）已统一迁移到 shared/configs/toolbar.ts
// 建议新代码直接从 shared/configs/toolbar 导入，以获得更好的类型一致性
export type { TextFormatType, TextFormatConfig } from '@/configs/toolbar'


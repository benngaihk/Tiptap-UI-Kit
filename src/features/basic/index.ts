/**
 * Basic Components - 基础版组件统一导出
 * @description 基础版功能模块的统一导出入口
 */

// 功能组件
export * from './text-format'
export * from './list'
export * from './color'
export * from './heading'
export * from './align'
export * from './image'

// 注意：
// - BasicToolbar 已迁移到 tools/header-nav/ToolbarNav.vue
// - 如需使用工具栏，请从 tools/header-nav 导入：
//   import { ToolbarNav, BASIC_TOOLBAR_CONFIG } from '@/tools/header-nav'
// - 扩展配置已迁移到 shared/extensions/coreExtensions.ts
//   如需使用扩展，请直接从 shared/extensions/coreExtensions 导入：
//   import { getExtensionsByVersion, getBasicExtensions } from '@/extensions/coreExtensions'


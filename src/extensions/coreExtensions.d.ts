/**
 * Core Extensions - 核心扩展配置
 * @description 根据版本动态加载编辑器扩展
 */
/**
 * 编辑器版本类型
 */
export type EditorVersion = 'basic' | 'advanced' | 'premium' | 'all' | 1 | 2 | 3 | 4;
/**
 * 扩展配置选项
 */
export interface ExtensionsOptions {
    /** 是否启用图片增强功能（拖拽大小调整），默认 true */
    enableImageResize?: boolean;
    /** 是否禁用历史记录扩展（协作模式下需要禁用），默认 false */
    disableHistory?: boolean;
}
/**
 * 根据版本获取扩展配置
 * @param _version 编辑器版本（目前所有版本使用相同扩展，后续可根据版本区分）
 * @param optionsOrEnableImageResize 配置选项或是否启用图片增强功能（兼容旧 API）
 * @returns 扩展配置数组
 */
export declare function getExtensionsByVersion(_version?: EditorVersion, optionsOrEnableImageResize?: boolean | ExtensionsOptions): any[];
/**
 * 获取基础版扩展配置
 * @description 为了保持向后兼容，此函数内部调用 getExtensionsByVersion('basic')
 * @deprecated 建议直接使用 getExtensionsByVersion('basic') 或 getExtensionsByVersion(2)
 */
export declare function getBasicExtensions(): any[];
//# sourceMappingURL=coreExtensions.d.ts.map
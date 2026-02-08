/**
 * ResizableImage Extension - 可调整大小的图片扩展（支持拖拽移动）
 * @description 扩展标准 Image 扩展，支持 width、height 属性用于调整图片大小，并添加可拖拽的调整手柄
 * @features
 * - 支持图片在文字之间拖拽移动（独立实现，不依赖 drag-handle）
 * - 支持图片大小调整（等比例缩放）
 * - 支持图片对齐（左对齐、居中、右对齐）
 */
export interface ResizableImageOptions {
    HTMLAttributes?: Record<string, any>;
    inline?: boolean;
    allowBase64?: boolean;
    /** 是否启用图片增强功能（拖拽大小调整），默认 true */
    enableResize?: boolean;
}
export declare const ResizableImage: import("@tiptap/core").Node<ResizableImageOptions, any>;
//# sourceMappingURL=ResizableImage.d.ts.map
/**
 * FormatPainter Extension - 格式刷
 * @description 采样当前选区样式并应用到目标选区
 */
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        formatPainter: {
            /**
             * 开启格式刷并采样当前选区样式
             * @param mode - 模式：1 为单次模式（默认），2 为连续模式
             */
            startFormatPainting: (mode?: 1 | 2) => ReturnType;
            /** 开启格式刷连续应用模式 */
            startContinuousFormatPainting: () => ReturnType;
            /** 将采样到的样式应用到当前选区 */
            applyFormat: () => ReturnType;
            /** 取消格式刷状态并清除缓存 */
            cancelFormatPainting: () => ReturnType;
            /** 切换连续应用模式 */
            toggleContinuousMode: () => ReturnType;
        };
    }
}
export interface FormatPainterStorage {
    /** 格式刷是否激活 */
    isActive: boolean;
    /** 是否为连续应用模式 */
    isContinuous: boolean;
    /** 采样的格式 */
    formats: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strike?: boolean;
        subscript?: boolean;
        superscript?: boolean;
        color?: string | null;
        highlight?: string | null;
        fontFamily?: string | null;
        fontSize?: string | null;
        textAlign?: 'left' | 'center' | 'right' | 'justify' | null;
        lineHeight?: string | null;
    };
}
export type FormatPainterFormats = FormatPainterStorage['formats'];
/**
 * 采样当前选区的格式样式
 * @param editor - Tiptap 编辑器实例
 * @returns 格式对象，如果采样失败则返回 null
 * @description 从编辑器中提取当前选区的所有格式信息，包括文本样式、颜色、对齐等
 */
export declare function sampleFormats(editor: Editor): FormatPainterFormats | null;
export declare const FormatPainter: Extension<{}, FormatPainterStorage>;
//# sourceMappingURL=formatPainter.d.ts.map
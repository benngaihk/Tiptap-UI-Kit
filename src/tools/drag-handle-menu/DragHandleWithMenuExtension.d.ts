/**
 * DragHandleWithMenu Extension - 六个点显示扩展
 * @description 为块级元素添加可点击的拖拽手柄（六个点）
 * @features
 * - 在块级元素左侧显示六个点图标
 * - 点击六个点触发菜单显示
 * - 自动排除表格、图片等特殊节点
 * - 智能处理列表嵌套情况
 */
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
export declare const dragHandleWithMenuKey: PluginKey<any>;
export interface DragHandleClickEvent {
    position: {
        x: number;
        y: number;
    };
    nodePos: number;
    nodeTo: number;
    handleElement: HTMLElement;
}
export interface DragHandleWithMenuOptions {
    onHandleClick?: (event: DragHandleClickEvent) => void;
}
export declare const DragHandleWithMenuExtension: Extension<DragHandleWithMenuOptions, any>;
//# sourceMappingURL=DragHandleWithMenuExtension.d.ts.map
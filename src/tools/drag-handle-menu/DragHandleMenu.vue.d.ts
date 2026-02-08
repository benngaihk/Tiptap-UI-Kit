import type { Editor } from '@tiptap/core';
import type { DragHandleClickEvent } from './DragHandleWithMenuExtension';
import '@/styles/drag-handle-with-menu.css';
type __VLS_Props = {
    editor: Editor | null | undefined;
    readonly?: boolean;
    positionStrategy?: 'auto' | 'right' | 'left';
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    handleDragHandleClick: (event: DragHandleClickEvent) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    readonly: boolean;
    positionStrategy: "auto" | "right" | "left";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=DragHandleMenu.vue.d.ts.map
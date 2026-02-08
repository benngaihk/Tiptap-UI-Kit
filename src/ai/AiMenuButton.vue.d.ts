import type { Component } from 'vue';
import type { Editor } from '@tiptap/core';
interface Props {
    editor: Editor;
    icon?: Component;
    label?: string;
    title?: string;
    active?: boolean;
    placement?: 'top' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    active: boolean;
    placement: "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=AiMenuButton.vue.d.ts.map
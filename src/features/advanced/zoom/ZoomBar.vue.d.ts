import type { Editor } from '@tiptap/vue-3';
import '@/styles/zoom-toolbar.css';
type __VLS_Props = {
    zoomLevel: number;
    totalPages: number;
    editor?: Editor | null;
    showCharCount?: boolean;
    min?: number;
    max?: number;
    step?: number;
    placement?: 'bottom' | 'belowToolbar';
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    reset: (value: number) => any;
    change: (value: number) => any;
    "update:zoomLevel": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onReset?: ((value: number) => any) | undefined;
    onChange?: ((value: number) => any) | undefined;
    "onUpdate:zoomLevel"?: ((value: number) => any) | undefined;
}>, {
    placement: "bottom" | "belowToolbar";
    showCharCount: boolean;
    min: number;
    max: number;
    step: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=ZoomBar.vue.d.ts.map
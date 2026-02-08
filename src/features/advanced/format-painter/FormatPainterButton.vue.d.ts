import type { Editor } from '@tiptap/vue-3';
interface Props {
    editor: Editor | null | undefined;
    /** 外部传入的禁用状态（优先级高于内部协作检测） */
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=FormatPainterButton.vue.d.ts.map
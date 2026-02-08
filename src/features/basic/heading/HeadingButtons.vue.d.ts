import type { Editor } from '@tiptap/vue-3';
import type { HeadingLevel } from '@/configs/toolbar';
interface Props {
    editor: Editor | null | undefined;
    /** 显示的标题级别，默认 [1, 2, 3] */
    levels?: HeadingLevel[];
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    levels: HeadingLevel[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=HeadingButtons.vue.d.ts.map
import type { Editor } from '@tiptap/vue-3';
interface Props {
    editor: Editor | null | undefined;
    /** 图片上传函数（可选） */
    uploadImage?: (file: File) => Promise<string>;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    uploadImage: (file: File) => Promise<string>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=ImageUpload.vue.d.ts.map
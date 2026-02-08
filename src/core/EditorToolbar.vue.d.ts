import type { Editor } from '@tiptap/vue-3';
import type { ToolbarConfig } from './toolbarConfig';
import type { AiAdapter } from '@/ai';
interface Props {
    editor: Editor | null;
    config: ToolbarConfig;
    aiAdapter?: AiAdapter;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=EditorToolbar.vue.d.ts.map
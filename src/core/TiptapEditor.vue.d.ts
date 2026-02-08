import { Editor } from '@tiptap/vue-3';
import { type ToolbarConfig } from './toolbarConfig';
import type { AiAdapter } from '@/ai';
import '@/styles/index.css';
export interface TiptapEditorProps {
    /** Initial HTML content */
    initialContent?: string;
    /** Read-only mode */
    readonly?: boolean;
    /** Preview mode (no toolbar, no footer) */
    previewMode?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Language locale */
    locale?: string;
    /** Word processing mode (A4 paper style) */
    wordMode?: boolean;
    /** Theme: 'light' | 'dark' */
    theme?: 'light' | 'dark';
    /** Toolbar configuration */
    toolbar?: ToolbarConfig;
    /** AI adapter (required for AI features) */
    aiAdapter?: AiAdapter;
}
declare const _default: import("vue").DefineComponent<TiptapEditorProps, {
    getEditor: () => Editor | null;
    getJSON: () => import("@tiptap/core").DocumentType<Record<string, any> | undefined, import("@tiptap/core").NodeType<string, Record<string, any> | undefined, any, (import("@tiptap/core").NodeType<any, any, any, any> | import("@tiptap/core").TextType<import("@tiptap/core").MarkType<any, any>>)[]>[]> | null;
    getHTML: () => string;
    getText: () => string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    update: (content: any) => any;
    ready: (editor: Editor) => any;
}, string, import("vue").PublicProps, Readonly<TiptapEditorProps> & Readonly<{
    onUpdate?: ((content: any) => any) | undefined;
    onReady?: ((editor: Editor) => any) | undefined;
}>, {
    placeholder: string;
    locale: string;
    readonly: boolean;
    initialContent: string;
    previewMode: boolean;
    theme: "light" | "dark";
    wordMode: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=TiptapEditor.vue.d.ts.map
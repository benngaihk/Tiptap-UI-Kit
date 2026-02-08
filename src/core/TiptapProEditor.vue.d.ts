import { Editor } from '@tiptap/vue-3';
import type { TiptapProEditorProps } from './editorTypes';
import '@/styles/base.css';
import '@/styles/word-mode.css';
import '@/styles/toolbar.css';
import '@/styles/image-toolbar.css';
import '@/styles/floating-menu-toolbar.css';
import '@/styles/drag-handle-with-menu.css';
import '@/styles/image-resize.css';
import '@/styles/collaboration.css';
declare const _default: import("vue").DefineComponent<TiptapProEditorProps, {
    getEditor: () => Editor | null;
    getJSON: () => import("@tiptap/core").DocumentType<Record<string, any> | undefined, import("@tiptap/core").NodeType<string, Record<string, any> | undefined, any, (import("@tiptap/core").NodeType<any, any, any, any> | import("@tiptap/core").TextType<import("@tiptap/core").MarkType<any, any>>)[]>[]> | null;
    getHTML: () => string;
    getText: () => string;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    update: (content: any) => any;
    collaboratorsChange: (count: number) => any;
    collaboratorsListChange: (users: {
        id: string | number;
        name: string;
        color: string;
    }[]) => any;
}, string, import("vue").PublicProps, Readonly<TiptapProEditorProps> & Readonly<{
    onUpdate?: ((content: any) => any) | undefined;
    onCollaboratorsChange?: ((count: number) => any) | undefined;
    onCollaboratorsListChange?: ((users: {
        id: string | number;
        name: string;
        color: string;
    }[]) => any) | undefined;
}>, {
    readonly: boolean;
    version: import("./editorTypes").EditorVersion;
    initialContent: string | object;
    zoomBarPlacement: "bottom" | "belowToolbar";
    previewMode: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=TiptapProEditor.vue.d.ts.map
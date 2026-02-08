import type { Editor } from '@tiptap/vue-3';
import type { ToolbarToolsConfig } from './toolbarConfig';
interface Props {
    /** 编辑器实例 */
    editor: Editor | null | undefined;
    /** 工具栏配置，控制显示哪些工具 */
    config?: ToolbarToolsConfig;
    /** 是否启用工具栏，默认为 true */
    enabled?: boolean;
}
declare var __VLS_77: {}, __VLS_79: {};
type __VLS_Slots = {} & {
    extra?: (props: typeof __VLS_77) => any;
} & {
    right?: (props: typeof __VLS_79) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    enabled: boolean;
    config: ToolbarToolsConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=ToolbarNav.vue.d.ts.map
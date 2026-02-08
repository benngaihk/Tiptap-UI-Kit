import type { Component } from 'vue';
interface Props {
    icon?: Component;
    title: string;
    active?: boolean;
    disabled?: boolean;
    danger?: boolean;
    size?: 'small' | 'medium' | 'large';
}
declare var __VLS_6: {}, __VLS_12: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_6) => any;
} & {
    default?: (props: typeof __VLS_12) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: () => any;
    dblclick: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: (() => any) | undefined;
    onDblclick?: (() => any) | undefined;
}>, {
    active: boolean;
    disabled: boolean;
    danger: boolean;
    size: "small" | "medium" | "large";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=ToolbarButton.vue.d.ts.map
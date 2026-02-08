interface Props {
    modelValue?: string;
    type?: 'text' | 'background';
    title?: string;
}
declare var __VLS_4: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_4) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (value: string) => any;
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    title: string;
    type: "text" | "background";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=ColorPicker.vue.d.ts.map
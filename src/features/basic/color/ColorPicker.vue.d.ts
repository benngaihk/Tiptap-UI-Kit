import type { Component } from 'vue';
/**
 * 组件 Props 接口定义
 */
interface Props {
    /** 颜色网格列数，默认 5 列 */
    columns?: number;
    /** 每个颜色块的大小（px），默认 20px */
    itemSize?: number;
    /** 当前选中的颜色值（v-model） */
    modelValue?: string;
    /** 颜色块之间的间距（px），默认 8px */
    gap?: number;
    /** 按钮图标组件（可选） */
    icon?: Component;
    /** 颜色类型：'text' 文字颜色 | 'background' 背景颜色 */
    type?: 'text' | 'background';
    /** 按钮标题（tooltip 显示文本，可选，默认根据 type 自动生成） */
    title?: string;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (value: string) => any;
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    icon: Component;
    title: string;
    type: "text" | "background";
    gap: number;
    columns: number;
    itemSize: number;
    modelValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=ColorPicker.vue.d.ts.map
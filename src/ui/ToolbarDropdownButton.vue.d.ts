import type { Component } from 'vue';
import type { MenuItemConfig } from '@/configs/toolbar';
interface Props {
    icon?: Component;
    label?: string;
    title?: string;
    active?: boolean;
    items: MenuItemConfig[];
    placement?: 'top' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (key: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: ((key: string) => any) | undefined;
}>, {
    active: boolean;
    placement: "top" | "bottom" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=ToolbarDropdownButton.vue.d.ts.map
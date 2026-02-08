import type { CollaboratorInfo } from './types';
interface Props {
    /** 是否启用协作功能（v-model 绑定，默认 false） */
    modelValue?: boolean;
    /** 是否显示标签 */
    showLabel?: boolean;
    /** 在线用户数（已废弃，使用 collaboratorsList） */
    collaboratorsCount?: number;
    /** 在线用户列表 */
    collaboratorsList?: CollaboratorInfo[];
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    change: (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onChange?: ((value: boolean) => any) | undefined;
}>, {
    modelValue: boolean;
    showLabel: boolean;
    collaboratorsCount: number;
    collaboratorsList: CollaboratorInfo[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=CollaborationToggle.vue.d.ts.map
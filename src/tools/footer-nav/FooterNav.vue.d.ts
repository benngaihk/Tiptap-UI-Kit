import type { Editor } from '@tiptap/vue-3';
import './footer-nav.css';
interface Props {
    /** 当前缩放比例（双向绑定） */
    zoomLevel: number;
    /** 文档总页数 */
    totalPages: number;
    /** Tiptap 编辑器实例 */
    editor?: Editor | null;
    /** 是否显示字数统计 */
    showCharCount?: boolean;
    /** 最小缩放比例 */
    min?: number;
    /** 最大缩放比例 */
    max?: number;
    /** 缩放步长 */
    step?: number;
    /** 是否启用底部导航，默认为 true */
    enabled?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    reset: (value: number) => any;
    change: (value: number) => any;
    "update:zoomLevel": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onReset?: ((value: number) => any) | undefined;
    onChange?: ((value: number) => any) | undefined;
    "onUpdate:zoomLevel"?: ((value: number) => any) | undefined;
}>, {
    enabled: boolean;
    showCharCount: boolean;
    min: number;
    max: number;
    step: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=FooterNav.vue.d.ts.map
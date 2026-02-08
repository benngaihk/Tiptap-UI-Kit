import '@/styles/base.css';
import '@/styles/word-mode.css';
import './preview-mode.css';
interface Props {
    /** HTML 内容 */
    content?: string;
    /** JSON 内容（优先级低于 content） */
    jsonContent?: any;
    /** 是否显示边框 */
    bordered?: boolean;
    /** 缩放比例（百分比，默认 100） */
    zoomLevel?: number;
    /** 最大宽度（默认 100%） */
    maxWidth?: string;
    /** 背景颜色 */
    backgroundColor?: string;
}
declare const _default: import("vue").DefineComponent<Props, {
    /** 获取预览容器元素 */
    getContainer: () => HTMLElement | null;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    backgroundColor: string;
    content: string;
    bordered: boolean;
    zoomLevel: number;
    maxWidth: string;
    jsonContent: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=PreviewMode.vue.d.ts.map
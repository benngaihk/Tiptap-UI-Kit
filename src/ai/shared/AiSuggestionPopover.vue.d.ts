export interface AiSuggestionPopoverProps {
    visible: boolean;
    originalText: string;
    suggestedText: string;
    isStreaming: boolean;
    position?: {
        top: number;
        left: number;
    };
    editorElement?: HTMLElement;
}
declare const _default: import("vue").DefineComponent<AiSuggestionPopoverProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    accept: () => any;
    reject: () => any;
    cancel: () => any;
    "update:visible": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<AiSuggestionPopoverProps> & Readonly<{
    onAccept?: (() => any) | undefined;
    onReject?: (() => any) | undefined;
    onCancel?: (() => any) | undefined;
    "onUpdate:visible"?: ((value: boolean) => any) | undefined;
}>, {
    visible: boolean;
    originalText: string;
    suggestedText: string;
    isStreaming: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=AiSuggestionPopover.vue.d.ts.map
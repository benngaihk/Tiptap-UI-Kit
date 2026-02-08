export interface CustomAiPopoverProps {
    visible: boolean;
    originalText: string;
    suggestedText: string;
    isStreaming: boolean;
    isExecuting: boolean;
    position?: {
        top: number;
        left: number;
    };
    editorElement?: HTMLElement;
}
declare const _default: import("vue").DefineComponent<CustomAiPopoverProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    accept: () => any;
    reject: () => any;
    cancel: () => any;
    "update:visible": (value: boolean) => any;
    execute: (prompt: string) => any;
    cancelGeneration: () => any;
}, string, import("vue").PublicProps, Readonly<CustomAiPopoverProps> & Readonly<{
    onAccept?: (() => any) | undefined;
    onReject?: (() => any) | undefined;
    onCancel?: (() => any) | undefined;
    "onUpdate:visible"?: ((value: boolean) => any) | undefined;
    onExecute?: ((prompt: string) => any) | undefined;
    onCancelGeneration?: (() => any) | undefined;
}>, {
    visible: boolean;
    originalText: string;
    suggestedText: string;
    isStreaming: boolean;
    isExecuting: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=CustomAiPopover.vue.d.ts.map
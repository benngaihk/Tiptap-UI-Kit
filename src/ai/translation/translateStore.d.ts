declare const STORAGE_KEY = "tiptap_translate_target_lang";
export declare const currentTranslateLang: import("vue").Ref<string, string>;
/**
 * 设置语言并持久化到 localStorage
 * @param label 语言标签（如 "英文"、"中文" 等）
 */
export declare function setTranslateLang(label: string): void;
/**
 * 清除已保存的语言选择
 */
export declare function clearTranslateLang(): void;
export { STORAGE_KEY };
//# sourceMappingURL=translateStore.d.ts.map
/**
 * i18n Manager
 * Standalone internationalization system (no external deps)
 */
export type LocaleCode = 'zh-CN' | 'zh-TW' | 'en-US';
export type LocaleMessages = Record<string, string | Record<string, string>>;
/**
 * Translate a key
 */
export declare function t(key: string): string;
/**
 * Create i18n instance
 */
export declare function createI18n(options?: {
    locale?: LocaleCode;
    fallbackLocale?: LocaleCode;
    messages?: Record<string, LocaleMessages>;
}): void;
/**
 * Use i18n composable
 */
export declare function useI18n(): {
    t: typeof t;
    locale: import("vue").ComputedRef<LocaleCode>;
    setLocale: (locale: LocaleCode) => void;
    availableLocales: LocaleCode[];
};
//# sourceMappingURL=manager.d.ts.map
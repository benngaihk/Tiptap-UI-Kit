/**
 * Preferences Adapter
 * Replaces @vben/preferences
 */
type Theme = 'light' | 'dark';
/**
 * Use preferences (compatible with @vben/preferences)
 */
export declare function usePreferences(): {
    theme: Readonly<import("vue").Ref<Theme, Theme>>;
    isDark: Readonly<import("vue").Ref<boolean, boolean>>;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
};
/**
 * Initialize theme from system preferences
 */
export declare function initTheme(): void;
export {};
//# sourceMappingURL=preferences.d.ts.map
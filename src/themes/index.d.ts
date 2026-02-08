/**
 * Theme Manager
 * API for theme switching and customization
 */
import type { ThemeMode, ThemePreset } from '@/core/editorConfig';
/**
 * Set theme
 */
export declare function setTheme(preset: ThemePreset, mode?: ThemeMode): void;
/**
 * Get current theme
 */
export declare function getTheme(): {
    preset: ThemePreset;
    mode: ThemeMode;
};
/**
 * Toggle between light and dark mode
 */
export declare function toggleThemeMode(): ThemeMode;
/**
 * Register custom theme
 */
export declare function registerTheme(name: string, variables: Record<string, string>): void;
/**
 * Apply custom theme variables
 */
export declare function applyCustomTheme(variables: Record<string, string>): void;
/**
 * Watch system theme changes
 */
export declare function watchSystemTheme(callback: (mode: 'light' | 'dark') => void): () => void;
/** Export all presets for import */
export declare const THEME_PRESETS: readonly ["default", "notion", "github", "typora", "word"];
//# sourceMappingURL=index.d.ts.map
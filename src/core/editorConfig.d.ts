/**
 * Editor Configuration Types
 * Pluggable feature system
 */
/** Theme mode */
export type ThemeMode = 'light' | 'dark' | 'auto';
/** Theme preset */
export type ThemePreset = 'default' | 'notion' | 'typora' | 'word' | 'github' | 'custom';
/** Feature flags */
export interface FeatureFlags {
    heading?: boolean;
    textFormat?: boolean;
    list?: boolean;
    align?: boolean;
    color?: boolean;
    image?: boolean;
    font?: boolean;
    link?: boolean;
    table?: boolean;
    codeBlock?: boolean;
    undoRedo?: boolean;
    formatPainter?: boolean;
    zoom?: boolean;
    subscriptSuperscript?: boolean;
    clearFormat?: boolean;
    headerNav?: boolean;
    footerNav?: boolean;
    dragHandleMenu?: boolean;
    floatingMenu?: boolean;
    linkBubbleMenu?: boolean;
    tableToolbar?: boolean;
    imageToolbar?: boolean;
    ai?: boolean;
}
/** AI configuration */
export interface AiConfig {
    provider: 'openai' | 'aliyun' | 'ollama' | 'deepseek';
    apiKey: string;
    model?: string;
    baseUrl?: string;
}
/** Editor configuration */
export interface EditorConfig {
    /** Theme mode (light/dark/auto) */
    theme?: ThemeMode;
    /** Theme preset */
    themePreset?: ThemePreset;
    /** Custom theme CSS variables */
    customTheme?: Record<string, string>;
    /** Feature flags */
    features?: FeatureFlags;
    /** AI configuration */
    aiConfig?: AiConfig;
    /** Locale */
    locale?: 'zh-CN' | 'zh-TW' | 'en-US';
    /** Readonly mode */
    readonly?: boolean;
    /** Preview mode (no toolbar) */
    previewMode?: boolean;
    /** Initial content */
    initialContent?: string;
    /** Placeholder */
    placeholder?: string;
    /** License key */
    licenseKey?: string;
}
/** Preset configurations */
export declare const PRESET_CONFIGS: {
    /** 最小配置 */
    readonly minimal: {
        features: {
            textFormat: true;
            list: true;
            undoRedo: true;
        };
    };
    /** 基础配置 */
    readonly basic: {
        features: {
            heading: true;
            textFormat: true;
            list: true;
            align: true;
            link: true;
            undoRedo: true;
            headerNav: true;
        };
    };
    /** 高级配置 */
    readonly advanced: {
        features: {
            heading: true;
            textFormat: true;
            list: true;
            align: true;
            color: true;
            image: true;
            font: true;
            link: true;
            table: true;
            codeBlock: true;
            undoRedo: true;
            formatPainter: true;
            zoom: true;
            headerNav: true;
            footerNav: true;
            dragHandleMenu: true;
            linkBubbleMenu: true;
            tableToolbar: true;
            imageToolbar: true;
        };
    };
    /** 完整配置（含 AI） */
    readonly full: {
        features: {
            heading: true;
            textFormat: true;
            list: true;
            align: true;
            color: true;
            image: true;
            font: true;
            link: true;
            table: true;
            codeBlock: true;
            undoRedo: true;
            formatPainter: true;
            zoom: true;
            subscriptSuperscript: true;
            clearFormat: true;
            headerNav: true;
            footerNav: true;
            dragHandleMenu: true;
            floatingMenu: true;
            linkBubbleMenu: true;
            tableToolbar: true;
            imageToolbar: true;
            ai: true;
        };
    };
};
export type PresetName = keyof typeof PRESET_CONFIGS;
/** 合并配置 */
export declare function mergeConfig(preset: PresetName | Partial<EditorConfig>, overrides?: Partial<EditorConfig>): EditorConfig;
//# sourceMappingURL=editorConfig.d.ts.map
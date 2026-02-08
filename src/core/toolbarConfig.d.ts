/**
 * Toolbar Configuration Types
 * Pluggable toolbar system
 */
/** Available toolbar features */
export type ToolbarFeature = 'undoRedo' | 'heading' | 'textFormat' | 'list' | 'align' | 'block' | 'fontSize' | 'fontFamily' | 'lineHeight' | 'textColor' | 'backgroundColor' | 'link' | 'codeBlock' | 'subSup' | 'formatClear' | 'ai';
/** Toolbar configuration */
export interface ToolbarConfig {
    /** Features to show in toolbar */
    features: ToolbarFeature[];
    /** Show dividers between groups */
    dividers?: boolean;
}
/** Default toolbar config */
export declare const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig;
/** Full toolbar config (all features) */
export declare const FULL_TOOLBAR_CONFIG: ToolbarConfig;
/** Minimal toolbar config */
export declare const MINIMAL_TOOLBAR_CONFIG: ToolbarConfig;
//# sourceMappingURL=toolbarConfig.d.ts.map
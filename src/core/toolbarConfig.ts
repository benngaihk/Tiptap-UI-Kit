/**
 * Toolbar Configuration Types
 * Pluggable toolbar system
 */

/** Available toolbar features */
export type ToolbarFeature =
  | 'undoRedo'
  | 'heading'
  | 'textFormat'
  | 'list'
  | 'align'
  | 'block'
  | 'fontSize'
  | 'fontFamily'
  | 'lineHeight'
  | 'textColor'
  | 'backgroundColor'
  | 'link'
  | 'codeBlock'
  | 'math'
  | 'subSup'
  | 'formatClear'
  | 'ai'

/** Toolbar configuration */
export interface ToolbarConfig {
  /** Features to show in toolbar */
  features: ToolbarFeature[]
  /** Show dividers between groups */
  dividers?: boolean
}

/** Default toolbar config */
export const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig = {
  features: [
    'undoRedo',
    'heading',
    'textFormat',
    'list',
    'align',
    'block',
    'link',
    'formatClear',
  ],
  dividers: true,
}

/** Full toolbar config (all features) */
export const FULL_TOOLBAR_CONFIG: ToolbarConfig = {
  features: [
    'undoRedo',
    'heading',
    'fontSize',
    'fontFamily',
    'textFormat',
    'textColor',
    'backgroundColor',
    'list',
    'align',
    'block',
    'link',
    'codeBlock',
    'math',
    'subSup',
    'formatClear',
    'ai',
  ],
  dividers: true,
}

/** Minimal toolbar config */
export const MINIMAL_TOOLBAR_CONFIG: ToolbarConfig = {
  features: ['undoRedo', 'textFormat', 'list'],
  dividers: false,
}

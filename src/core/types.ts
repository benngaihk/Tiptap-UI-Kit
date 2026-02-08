/**
 * Editor Types
 */

import type { Editor } from '@tiptap/vue-3'

/** Editor version/tier */
export type EditorVersion = 'basic' | 'advanced' | 'premium'

/** Feature configuration */
export interface FeatureConfig {
  // Basic features
  heading?: boolean
  textFormat?: boolean
  list?: boolean
  align?: boolean
  color?: boolean
  image?: boolean
  
  // Advanced features
  font?: boolean
  link?: boolean
  table?: boolean
  codeBlock?: boolean
  formatPainter?: boolean
  undoRedo?: boolean
  
  // Tools
  headerNav?: boolean
  footerNav?: boolean
  floatingMenu?: boolean
  dragHandleMenu?: boolean
  tableToolbar?: boolean
  imageToolbar?: boolean
  linkBubbleMenu?: boolean
}

/** Tiptap Editor Props */
export interface TiptapEditorProps {
  /** Initial HTML or JSON content */
  initialContent?: string | Record<string, any>
  
  /** Read-only mode */
  readonly?: boolean
  
  /** Preview mode (hides toolbars) */
  previewMode?: boolean
  
  /** Editor version tier */
  version?: EditorVersion
  
  /** Feature toggles */
  features?: FeatureConfig
  
  /** Placeholder text */
  placeholder?: string
  
  /** Locale */
  locale?: 'zh-CN' | 'zh-TW' | 'en-US'
}

/** Editor exposed methods */
export interface TiptapEditorExpose {
  getEditor: () => Editor | null
  getJSON: () => Record<string, any> | null
  getHTML: () => string
  getText: () => string
}

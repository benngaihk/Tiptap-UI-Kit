/**
 * Editor Configuration Types
 * Pluggable feature system
 */

/** Theme mode */
export type ThemeMode = 'light' | 'dark' | 'auto'

/** Theme preset */
export type ThemePreset = 'default' | 'notion' | 'typora' | 'word' | 'github' | 'custom'

/** Feature flags */
export interface FeatureFlags {
  // 基础功能
  heading?: boolean
  textFormat?: boolean
  list?: boolean
  align?: boolean
  color?: boolean
  image?: boolean
  
  // 高级功能
  font?: boolean
  link?: boolean
  table?: boolean
  codeBlock?: boolean
  undoRedo?: boolean
  formatPainter?: boolean
  zoom?: boolean
  subscriptSuperscript?: boolean
  clearFormat?: boolean
  
  // 工具
  headerNav?: boolean
  footerNav?: boolean
  dragHandleMenu?: boolean
  floatingMenu?: boolean
  linkBubbleMenu?: boolean
  tableToolbar?: boolean
  imageToolbar?: boolean
  
  // AI
  ai?: boolean
}

/** AI configuration */
export interface AiConfig {
  provider: 'openai' | 'aliyun' | 'ollama' | 'deepseek'
  apiKey: string
  model?: string
  baseUrl?: string
}

/** Editor configuration */
export interface EditorConfig {
  /** Theme mode (light/dark/auto) */
  theme?: ThemeMode
  /** Theme preset */
  themePreset?: ThemePreset
  /** Custom theme CSS variables */
  customTheme?: Record<string, string>
  /** Feature flags */
  features?: FeatureFlags
  /** AI configuration */
  aiConfig?: AiConfig
  /** Locale */
  locale?: 'zh-CN' | 'zh-TW' | 'en-US'
  /** Readonly mode */
  readonly?: boolean
  /** Preview mode (no toolbar) */
  previewMode?: boolean
  /** Initial content */
  initialContent?: string
  /** Placeholder */
  placeholder?: string
  /** License key */
  licenseKey?: string
}

/** Preset configurations */
export const PRESET_CONFIGS = {
  /** 最小配置 */
  minimal: {
    features: {
      textFormat: true,
      list: true,
      undoRedo: true,
    },
  } satisfies Partial<EditorConfig>,
  
  /** 基础配置 */
  basic: {
    features: {
      heading: true,
      textFormat: true,
      list: true,
      align: true,
      link: true,
      undoRedo: true,
      headerNav: true,
    },
  } satisfies Partial<EditorConfig>,
  
  /** 高级配置 */
  advanced: {
    features: {
      heading: true,
      textFormat: true,
      list: true,
      align: true,
      color: true,
      image: true,
      font: true,
      link: true,
      table: true,
      codeBlock: true,
      undoRedo: true,
      formatPainter: true,
      zoom: true,
      headerNav: true,
      footerNav: true,
      dragHandleMenu: true,
      linkBubbleMenu: true,
      tableToolbar: true,
      imageToolbar: true,
    },
  } satisfies Partial<EditorConfig>,
  
  /** 完整配置（含 AI） */
  full: {
    features: {
      heading: true,
      textFormat: true,
      list: true,
      align: true,
      color: true,
      image: true,
      font: true,
      link: true,
      table: true,
      codeBlock: true,
      undoRedo: true,
      formatPainter: true,
      zoom: true,
      subscriptSuperscript: true,
      clearFormat: true,
      headerNav: true,
      footerNav: true,
      dragHandleMenu: true,
      floatingMenu: true,
      linkBubbleMenu: true,
      tableToolbar: true,
      imageToolbar: true,
      ai: true,
    },
  } satisfies Partial<EditorConfig>,
  
  /** Notion 风格配置 - 极简工具栏 + 浮动格式化 */
  notion: {
    themePreset: 'notion' as ThemePreset,
    features: {
      // 固定工具栏只保留撤消/重做
      undoRedo: true,
      
      // 浮动工具栏（选中文字时显示）
      floatingMenu: true,
      linkBubbleMenu: true,
      
      // 拖拽排序（六个点菜单）
      dragHandleMenu: true,
      
      // 隐藏固定工具栏中的其他按钮
      heading: false,
      textFormat: false,
      list: false,
      align: false,
      color: false,
      image: false,
      font: false,
      link: false,
      table: false,
      codeBlock: false,
      formatPainter: false,
      zoom: false,
      headerNav: false,
      footerNav: false,
    },
  } satisfies Partial<EditorConfig>,
} as const

export type PresetName = keyof typeof PRESET_CONFIGS

/** 合并配置 */
export function mergeConfig(
  preset: PresetName | Partial<EditorConfig>,
  overrides?: Partial<EditorConfig>
): EditorConfig {
  const base = typeof preset === 'string' ? PRESET_CONFIGS[preset] : preset
  return {
    theme: 'light',
    themePreset: 'default',
    locale: 'zh-CN',
    ...base,
    ...overrides,
    features: {
      ...base.features,
      ...overrides?.features,
    },
  }
}

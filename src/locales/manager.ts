/**
 * i18n Manager
 * Standalone internationalization system (no external deps)
 */

import { zhCN } from './zh-CN'
import { zhTW } from './zh-TW'
import { enUS } from './en-US'
import { ref, computed } from 'vue'

export type LocaleCode = 'zh-CN' | 'zh-TW' | 'en-US'

export type LocaleMessages = typeof zhCN

const builtInLocales: Record<LocaleCode, LocaleMessages> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
}

// State
const currentLocale = ref<LocaleCode>('zh-CN')
const customMessages = ref<Record<string, LocaleMessages>>({})

/**
 * Get nested value from object by dot-separated key
 */
function getNestedValue(obj: LocaleMessages | Record<string, LocaleMessages> | undefined, key: string): string {
  if (!obj) return key

  const keys = key.split('.')
  let result: unknown = obj

  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== 'object') {
      return key
    }
    result = (result as Record<string, unknown>)[k]
  }

  return typeof result === 'string' ? result : key
}

/**
 * Translate a key with optional interpolation
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const locale = currentLocale.value
  let result = key

  // Check custom messages first
  if (customMessages.value[locale]) {
    const custom = getNestedValue(customMessages.value[locale], key)
    if (custom !== key) result = custom
  }

  // Fall back to built-in
  if (result === key) {
    const builtIn = builtInLocales[locale]
    if (builtIn) {
      const builtInResult = getNestedValue(builtIn, key)
      if (builtInResult !== key) result = builtInResult
    }
  }

  // Fall back to en-US
  if (result === key && locale !== 'en-US') {
    const fallbackResult = getNestedValue(builtInLocales['en-US'], key)
    if (fallbackResult !== key) result = fallbackResult
  }

  // Apply interpolation if params provided
  if (params && result !== key) {
    Object.entries(params).forEach(([paramKey, value]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value))
    })
  }

  return result
}

/**
 * Create i18n instance
 */
export function createI18n(options?: {
  locale?: LocaleCode
  fallbackLocale?: LocaleCode
  messages?: Record<string, LocaleMessages>
}) {
  if (options?.locale) {
    currentLocale.value = options.locale
  }
  if (options?.messages) {
    customMessages.value = options.messages
  }
}

/**
 * Use i18n composable
 */
export function useI18n() {
  return {
    t,
    locale: computed(() => currentLocale.value),
    setLocale: (locale: LocaleCode) => {
      currentLocale.value = locale
    },
    availableLocales: Object.keys(builtInLocales) as LocaleCode[],
  }
}

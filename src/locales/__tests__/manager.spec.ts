/**
 * i18n Manager 单元测试
 */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { t, useI18n, createI18n, detectDefaultLocale } from '../manager'

describe('i18n manager', () => {
  beforeEach(() => {
    // 每个用例从确定的 locale 出发
    useI18n().setLocale('en-US')
  })

  describe('t()', () => {
    it('translates a known key in the current locale', () => {
      const { setLocale } = useI18n()
      setLocale('zh-CN')
      const zh = t('toolbar.bold')
      setLocale('en-US')
      const en = t('toolbar.bold')
      expect(zh).not.toBe('toolbar.bold')
      expect(en).not.toBe('toolbar.bold')
      expect(zh).not.toBe(en)
    })

    it('returns the key itself when no translation exists', () => {
      expect(t('nonexistent.key.path')).toBe('nonexistent.key.path')
    })

    it('falls back to en-US for keys missing in the current locale', () => {
      const { setLocale } = useI18n()
      setLocale('zh-CN')
      // 自定义消息只给 en-US 提供该 key，zh-CN 缺失 → 回退英文
      createI18n({
        messages: {
          'en-US': { onlyEnglish: { hello: 'Hello' } } as never,
        },
      })
      expect(t('onlyEnglish.hello')).toBe('Hello')
      createI18n({ messages: {} })
    })

    it('interpolates {params}', () => {
      createI18n({
        messages: {
          'en-US': { testGroup: { greet: 'Hi {name}, you have {n} items' } } as never,
        },
      })
      expect(t('testGroup.greet', { name: 'Ben', n: 3 })).toBe('Hi Ben, you have 3 items')
      createI18n({ messages: {} })
    })
  })

  describe('useI18n()', () => {
    it('setLocale switches the active locale', () => {
      const { setLocale, locale } = useI18n()
      setLocale('zh-TW')
      expect(locale.value).toBe('zh-TW')
      setLocale('en-US')
      expect(locale.value).toBe('en-US')
    })

    it('exposes the three built-in locales', () => {
      expect(useI18n().availableLocales.sort()).toEqual(['en-US', 'zh-CN', 'zh-TW'])
    })
  })

  describe('detectDefaultLocale()', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it.each([
      ['zh-CN', 'zh-CN'],
      ['zh', 'zh-CN'],
      ['zh-TW', 'zh-TW'],
      ['zh-HK', 'zh-TW'],
      ['zh-Hant', 'zh-TW'],
      ['en-US', 'en-US'],
      ['fr-FR', 'en-US'],
    ])('maps navigator.language %s → %s', (lang, expected) => {
      vi.stubGlobal('navigator', { language: lang })
      expect(detectDefaultLocale()).toBe(expected)
    })

    it('falls back to en-US without a navigator', () => {
      vi.stubGlobal('navigator', undefined)
      expect(detectDefaultLocale()).toBe('en-US')
    })
  })
})

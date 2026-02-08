/**
 * Translation Feature
 * @description AI-powered text translation with language selection
 */

export { TranslationExtension } from './TranslationExtension';
export type { TranslationOptions } from './TranslationExtension';

export { LANGUAGE_CODES } from './languageCodes';
export type { LanguageCode } from './languageCodes';

export {
  currentTranslateLang,
  setTranslateLang,
  clearTranslateLang,
  STORAGE_KEY,
} from './translateStore';


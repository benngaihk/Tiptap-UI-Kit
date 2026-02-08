/**
 * 翻译语言代码配置
 * @description 定义支持的语言代码及其映射关系
 */

export interface LanguageCode {
  code: string;
  key: string;
}

/**
 * 支持的语言代码列表
 * 用于翻译功能的语言选择
 */
export const LANGUAGE_CODES: LanguageCode[] = [
  { code: 'zh-CN', key: 'zh-CN' },
  { code: 'zh-TW', key: 'zh-TW' },
  { code: 'en', key: 'en' },
  { code: 'ja', key: 'ja' },
  { code: 'th', key: 'th' },
  { code: 'fr', key: 'fr' },
  { code: 'es', key: 'es' },
  { code: 'pt', key: 'pt' },
  { code: 'ko', key: 'ko' },
  { code: 'vi', key: 'vi' },
  { code: 'ru', key: 'ru' },
  { code: 'de', key: 'de' },
  { code: 'hi', key: 'hi' },
  { code: 'id', key: 'id' },
];


/**
 * 翻译语言状态管理
 * @description 管理翻译目标语言的选择和持久化
 */
import { ref } from 'vue';

const STORAGE_KEY = 'tiptap_translate_target_lang';

// 全局共享的翻译目标语言（初始为空，需用户先选择）
const saved = typeof window !== 'undefined' ? window.localStorage?.getItem(STORAGE_KEY) : null;
export const currentTranslateLang = ref<string>(saved || '');

/**
 * 设置语言并持久化到 localStorage
 * @param label 语言标签（如 "英文"、"中文" 等）
 */
export function setTranslateLang(label: string) {
  try {
    currentTranslateLang.value = label;
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(STORAGE_KEY, label);
    }
  } catch (error) {
    console.warn('[Translate Store] Failed to save language preference:', error);
  }
}

/**
 * 清除已保存的语言选择
 */
export function clearTranslateLang() {
  try {
    currentTranslateLang.value = '';
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('[Translate Store] Failed to clear language preference:', error);
  }
}

// 允许外部读取存储键（如需要）
export { STORAGE_KEY };


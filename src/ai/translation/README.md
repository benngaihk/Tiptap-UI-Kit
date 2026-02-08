# 翻译功能 (Translation Feature)

AI 驱动的文本翻译功能，支持多语言选择和持久化。

## 功能特性

- ✅ 支持 14 种语言的翻译
- ✅ 语言选择状态持久化（localStorage）
- ✅ 下拉菜单式语言选择界面
- ✅ 与续写功能类似的交互体验
- ✅ 实时流式翻译结果展示

## 文件结构

```
translation/
├── TranslationExtension.ts    # Tiptap 扩展，提供翻译命令
├── languageCodes.ts           # 语言代码配置
├── translateStore.ts          # 翻译语言状态管理
├── index.ts                   # 导出文件
└── README.md                  # 本文档
```

## 使用方法

### 1. 在编辑器中使用翻译扩展

```typescript
import { TranslationExtension } from '@/components/tiptapPro-tenant/ai/translation';

// 在编辑器配置中添加扩展
editor = new Editor({
  extensions: [
    // ... 其他扩展
    TranslationExtension.configure({
      defaultTargetLang: '英文', // 可选：设置默认目标语言
    }),
  ],
});
```

### 2. 编程式调用翻译命令

```typescript
// 使用保存的语言
editor.commands.translate();

// 或指定目标语言
editor.commands.translate('英文');
editor.commands.translate('中文');
```

### 3. 管理翻译语言状态

```typescript
import {
  currentTranslateLang,
  setTranslateLang,
  clearTranslateLang,
} from '@/components/tiptapPro-tenant/ai/translation';

// 获取当前选择的语言
const lang = currentTranslateLang.value;

// 设置目标语言
setTranslateLang('英文');

// 清除保存的语言
clearTranslateLang();
```

### 4. 使用语言代码配置

```typescript
import { LANGUAGE_CODES } from '@/components/tiptapPro-tenant/ai/translation';

// 获取所有支持的语言
LANGUAGE_CODES.forEach(({ code, key }) => {
  console.log(`Code: ${code}, Key: ${key}`);
});
```

## 支持的语言

| 代码 | 键值 | 说明 |
|------|------|------|
| zh-CN | zh-CN | 简体中文 |
| zh-TW | zh-TW | 繁体中文 |
| en | en | 英文 |
| ja | ja | 日文 |
| th | th | 泰文 |
| fr | fr | 法文 |
| es | es | 西班牙文 |
| pt | pt | 葡萄牙文 |
| ko | ko | 韩文 |
| vi | vi | 越南文 |
| ru | ru | 俄文 |
| de | de | 德文 |
| hi | hi | 印地文 |
| id | id | 印尼文 |

## 状态持久化

翻译语言选择会自动保存到 `localStorage`，键名为 `tiptap_translate_target_lang`。

- 用户选择语言后，下次打开编辑器时会自动恢复
- 可以通过 `clearTranslateLang()` 清除保存的语言

## 与续写功能的对比

本翻译功能参考了续写功能的实现方式：

| 特性 | 续写功能 | 翻译功能 |
|------|---------|---------|
| 扩展文件 | ContinueWritingExtension.ts | TranslationExtension.ts |
| 按钮组件 | ContinueWritingButton.vue | 无（使用 AiMenuButton） |
| 状态管理 | 无 | translateStore.ts |
| 配置管理 | 无 | languageCodes.ts |
| 交互方式 | 直接点击 | 通过 AiMenuButton 下拉菜单选择语言 |

## 注意事项

1. **文本选择**：翻译功能需要先选中要翻译的文本
2. **语言标签**：使用语言标签（如 "英文"、"中文"）而非语言代码（如 "en"、"zh"）
3. **国际化**：语言标签通过 `t('editor.lang.${key}')` 获取，确保 locales 文件中有对应的翻译
4. **API 依赖**：需要 `aiApiService.translate()` 方法支持

## 相关文件

- `../shared/aiSuggestionManager.ts` - AI 建议管理器
- `../shared/AiSuggestionPopover.vue` - AI 建议弹窗组件
- `../../locales.ts` - 国际化文件


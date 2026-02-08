# Continue Writing Feature

AI 续写功能，基于选中文本进行智能续写。

## 文件说明

- `ContinueWritingButton.vue` - 续写按钮组件
- `ContinueWritingExtension.ts` - 续写扩展，提供 `continueWriting` 命令
- `index.ts` - 统一导出

## 依赖说明

本功能依赖以下共享组件（位于 `tiptapPro/features/ai/`）：

- `aiSuggestionManager` - AI 建议管理器，用于显示和管理 AI 生成的建议
- `AiSuggestionPopover.vue` - AI 建议弹窗组件
- `AiHighlightMark.ts` - AI 高亮标记扩展

## 使用方法

```typescript
import { ContinueWritingExtension, ContinueWritingButton } from './ai/continue-writing'

// 在编辑器配置中添加扩展
editor = useEditor({
  extensions: [
    // ... 其他扩展
    ContinueWritingExtension,
  ],
})

// 使用按钮组件
<ContinueWritingButton
  :title="t('editor.continueWriting')"
  :onClick="() => editor.commands.continueWriting()"
/>
```

## 功能说明

1. 用户选中一段文本
2. 点击续写按钮或调用 `editor.commands.continueWriting()`
3. 系统会基于选中文本和完整文档上下文进行续写
4. 续写内容会以 AI 建议的形式显示在弹窗中
5. 用户可以接受、拒绝或取消建议

## 注意事项

- 需要确保 `aiSuggestionManager` 已在编辑器中初始化
- 需要确保 `AiHighlightMark` 扩展已添加到编辑器
- 需要配置正确的 AI API 服务


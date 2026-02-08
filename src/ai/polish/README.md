# Polish Feature

AI 润色功能，基于选中文本进行智能润色。

## 文件说明

- `PolishButton.vue` - 润色按钮组件
- `PolishExtension.ts` - 润色扩展，提供 `polish` 命令
- `index.ts` - 统一导出

## 依赖说明

本功能依赖以下共享组件（位于 `tiptapPro-tenant/ai/shared/`）：

- `AiSuggestionPopover.vue` - AI 建议弹窗组件
- `AiHighlightMark.ts` - AI 高亮标记扩展

## 使用方法

```typescript
import { PolishExtension, PolishButton } from './ai/polish'

// 在编辑器配置中添加扩展
editor = useEditor({
  extensions: [
    // ... 其他扩展
    PolishExtension,
  ],
})

// 使用按钮组件
<PolishButton
  :title="t('editor.polish')"
  :onClick="() => editor.commands.polish()"
/>
```

## 功能说明

1. 用户选中一段文本
2. 点击润色按钮或调用 `editor.commands.polish()`
3. 系统会基于选中文本和完整文档上下文进行润色
4. 润色内容会以 AI 建议的形式显示在弹窗中
5. 用户可以接受、拒绝或取消建议

## 注意事项

- 需要确保 `AiHighlightMark` 扩展已添加到编辑器
- 需要配置正确的 AI API 服务
- 润色功能会替换选中的文本，而不是在选中文本后插入


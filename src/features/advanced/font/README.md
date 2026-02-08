# Font - 字体功能模块

字体功能模块提供了在编辑器中设置字体、字号和行高的能力。

## 功能特性

- ✅ 字体选择器：支持选择字体系列
- ✅ 字号选择器：支持选择字号大小
- ✅ 行高扩展：支持设置段落和标题的行高
- ✅ 字号扩展：支持设置文本字号
- ✅ 自动状态同步：自动同步编辑器中的字体和字号状态

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <FontFamilySelect :editor="editor" />
    <FontSizeSelect :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { FontFamilySelect, FontSizeSelect } from '#/components/tiptapPro-tenant/advanced/font'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在工具栏中使用

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ font: true }">
    <template #extra>
      <FontFamilySelect :editor="editor" />
      <FontSizeSelect :editor="editor" />
    </template>
  </ToolbarNav>
</template>
```

## 扩展使用

### 在编辑器配置中使用

```typescript
import { FontSize, LineHeight } from '#/components/tiptapPro-tenant/advanced/font'
import { FontFamily } from '@tiptap/extension-font-family'

const editor = new Editor({
  extensions: [
    // ... 其他扩展
    FontFamily,
    FontSize,
    LineHeight,
  ],
})
```

## 常量使用

```typescript
import {
  FONT_FAMILIES,
  FONT_SIZES,
  LINE_HEIGHTS,
  DEFAULT_VALUES,
} from '#/components/tiptapPro-tenant/advanced/font'

// 获取所有字体选项
console.log(FONT_FAMILIES) // [{ label: 'PMingLiU', value: 'PMingLiU' }, ...]

// 获取所有字号选项
console.log(FONT_SIZES) // [{ label: '12', value: '12px' }, ...]

// 获取默认值
console.log(DEFAULT_VALUES) // { fontFamily: 'PMingLiU', fontSize: '16px', lineHeight: '1.5', ... }
```

> **注意**：常量定义已统一迁移到 `shared/configs/editorConstants.ts`，此处为重新导出。

## API

### FontFamilySelect

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- 点击下拉菜单选择字体
- 如果当前光标在文本中，会应用到选中文本
- 如果当前光标不在文本中，会应用到整个段落
- 自动同步编辑器中的字体状态

### FontSizeSelect

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- 点击下拉菜单选择字号
- 如果当前光标在文本中，会应用到选中文本
- 如果当前光标不在文本中，会应用到整个段落
- 自动同步编辑器中的字号状态

## 文件结构

```
font/
├── FontFamilySelect.vue    # 字体选择器组件
├── FontSizeSelect.vue      # 字号选择器组件
├── index.ts                # 统一导出（扩展和常量从 shared 重新导出）
└── README.md               # 说明文档
```

> **注意**：
> - 扩展定义位于 `shared/extensions/fontSize.ts` 和 `shared/extensions/lineHeight.ts`
> - 常量定义位于 `shared/configs/editorConstants.ts`
> - 本模块通过 `index.ts` 统一重新导出，方便使用

## 注意事项

1. 使用字体功能需要确保编辑器已配置 `FontFamily` 扩展（来自 `@tiptap/extension-font-family`）
2. 字号功能需要 `FontSize` 扩展和 `TextStyle` 扩展
3. 行高功能需要 `LineHeight` 扩展
4. 字体和字号会自动同步编辑器状态
5. 多语言支持已集成到 `locales` 模块中


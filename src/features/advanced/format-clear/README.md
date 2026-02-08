# Format Clear - 格式清除功能模块

格式清除功能模块提供了在编辑器中清除格式的能力。

## 功能特性

- ✅ **清除格式**：一键清除当前选区的所有格式（文本样式、颜色、字体等）

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <ClearFormatButton :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ClearFormatButton } from '#/components/tiptapPro-tenant/advanced/format-clear'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在工具栏中使用

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ clearFormat: true }">
    <template #extra>
      <ClearFormatButton :editor="editor" />
    </template>
  </ToolbarNav>
</template>
```

## API

### ClearFormatButton

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- 点击按钮清除当前选区的所有格式
- 包括文本样式（粗体、斜体、下划线等）、颜色、字体、对齐等

## 文件结构

```
format-clear/
├── ClearFormatButton.vue    # 清除格式按钮组件
├── index.ts                  # 统一导出
└── README.md                 # 说明文档
```

## 注意事项

1. 清除格式会移除当前选区的所有格式，包括：
   - 文本样式：粗体、斜体、下划线、删除线、上下标
   - 颜色：文字颜色、背景高亮
   - 字体：字体系列、字号、行高
   - 对齐：左对齐、居中、右对齐、两端对齐
2. 多语言支持已集成到 `locales` 模块中

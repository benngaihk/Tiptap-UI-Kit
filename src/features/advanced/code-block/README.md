# Code Block - 代码块功能模块

代码块功能模块提供了在编辑器中插入代码块的能力，点击按钮即可插入代码块。

## 功能特性

- ✅ 一键插入代码块（使用默认语言 JavaScript）
- ✅ 代码块状态检测
- ✅ 点击已激活的代码块可退出代码块模式

## 使用方法

### 基础用法

```vue
<template>
  <CodeBlockDropdown :editor="editor" />
</template>

<script setup lang="ts">
import { CodeBlockDropdown } from '#/components/tiptapPro-tenant/advanced/code-block'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在工具栏中使用

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ codeBlock: true }">
    <!-- 其他工具栏按钮 -->
    <template #extra>
      <CodeBlockDropdown :editor="editor" />
    </template>
  </ToolbarNav>
</template>
```

## 使用说明

- **插入代码块**：点击代码块按钮，直接插入一个使用 JavaScript 语言的代码块
- **退出代码块**：如果当前光标在代码块中，再次点击按钮会退出代码块模式，转换为普通段落
- **默认语言**：插入的代码块默认使用 JavaScript 语言，可以在代码块中手动修改语言标识

## 默认语言

代码块默认使用 **JavaScript** 语言。如果需要其他语言，可以在代码块中手动修改语言标识，或者在代码块属性中设置。

支持的语言包括：JavaScript、TypeScript、Python、Java、HTML、CSS、JSON、Bash、SQL、PHP、Go、Rust、C、C++、C#、Swift、Kotlin、Ruby、Markdown、XML 等。

## 文件结构

```
code-block/
├── CodeBlockDropdown.vue    # 代码块按钮组件
├── index.ts                  # 统一导出
└── README.md                 # 说明文档
```

## API

### CodeBlockDropdown

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- 点击按钮直接插入代码块（使用默认语言 JavaScript）
- 如果当前光标在代码块中，点击按钮会退出代码块模式，转换为普通段落

## 代码语言常量

如果需要代码语言列表，可以从 `shared/configs/editorConstants.ts` 导入：

```typescript
import { CODE_LANGUAGES } from '#/components/tiptapPro-tenant/shared/configs/editorConstants'

// 获取所有支持的语言
console.log(CODE_LANGUAGES) // ['javascript', 'typescript', ...]
```

## 注意事项

1. 使用代码块功能需要确保编辑器已配置 `CodeBlockLowlight` 扩展
2. 代码块默认使用 JavaScript 语言，可以在代码块中手动修改语言标识
3. 多语言支持已集成到 `locales` 模块中


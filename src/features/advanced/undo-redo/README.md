# Undo Redo - 撤销/重做功能模块

撤销/重做功能模块提供了在编辑器中进行撤销和重做操作的能力。

## 功能特性

- ✅ **撤销操作**：一键撤销最近的编辑操作，回退到上一个编辑状态
- ✅ **重做操作**：一键恢复被撤销的操作，恢复到撤销前的状态
- ✅ **状态检测**：自动检测是否可以执行撤销/重做操作，按钮状态实时更新
- ✅ **键盘快捷键支持**：支持 `Ctrl+Z`（撤销）和 `Ctrl+Shift+Z` / `Ctrl+Y`（重做）

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <UndoRedoButton :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { UndoRedoButton } from '#/components/tiptapPro-tenant/advanced/undo-redo'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在工具栏中使用

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ undoRedo: true }">
    <template #extra>
      <UndoRedoButton :editor="editor" />
    </template>
  </ToolbarNav>
</template>
```

## API

### UndoRedoButton

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- **撤销按钮**：点击按钮执行撤销操作，当没有可撤销的历史记录时按钮会被禁用
- **重做按钮**：点击按钮执行重做操作，当没有可重做的历史记录时按钮会被禁用
- **自动状态更新**：按钮的禁用状态会根据编辑器的历史记录状态自动更新

## 键盘快捷键

- `Ctrl+Z` (Windows/Linux) 或 `Cmd+Z` (Mac)：撤销
- `Ctrl+Shift+Z` 或 `Ctrl+Y` (Windows/Linux) 或 `Cmd+Shift+Z` (Mac)：重做

> 注意：快捷键由 Tiptap 的 History 扩展提供，无需额外配置。

## 文件结构

```
undo-redo/
├── UndoRedoButton.vue    # 撤销/重做按钮组件
├── index.ts               # 统一导出
└── README.md              # 说明文档
```

## 注意事项

1. 撤销/重做功能依赖于 Tiptap 的 `History` 扩展，确保编辑器已正确配置该扩展
2. 按钮的禁用状态会根据编辑器的历史记录状态自动更新
3. 多语言支持已集成到 `locales` 模块中
4. 撤销/重做的历史记录深度由 `History` 扩展的配置决定，默认通常为 50 步

## 技术实现

- 使用 `createCommandRunner` 工具函数创建命令执行器，确保命令执行的安全性和一致性
- 使用 `computed` 响应式计算属性实时检测撤销/重做的可用性
- 通过 `editor.can().undo()` 和 `editor.can().redo()` 方法检查命令是否可执行


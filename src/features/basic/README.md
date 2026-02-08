# 基础版功能模块

## 📁 目录结构

```
basic/
├── text-format/           # 文本格式组件
│   ├── TextFormatButtons.vue
│   └── index.ts
├── list/                  # 列表组件
│   ├── ListTools.vue
│   └── index.ts
├── color/                 # 颜色组件
│   ├── ColorPicker.vue
│   └── index.ts
├── heading/               # 标题组件
│   ├── HeadingDropdown.vue  # 标题下拉菜单（正文、H1-H6）
│   ├── HeadingButtons.vue    # 标题按钮组（H1、H2、H3等）
│   └── index.ts
├── align/                 # 对齐组件
│   ├── AlignDropdown.vue     # 对齐下拉菜单（左对齐、居中、右对齐、两端对齐）
│   └── index.ts
└── index.ts               # 统一导出

注意：BasicToolbar 已迁移到 tools/header-nav/ToolbarNav.vue
```

**注意：** 公共文件（`ui`、`utils`、`types`、`styles`）位于 `shared/` 文件夹中，不在 `basic/` 目录下。

## ✅ 功能清单

基础版包含以下功能：

- ✅ **文本格式**：粗体、斜体、下划线、删除线
- ✅ **标题**：H1-H6、正文
- ✅ **对齐**：左对齐、居中、右对齐、两端对齐
- ✅ **列表**：有序列表、无序列表、任务列表
- ✅ **颜色**：文字颜色、背景颜色

## 🚀 使用方式

### 导入基础版组件

```typescript
// 导入基础版功能组件
import { TextFormatButtons, ListTools, ColorPicker } from './basic'

// 工具栏已迁移到 tools/header-nav
import { ToolbarNav, BASIC_TOOLBAR_CONFIG } from '../tools/header-nav'
```

### 禁用基础版功能

基础版功能是独立的，可以通过注释导入来禁用：

**在 `TiptapProEditor.vue` 中：**

```vue
<script setup lang="ts">
// 注释掉基础工具栏导入
// 工具栏已迁移到 tools/header-nav/ToolbarNav.vue
// import { ToolbarNav, BASIC_TOOLBAR_CONFIG } from '../tools/header-nav'

// 注释掉基础样式导入
// import '../basic/styles/toolbar.css'
</script>

<template>
  <!-- 注释掉基础工具栏组件 -->
  <!-- <ToolbarNav v-if="editorInstance" :editor="editorInstance" :config="BASIC_TOOLBAR_CONFIG" class="word-toolbar" /> -->
</template>
```

**在 `ToolbarNav.vue` 中：**

```vue
<script setup lang="ts">
// 可以注释掉某个功能组件的导入
// import { TextFormatButtons } from './text-format'
// import { ListTools } from './list'
// import { ColorPicker } from './color'
</script>
```

## 📝 说明

- 所有基础版功能都在 `basic/` 文件夹中，完全独立
- 通过注释导入语句即可禁用对应功能，不影响其他功能
- 每个功能模块都有自己的 `index.ts` 统一导出
- 公共文件（`ui`、`utils`、`types`、`styles`、`configs`）位于 `shared/` 文件夹中，供所有版本共享使用
- `basic/` 目录下只包含功能相关的文件夹（text-format、heading、align、list、color），结构清晰简洁


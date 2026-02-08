# Floating Menu - 文本悬浮菜单

## 功能概述

文本悬浮菜单是一个气泡菜单组件，当用户选中文本时自动显示，提供以下功能：

- ✅ 标题快捷按钮（H1-H6）
- ✅ 文本格式（粗体、斜体、下划线、删除线、行内代码）
- ✅ 颜色工具（文字颜色、背景高亮）
- ✅ 链接工具
- ✅ 列表工具（无序列表、有序列表、任务列表）
- ✅ AI 工具（续写、润色、总结、翻译、自定义AI）

## 文件结构

```
floating-menu/
├── FloatingMenu.vue    # 悬浮菜单主组件
├── MenuItem.vue        # 菜单项组件（占位）
├── index.ts            # 导出文件
└── README.md           # 说明文档
```

## 使用方法

### 1. 导入组件

```typescript
import { FloatingMenu } from '@/components/tiptapPro-tenant/tools/floating-menu'
```

### 2. 在编辑器中使用

```vue
<template>
  <div>
    <!-- 编辑器 -->
    <EditorContent :editor="editor" />
    
    <!-- 文本悬浮菜单（选中文本时显示） -->
    <FloatingMenu :editor="editor" :readonly="false" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { FloatingMenu } from '@/components/tiptapPro-tenant/tools/floating-menu'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
  ],
})
</script>
```

### 3. 在 TiptapProEditor 中启用

```vue
<template>
  <TiptapProEditor
    :features="{ floatingMenu: true }"
    :readonly="false"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `editor` | `Editor \| null \| undefined` | - | Tiptap 编辑器实例（必需） |
| `readonly` | `boolean` | `false` | 是否只读模式 |

## 功能说明

### 显示时机

悬浮菜单会在以下情况下显示：
- ✅ 有文本选中（非空选区）
- ✅ 不在代码块中
- ✅ 不在表格中（表格有自己的工具栏）
- ✅ 未选中图片（图片有自己的工具栏）
- ✅ 未选中链接（链接有自己的悬浮框）
- ✅ 非只读模式

### 功能模块

1. **标题快捷按钮**：快速切换标题级别（H1-H6）
2. **文本格式**：粗体、斜体、下划线、删除线、行内代码
3. **颜色工具**：文字颜色选择器、背景高亮选择器
4. **链接工具**：插入/编辑链接
5. **列表工具**：无序列表、有序列表、任务列表
6. **AI 工具**：续写、润色、总结、翻译（支持多语言）、自定义AI

## 样式说明

悬浮菜单的样式定义在：
- 组件内部样式（scoped）
- `../shared/styles/floating-menu-toolbar.css`（全局样式）

样式包括：
- 气泡菜单容器样式
- 按钮样式（包括悬停、激活状态）
- 颜色选择面板样式
- 暗黑模式支持
- 响应式设计（移动端适配）

## 依赖模块

悬浮菜单依赖以下模块：

- **基础组件**：
  - `HeadingButtons` - 标题按钮组件（`../basic/heading`）
  - `TextFormatButtons` - 文本格式按钮组件（`../basic/text-format`）
  - `ListTools` - 列表工具组件（`../basic/list`）
  - `ColorPicker` - 颜色选择器组件（`../basic/color`）
  - `LinkButton` - 链接按钮组件（`../advanced/link`）

- **共享组件**：
  - `ToolbarDropdownButton` - 下拉按钮组件（`../shared/components`）

- **工具函数**：
  - `createCommandRunner` - 命令运行器（`../shared/utils/editorCommands`）
  - `createAiToolMenuItems` - AI 工具菜单项工厂函数（`../shared/configs/toolbarConfigs`）

- **国际化**：
  - `t` - 翻译函数（`../locales`）

## 注意事项

1. **编辑器实例**：必须提供有效的 Tiptap 编辑器实例
2. **自动显示**：菜单会在选中文本时自动显示，无需手动控制
3. **只读模式**：在只读模式下，菜单不会显示
4. **冲突处理**：菜单会自动检测并避免与其他工具栏（图片、链接、表格）冲突
5. **响应式**：在移动端（宽度 < 768px）会自动隐藏菜单

## 相关模块

- **工具栏导航**：`../tools/header-nav/ToolbarNav.vue`
- **图片工具栏**：`../tools/image-toolbar/ImageToolbar.vue`
- **链接悬浮框**：`../tools/link-bubble/LinkBubbleMenu.vue`
- **表格工具栏**：`../tools/table-toolbar/TableToolbar.vue`
- **悬浮菜单样式**：`../shared/styles/floating-menu-toolbar.css`


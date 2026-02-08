# Table - 表格功能模块

表格功能模块提供了在编辑器中操作表格的能力，包括插入行/列、删除行/列、合并/拆分单元格、设置单元格背景色和对齐方式等功能。

## 功能特性

- ✅ 表格插入按钮：在工具栏中点击即可插入表格（默认 3x3 带表头）
- ✅ 表格工具栏：悬浮在表格上方，提供丰富的表格操作功能
- ✅ 行操作：在上方/下方插入行、删除行
- ✅ 列操作：在左侧/右侧插入列、删除列
- ✅ 单元格操作：合并单元格、拆分单元格、切换表头行/列
- ✅ 样式设置：设置单元格背景色、文本对齐方式
- ✅ 表格删除：一键删除整个表格
- ✅ 扩展支持：支持背景色和对齐方式的表格单元格扩展

## 使用方法

### 基础用法

#### 使用表格按钮（工具栏）

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ table: true }">
    <!-- 其他工具栏按钮 -->
  </ToolbarNav>
</template>

<script setup lang="ts">
import { ToolbarNav } from '#/components/tiptapPro-tenant/tools/header-nav'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

#### 使用表格工具栏（悬浮菜单）

```vue
<template>
  <TiptapProEditor :editor="editor">
    <TableToolbar :editor="editor" />
  </TiptapProEditor>
</template>

<script setup lang="ts">
import { TableToolbar } from '#/components/tiptapPro-tenant/tools/table-toolbar'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

#### 单独使用表格按钮

```vue
<template>
  <TableButton :editor="editor" />
</template>

<script setup lang="ts">
import { TableButton } from '#/components/tiptapPro-tenant/advanced/table'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在编辑器配置中使用扩展

```typescript
import { TableCellWithBackground } from '#/components/tiptapPro-tenant/advanced/table'
import { Table, TableRow, TableHeader } from '@tiptap/extension-table'

const editor = new Editor({
  extensions: [
    // ... 其他扩展
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCellWithBackground, // 使用支持背景色的表格单元格扩展
  ],
})
```

## 组件说明

### TableButton

表格插入按钮组件，用于在工具栏中插入表格。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- 点击按钮插入 3x3 表格（带表头行）
- 如果当前光标已在表格中，按钮会显示为激活状态
- 按钮会根据表格状态自动更新激活状态

### TableToolbar

表格工具栏组件，当光标在表格中或选中表格单元格时，会自动显示悬浮工具栏。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |
| readonly | `boolean` | `false` | 是否只读模式，只读模式下工具栏不显示 |
| showMode | `1 \| 2` | `2` | 显示模式：1-仅在表格中显示，2-仅在选中单元格时显示 |

#### 功能

- **行操作**：
  - 在上方插入行
  - 在下方插入行
  - 删除当前行

- **列操作**：
  - 在左侧插入列
  - 在右侧插入列
  - 删除当前列

- **单元格操作**：
  - 合并单元格
  - 拆分单元格
  - 切换表头行
  - 切换表头列

- **样式设置**：
  - 设置单元格背景色（8种预设颜色）
  - 设置文本对齐方式（左对齐、居中、右对齐）

- **删除表格**：一键删除整个表格

### TableCellWithBackground

支持背景色和对齐方式的表格单元格扩展。

#### 功能

- 支持 `backgroundColor` 属性，用于设置单元格背景色
- 支持 `textAlign` 属性，用于设置单元格文本对齐方式
- 兼容 Tiptap TableKit 的所有功能

#### 使用示例

```typescript
import { TableCellWithBackground } from '#/components/tiptapPro-tenant/advanced/table'

// 在编辑器配置中使用
const editor = new Editor({
  extensions: [
    Table,
    TableRow,
    TableHeader,
    TableCellWithBackground, // 替换默认的 TableCell
  ],
})

// 通过命令设置单元格背景色
editor.chain().focus().setCellAttribute('backgroundColor', '#e3f2fd').run()

// 通过命令设置单元格对齐方式
editor.chain().focus().setCellAttribute('textAlign', 'center').run()
```

## 常量使用

```typescript
import { TABLE_CELL_COLORS } from '#/components/tiptapPro-tenant/shared/configs/editorConstants'

// 获取所有表格单元格背景色选项
console.log(TABLE_CELL_COLORS) // ['#ffffff', '#f5f5f5', '#e8f5e9', ...]
```

> **注意**：常量定义已统一迁移到 `shared/configs/editorConstants.ts`。

## 文件结构

```
table/
├── TableButton.vue                # 表格插入按钮组件
├── TableToolbar.vue               # 表格工具栏组件（悬浮菜单）
├── TableCellWithBackground.ts    # 支持背景色的表格单元格扩展
├── TableCell.vue                 # 占位组件（预留）
├── index.ts                      # 统一导出
└── README.md                      # 说明文档
```

## 样式文件

表格相关的样式文件位于 `shared/styles/`：

- `table-bubble-menu.css` - 表格悬浮工具栏样式
- `table-insert-plus.css` - 表格插入按钮样式（如使用）

## 注意事项

1. 使用表格功能需要确保编辑器已配置以下扩展：
   - `Table`（来自 `@tiptap/extension-table`）
   - `TableRow`（来自 `@tiptap/extension-table-row`）
   - `TableHeader`（来自 `@tiptap/extension-table-header`）
   - `TableCellWithBackground`（本模块提供，或使用默认的 `TableCell`）

2. 表格工具栏使用 `BubbleMenu` 实现，会在光标进入表格或选中单元格时自动显示

3. 背景色和对齐方式功能需要 `TableCellWithBackground` 扩展支持

4. 工具栏按钮会根据当前状态自动启用/禁用（例如，无法合并时合并按钮会禁用）

5. 多语言支持已集成到 `locales` 模块中

6. 样式已支持暗色模式（dark mode）

## 迁移说明

本模块从 `tiptapPro/features/table` 迁移而来，保持了相同的 API 和功能，但调整了导入路径以适配 `tiptapPro-tenant` 的目录结构。


# Subscript Superscript - 上标下标功能模块

上标下标功能模块提供了在编辑器中切换文本为上标或下标的能力。

## 功能特性

- ✅ 上标切换（Superscript）
- ✅ 下标切换（Subscript）
- ✅ 状态检测（显示当前激活状态）
- ✅ 互斥切换（上标和下标不能同时激活）

## 使用方法

### 基础用法

```vue
<template>
  <SubscriptSuperscriptButton :editor="editor" />
</template>

<script setup lang="ts">
import { SubscriptSuperscriptButton } from '#/components/tiptapPro-tenant/advanced/subscript-superscript'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在工具栏中使用

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ subscriptSuperscript: true }">
    <!-- 其他工具栏按钮 -->
    <template #extra>
      <SubscriptSuperscriptButton :editor="editor" />
    </template>
  </ToolbarNav>
</template>
```

## 使用说明

- **上标**：点击上标按钮，将选中的文本设置为上标格式（如：x²）
- **下标**：点击下标按钮，将选中的文本设置为下标格式（如：H₂O）
- **切换**：再次点击已激活的按钮可以取消上标或下标格式
- **互斥**：上标和下标是互斥的，激活一个会自动取消另一个

## 文件结构

```
subscript-superscript/
├── SubscriptSuperscriptButton.vue    # 上标下标按钮组件
├── index.ts                           # 统一导出
└── README.md                          # 说明文档
```

## API

### SubscriptSuperscriptButton

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- **上标按钮**：点击切换选中文本的上标格式
- **下标按钮**：点击切换选中文本的下标格式
- **状态显示**：按钮会根据当前选中文本的格式状态显示激活状态

## 注意事项

1. 使用上标下标功能需要确保编辑器已配置 `Subscript` 和 `Superscript` 扩展
2. 上标和下标是互斥的，不能同时应用
3. 多语言支持已集成到 `locales` 模块中
4. 图标使用 `SortDescendingOutlined`（上标）和 `SortAscendingOutlined`（下标）

## 扩展配置

在编辑器初始化时，需要确保包含以下扩展：

```typescript
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    Subscript,
    Superscript,
  ],
})
```


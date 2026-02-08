# Image Toolbar - 图片工具栏

## 功能概述

图片工具栏是一个气泡菜单组件，当用户选中图片时自动显示，提供以下功能：

- ✅ 图片对齐（左对齐、居中、右对齐）
- ✅ 图片预览（点击预览按钮查看大图）
- ✅ 图片删除

## 文件结构

```
image-toolbar/
├── ImageToolbar.vue    # 图片工具栏组件
├── index.ts            # 导出文件
└── README.md           # 说明文档
```

## 使用方法

### 1. 导入组件

```typescript
import { ImageToolbar } from '@/components/tiptapPro-tenant/tools/image-toolbar'
```

### 2. 在编辑器中使用

```vue
<template>
  <div>
    <!-- 编辑器 -->
    <EditorContent :editor="editor" />
    
    <!-- 图片工具栏（选中图片时显示） -->
    <ImageToolbar :editor="editor" :readonly="false" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { ImageToolbar } from '@/components/tiptapPro-tenant/tools/image-toolbar'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    // 注意：需要配合 ResizableImage 扩展使用
  ],
})
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `editor` | `Editor \| null \| undefined` | - | Tiptap 编辑器实例（必需） |
| `readonly` | `boolean` | `false` | 是否只读模式 |

## 功能说明

### 对齐功能

工具栏提供三个对齐按钮：
- **左对齐**：将图片对齐到左侧
- **居中**：将图片居中对齐
- **右对齐**：将图片对齐到右侧

对齐功能会同时设置图片节点的对齐属性和父节点（段落或标题）的对齐方式。

### 预览功能

点击预览按钮会打开一个模态框，显示当前选中图片的大图预览。

### 删除功能

点击删除按钮会删除当前选中的图片。

## 样式说明

工具栏的样式定义在组件内部（scoped），包括：
- 气泡菜单样式
- 按钮样式（包括悬停、激活、危险状态）
- 暗黑模式支持

## 注意事项

1. **编辑器实例**：必须提供有效的 Tiptap 编辑器实例
2. **图片扩展**：需要配合 `ResizableImage` 扩展使用（位于 `../basic/image`）
3. **自动显示**：工具栏会在选中图片时自动显示，无需手动控制
4. **只读模式**：在只读模式下，工具栏不会显示

## 相关模块

- **图片上传**：`../basic/image/ImageUpload.vue`
- **可调整大小的图片扩展**：`../basic/image/ResizableImage.ts`
- **图片样式**：`../shared/styles/image-toolbar.css`


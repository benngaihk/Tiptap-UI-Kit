# Image Feature - 图片功能模块

## 功能概述

完整的图片功能模块，包括：
- ✅ 图片上传（本地/网络）
- ✅ 图片拖拽大小调整（等比例缩放）
- ✅ 图片对齐（左对齐、居中、右对齐）
- ✅ 图片预览
- ✅ 图片删除
- ✅ 图片拖拽移动（在文字之间移动）

## 文件结构

```
image/
├── ImageUpload.vue          # 图片上传组件（工具栏按钮）
├── ResizableImage.ts        # 可调整大小的图片扩展（独立实现，不依赖 drag-handle）
├── image-resize.css         # 图片调整大小相关样式
├── index.ts                 # 导出文件
└── README.md                # 说明文档

注意：ImageToolbar 已迁移至 ../tools/image-toolbar
```

## 使用方法

### 1. 导入扩展和组件

```typescript
import { ResizableImage, ImageUpload } from '@/components/tiptapPro-tenant/basic/image'
import { ImageToolbar } from '@/components/tiptapPro-tenant/tools/image-toolbar'
import '@/components/tiptapPro-tenant/basic/image/image-resize.css'
```

### 2. 在编辑器中使用

#### 基础用法（默认开启图片增强功能）

```vue
<template>
  <div>
    <!-- 工具栏中的图片上传按钮 -->
    <ImageUpload :editor="editor" :upload-image="handleImageUpload" />
    
    <!-- 编辑器 -->
    <EditorContent :editor="editor" />
    
    <!-- 图片工具栏（选中图片时显示） -->
    <ImageToolbar :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { ResizableImage, ImageUpload } from '@/components/tiptapPro-tenant/basic/image'
import { ImageToolbar } from '@/components/tiptapPro-tenant/tools/image-toolbar'
import '@/components/tiptapPro-tenant/basic/image/image-resize.css'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    ResizableImage, // 使用可调整大小的图片扩展（默认开启增强功能）
  ],
})

// 图片上传处理函数（可选）
const handleImageUpload = async (file: File): Promise<string> => {
  // 上传图片到服务器，返回图片 URL
  // 如果不提供，将使用 Base64 编码
  return 'https://example.com/image.jpg'
}
</script>
```

#### 自定义配置（控制图片增强功能）

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { ResizableImage, ImageUpload } from '@/components/tiptapPro-tenant/basic/image'
import { ImageToolbar } from '@/components/tiptapPro-tenant/tools/image-toolbar'
import '@/components/tiptapPro-tenant/basic/image/image-resize.css'

// 根据用户配置决定是否开启图片增强功能
const enableImageResize = ref(true) // 默认开启

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    ResizableImage.configure({
      enableResize: enableImageResize.value, // 控制是否开启图片增强功能
    }),
  ],
})
</script>
```

## 功能说明

### ResizableImage 扩展

- **拖拽大小调整**：鼠标悬停在图片右下角会出现调整手柄，拖拽可调整图片大小（等比例缩放）
- **拖拽移动**：可以直接拖拽图片在文字之间移动位置
- **对齐支持**：支持左对齐、居中、右对齐
- **独立实现**：不依赖 `drag-handle` 扩展，完全独立
- **可配置**：通过 `enableResize` 选项控制是否开启图片增强功能（默认 `true`）

#### 配置选项

```typescript
interface ResizableImageOptions {
  HTMLAttributes?: Record<string, any>
  inline?: boolean
  allowBase64?: boolean
  enableResize?: boolean // 是否启用图片增强功能（拖拽大小调整），默认 true
}
```

### ImageToolbar 组件

> **注意**：`ImageToolbar` 已迁移至 `@/components/tiptapPro-tenant/tools/image-toolbar`

选中图片时会显示气泡菜单，提供：
- **对齐功能**：左对齐、居中、右对齐
- **预览功能**：点击预览按钮查看大图
- **删除功能**：删除当前选中的图片

### ImageUpload 组件

工具栏中的图片上传按钮，支持：
- **本地上传**：拖拽或点击上传本地图片
- **网络上传**：输入图片 URL 插入图片
- **自定义上传**：可通过 `uploadImage` prop 提供自定义上传逻辑

## 样式说明

样式文件 `image-resize.css` 包含：
- 图片选中/悬停样式
- 调整手柄样式（右下角圆点）
- 图片对齐样式
- 暗黑模式支持

## 注意事项

1. **样式导入**：使用 `ResizableImage` 扩展时，需要导入 `image-resize.css` 样式文件
2. **独立实现**：`ResizableImage` 扩展不依赖 `drag-handle` 扩展，可以独立使用
3. **拖拽功能**：图片拖拽移动功能使用 Tiptap 的原生拖拽支持，无需额外配置


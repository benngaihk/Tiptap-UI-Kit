# Zoom - 缩放功能模块

缩放功能模块提供了文档缩放、页数统计和字数统计功能。

## 功能特性

- ✅ **缩放控制**：支持放大、缩小和重置缩放比例
- ✅ **页数统计**：实时显示文档总页数
- ✅ **字数统计**：显示字符数和字数统计
- ✅ **位置配置**：支持底部和工具栏下方两种位置
- ✅ **范围限制**：可配置最小/最大缩放比例和步长

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <ZoomBar
      v-model:zoomLevel="zoomLevel"
      :totalPages="totalPages"
      :editor="editor"
    />
  </div>
</template>

<script setup lang="ts">
import { ZoomBar } from '#/components/tiptapPro-tenant/advanced/zoom'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
const zoomLevel = ref(100)
const totalPages = ref(1)
</script>
```

### 在编辑器中使用

```vue
<template>
  <div class="editor-container">
    <EditorContent :editor="editor" />
    <ZoomBar
      v-model:zoomLevel="zoomLevel"
      :totalPages="totalPages"
      :editor="editor"
      :placement="'bottom'"
      :showCharCount="true"
    />
  </div>
</template>
```

### 自定义缩放范围

```vue
<template>
  <ZoomBar
    v-model:zoomLevel="zoomLevel"
    :totalPages="totalPages"
    :editor="editor"
    :min="25"
    :max="300"
    :step="5"
  />
</template>
```

## API

### ZoomBar

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| zoomLevel | `number` | - | 当前缩放比例（双向绑定） |
| totalPages | `number` | - | 文档总页数 |
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |
| showCharCount | `boolean` | `true` | 是否显示字数统计 |
| min | `number` | `50` | 最小缩放比例 |
| max | `number` | `200` | 最大缩放比例 |
| step | `number` | `10` | 缩放步长 |
| placement | `'bottom' \| 'belowToolbar'` | `'belowToolbar'` | 缩放栏位置 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:zoomLevel | `(value: number)` | 缩放比例更新事件 |
| change | `(value: number)` | 缩放比例变化事件 |
| reset | `(value: number)` | 重置缩放事件 |

#### 功能

- **放大按钮（+）**：点击放大文档，每次增加 `step` 值，最大不超过 `max`
- **缩小按钮（-）**：点击缩小文档，每次减少 `step` 值，最小不低于 `min`
- **重置按钮**：点击重置缩放比例为 100%
- **缩放显示**：显示当前缩放比例（如：100%）
- **页数信息**：显示文档总页数（如：共 5 页）
- **字数统计**：显示字符数和字数（需要编辑器支持 `characterCount` 扩展）

## 样式配置

缩放栏的样式通过 `zoom-toolbar.css` 文件定义，支持：

- **默认样式**：工具栏下方位置，带边框和背景
- **底部样式**：底部位置，粘性定位，带阴影和圆角
- **暗色模式**：自动适配暗色主题

## 注意事项

1. 缩放功能需要配合 CSS `transform: scale()` 使用，确保父容器支持缩放
2. 字数统计功能需要编辑器配置 `CharacterCount` 扩展
3. 页数统计需要手动计算或通过其他方式获取
4. 样式文件已自动导入，无需手动引入
5. 多语言支持已集成到 `locales` 模块中

## 使用示例

### 完整编辑器集成

```vue
<template>
  <div class="tiptap-pro-editor word-mode" :class="{ 'zoombar-bottom': zoomBarPlacement === 'bottom' }">
    <!-- 工具栏 -->
    <ProToolbar v-if="editor" :editor="editor" />
    
    <!-- 文档内容 -->
    <div class="word-document-container">
      <div class="document-pages" :style="{ transform: `scale(${zoomLevel / 100})` }">
        <EditorContent :editor="editor" />
      </div>
    </div>
    
    <!-- 缩放控制 -->
    <ZoomBar
      v-model:zoomLevel="zoomLevel"
      :totalPages="totalPages"
      :editor="editor"
      :placement="zoomBarPlacement"
    />
  </div>
</template>

<script setup lang="ts">
import { ZoomBar } from '#/components/tiptapPro-tenant/advanced/zoom'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'

const editor = useEditor({
  extensions: [
    StarterKit,
    CharacterCount,
    // ... 其他扩展
  ],
})

const zoomLevel = ref(100)
const zoomBarPlacement = ref<'bottom' | 'belowToolbar'>('bottom')
const totalPages = computed(() => {
  // 计算总页数逻辑
  return 1
})
</script>
```

## 文件结构

```
zoom/
├── ZoomBar.vue          # 缩放控制栏组件
├── index.ts             # 统一导出
└── README.md            # 说明文档
```

## 样式文件

样式文件位于 `shared/styles/zoom-toolbar.css`，包含：

- `.zoom-controls` - 缩放控制栏基础样式
- `.zoom-level` - 缩放比例显示样式
- `.page-info` - 页数信息样式
- `.char-count` - 字数统计样式
- `.zoom-controls--bottom` - 底部位置变体样式

## 技术实现

- 使用 `v-model:zoomLevel` 实现双向绑定
- 使用 `computed` 计算字符数和字数
- 通过 CSS `transform: scale()` 实现缩放效果
- 支持响应式布局和暗色模式


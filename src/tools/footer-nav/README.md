# Footer Nav - 底部导航组件

底部导航组件提供了文档缩放、页数统计和字数统计功能，固定在页面底部显示。

## 功能特性

- ✅ **缩放控制**：支持放大、缩小和重置缩放比例
- ✅ **页数统计**：实时显示文档总页数
- ✅ **字数统计**：显示字符数和字数统计
- ✅ **底部固定**：使用粘性定位，始终显示在页面底部
- ✅ **响应式设计**：适配不同屏幕尺寸
- ✅ **暗色模式**：自动适配暗色主题

## 使用方法

### 基础用法

```vue
<template>
  <div class="editor-container">
    <EditorContent :editor="editor" />
    <FooterNav
      v-model:zoomLevel="zoomLevel"
      :totalPages="totalPages"
      :editor="editor"
    />
  </div>
</template>

<script setup lang="ts">
import { FooterNav } from '#/components/tiptapPro-tenant/tools/footer-nav'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
const zoomLevel = ref(100)
const totalPages = ref(1)
</script>
```

### 自定义缩放范围

```vue
<template>
  <FooterNav
    v-model:zoomLevel="zoomLevel"
    :totalPages="totalPages"
    :editor="editor"
    :min="25"
    :max="300"
    :step="5"
  />
</template>
```

### 隐藏字数统计

```vue
<template>
  <FooterNav
    v-model:zoomLevel="zoomLevel"
    :totalPages="totalPages"
    :editor="editor"
    :showCharCount="false"
  />
</template>
```

## API

### FooterNav

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

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:zoomLevel | `(value: number)` | 缩放比例更新事件 |
| change | `(value: number)` | 缩放比例变化事件 |
| reset | `(value: number)` | 重置缩放事件 |

## 样式说明

底部导航的样式通过 `footer-nav.css` 文件定义，包含：

- **底部固定定位**：使用 `position: sticky` 和 `bottom: 0` 固定在底部
- **顶部边框和圆角**：顶部边框和圆角设计，与页面内容区分
- **阴影效果**：轻微阴影提升视觉层次
- **响应式布局**：适配平板和移动端
- **暗色模式**：自动适配暗色主题

### 样式类

- `.footer-nav-container` - 底部导航容器
- `.zoom-controls` - 缩放控制栏（继承自 ZoomBar）
- `.zoom-level` - 缩放比例显示
- `.page-info` - 页数信息
- `.char-count` - 字数统计

## 注意事项

1. **缩放功能**：缩放功能需要配合 CSS `transform: scale()` 使用，确保父容器支持缩放
2. **字数统计**：字数统计功能需要编辑器配置 `CharacterCount` 扩展
3. **页数统计**：页数统计需要手动计算或通过其他方式获取
4. **样式导入**：样式文件已自动导入，无需手动引入
5. **多语言支持**：多语言支持已集成到 `locales` 模块中

## 完整示例

```vue
<template>
  <div class="tiptap-pro-editor word-mode">
    <!-- 工具栏 -->
    <ToolbarNav v-if="editor" :editor="editor" />
    
    <!-- 文档内容 -->
    <div class="word-document-container">
      <div class="document-pages" :style="{ transform: `scale(${zoomLevel / 100})` }">
        <EditorContent :editor="editor" />
      </div>
    </div>
    
    <!-- 底部导航 -->
    <FooterNav
      v-model:zoomLevel="zoomLevel"
      :totalPages="totalPages"
      :editor="editor"
    />
  </div>
</template>

<script setup lang="ts">
import { FooterNav } from '#/components/tiptapPro-tenant/tools/footer-nav'
import { ToolbarNav } from '#/components/tiptapPro-tenant/tools/header-nav'
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
const totalPages = computed(() => {
  // 计算总页数逻辑
  return 1
})
</script>
```

## 文件结构

```
footer-nav/
├── FooterNav.vue      # 底部导航组件
├── footer-nav.css     # 底部导航样式
├── index.ts           # 统一导出
└── README.md          # 说明文档
```

## 技术实现

- 使用 `ZoomBar` 组件实现缩放功能
- 使用 `position: sticky` 实现底部固定
- 使用 `v-model:zoomLevel` 实现双向绑定
- 支持响应式布局和暗色模式
- 样式迁移自 `tiptapPro` 的 `zoom-toolbar.css`


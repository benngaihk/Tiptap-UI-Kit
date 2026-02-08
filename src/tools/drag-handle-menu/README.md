# Drag Handle Menu - 六个点功能

## 功能说明

拖拽手柄菜单（六个点功能）为编辑器中的块级元素提供快速操作菜单。当鼠标悬停在块级元素上时，会在左侧显示六个点图标，点击后弹出操作菜单。

## 主要特性

- **六个点显示**：在块级元素左侧显示可点击的六个点图标
- **操作菜单**：点击六个点后显示包含多种编辑操作的菜单
- **智能定位**：菜单自动调整位置，避免溢出屏幕
- **丰富的操作**：
  - 标题级别切换（H1-H3）
  - 文本格式（粗体、斜体、下划线、删除线）
  - 列表操作（有序列表、无序列表、任务列表）
  - 对齐和缩进
  - 颜色设置（文本颜色、高亮颜色）
  - 编辑操作（剪切、复制、删除）

## 文件结构

```
drag-handle-menu/
├── DragHandleMenu.vue              # 菜单组件
├── DragHandleWithMenuExtension.ts  # 六个点显示扩展
├── dragHandleMenuConfig.ts         # 菜单配置
├── index.ts                        # 统一导出
└── README.md                       # 说明文档
```

## 使用方法

### 1. 导入扩展和组件

```typescript
import { DragHandleWithMenuExtension, DragHandleMenu } from '@/components/tiptapPro-tenant/tools/drag-handle-menu'
```

### 2. 在编辑器中使用扩展

```typescript
import { useEditor } from '@tiptap/vue-3'
import { DragHandleWithMenuExtension } from '@/components/tiptapPro-tenant/tools/drag-handle-menu'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    DragHandleWithMenuExtension.configure({
      onHandleClick: (event) => {
        // 处理六个点点击事件
        // 可以通过 ref 调用 DragHandleMenu 的 handleDragHandleClick 方法
      }
    })
  ]
})
```

### 3. 在模板中使用菜单组件

```vue
<template>
  <div>
    <editor-content :editor="editor" />
    <DragHandleMenu
      ref="dragHandleMenuRef"
      :editor="editor"
      :position-strategy="'auto'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DragHandleMenu } from '@/components/tiptapPro-tenant/tools/drag-handle-menu'
import { DragHandleWithMenuExtension } from '@/components/tiptapPro-tenant/tools/drag-handle-menu'

const dragHandleMenuRef = ref<InstanceType<typeof DragHandleMenu>>()

// 在扩展配置中连接菜单
const editor = useEditor({
  extensions: [
    DragHandleWithMenuExtension.configure({
      onHandleClick: (event) => {
        dragHandleMenuRef.value?.handleDragHandleClick(event)
      }
    })
  ]
})
</script>
```

## 配置选项

### DragHandleWithMenuExtension 配置

```typescript
interface DragHandleWithMenuOptions {
  onHandleClick?: (event: DragHandleClickEvent) => void
}
```

### DragHandleMenu 组件 Props

```typescript
interface Props {
  editor: Editor | null | undefined
  readonly?: boolean                    // 是否只读，默认 false
  positionStrategy?: 'auto' | 'right' | 'left'  // 菜单位置策略，默认 'auto'
}
```

## 样式说明

样式文件位于 `shared/styles/drag-handle-with-menu.css`，包含：

- 六个点图标样式
- 菜单容器样式
- 菜单项样式
- 颜色选择器样式
- 响应式设计
- 暗黑模式支持

## 注意事项

1. **样式依赖**：确保已导入 `drag-handle-with-menu.css` 样式文件
2. **国际化**：菜单文本使用 `t()` 函数进行国际化，确保已配置 locales
3. **编辑器扩展**：某些功能（如颜色、对齐）需要相应的 Tiptap 扩展支持
4. **事件处理**：六个点点击事件需要通过 `onHandleClick` 回调连接到菜单组件

## 技术实现

- **六个点显示**：使用 ProseMirror 的 Decoration 系统在块级元素上添加装饰
- **菜单定位**：根据手柄位置和屏幕尺寸自动计算菜单位置
- **状态管理**：使用 Vue 3 Composition API 管理菜单状态
- **工具函数**：使用共享的 `editorState`、`editorCommands`、`clipboard` 工具函数

## 相关文件

- 样式文件：`shared/styles/drag-handle-with-menu.css`
- 工具函数：`shared/utils/editorState.ts`、`shared/utils/editorCommands.ts`、`shared/utils/clipboard.ts`
- 国际化：`locales/index.ts`


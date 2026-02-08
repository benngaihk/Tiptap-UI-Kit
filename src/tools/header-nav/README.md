# Header Nav - 头部导航工具栏

可配置的公共工具栏组件，支持通过配置控制显示哪些工具。

## 功能特性

- ✅ 可配置的工具显示控制
- ✅ 支持基础版、进阶版等预设配置
- ✅ 支持自定义配置
- ✅ 支持通过插槽扩展额外工具
- ✅ 统一的样式和交互体验

## 使用方法

### 基础用法（使用默认配置）

```vue
<template>
  <ToolbarNav :editor="editor" />
</template>

<script setup lang="ts">
import { ToolbarNav } from '#/components/tiptapPro-tenant/tools/header-nav'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 使用预设配置

```vue
<template>
  <!-- 基础版配置 -->
  <ToolbarNav :editor="editor" :config="BASIC_TOOLBAR_CONFIG" />
  
  <!-- 进阶版配置 -->
  <ToolbarNav :editor="editor" :config="ADVANCED_TOOLBAR_CONFIG" />
</template>

<script setup lang="ts">
import {
  ToolbarNav,
  BASIC_TOOLBAR_CONFIG,
  ADVANCED_TOOLBAR_CONFIG,
} from '#/components/tiptapPro-tenant/tools/header-nav'
</script>
```

### 自定义配置

```vue
<template>
  <ToolbarNav
    :editor="editor"
    :config="{
      textFormat: true,
      colorPicker: true,
      heading: true,
      list: true,
      align: true,
      image: false,
      codeBlock: true,
    }"
  />
</template>

<script setup lang="ts">
import { ToolbarNav, type ToolbarToolsConfig } from '#/components/tiptapPro-tenant/tools/header-nav'

const customConfig: ToolbarToolsConfig = {
  textFormat: true,
  colorPicker: true,
  heading: true,
  list: true,
  align: true,
  image: false,
  codeBlock: true,
  link: true,
  table: true,
}
</script>
```

### 通过插槽扩展额外工具

```vue
<template>
  <ToolbarNav :editor="editor" :config="config">
    <template #extra>
      <div class="tool-group">
        <!-- 自定义工具 -->
        <CustomTool :editor="editor" />
      </div>
    </template>
  </ToolbarNav>
</template>
```

## 配置选项

### ToolbarToolsConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| textFormat | `boolean` | `true` | 是否显示文本格式工具（粗体、斜体、下划线、删除线） |
| colorPicker | `boolean` | `true` | 是否显示颜色选择器（文本颜色、背景颜色） |
| heading | `boolean` | `true` | 是否显示标题下拉菜单 |
| list | `boolean` | `true` | 是否显示列表工具（有序、无序、任务列表） |
| align | `boolean` | `true` | 是否显示对齐工具 |
| image | `boolean` | `true` | 是否显示图片上传工具 |
| codeBlock | `boolean` | `false` | 是否显示代码块工具 |
| link | `boolean` | `false` | 是否显示链接工具 |
| table | `boolean` | `false` | 是否显示表格工具 |
| undoRedo | `boolean` | `false` | 是否显示撤销/重做工具 |
| clearFormat | `boolean` | `false` | 是否显示清除格式工具 |
| font | `boolean` | `false` | 是否显示字体工具 |
| lineHeight | `boolean` | `false` | 是否显示行距工具 |
| subscriptSuperscript | `boolean` | `false` | 是否显示下标/上标工具 |

## 预设配置

### BASIC_TOOLBAR_CONFIG

基础版工具栏配置，包含：
- 文本格式工具
- 颜色选择器
- 标题下拉菜单
- 列表工具
- 对齐工具
- 图片上传工具

### ADVANCED_TOOLBAR_CONFIG

进阶版工具栏配置，包含所有工具。

### DEFAULT_TOOLBAR_CONFIG

默认工具栏配置，与基础版相同。

## 文件结构

```
header-nav/
├── ToolbarNav.vue          # 公共工具栏组件
├── toolbarConfig.ts        # 工具栏配置类型和预设
├── index.ts                # 统一导出
└── README.md               # 说明文档
```

## 迁移说明

`BasicToolbar.vue` 已完全迁移到 `ToolbarNav.vue`，原 `BasicToolbar.vue` 文件已删除：

```vue
<template>
  <ToolbarNav :editor="editor" :config="toolbarConfig">
    <template #extra>
      <slot name="extra" />
    </template>
  </ToolbarNav>
</template>

<script setup lang="ts">
import { ToolbarNav, BASIC_TOOLBAR_CONFIG } from '../tools/header-nav'

const toolbarConfig = computed(() => ({
  ...BASIC_TOOLBAR_CONFIG,
  ...props.config, // 支持自定义配置
}))
</script>
```

## 注意事项

1. 所有工具栏逻辑已迁移到 `ToolbarNav.vue`，`BasicToolbar.vue` 文件已删除
2. 如需使用基础版工具栏配置，请使用 `BASIC_TOOLBAR_CONFIG`
2. 可以通过 `config` prop 自定义显示哪些工具
3. 支持通过 `extra` 插槽扩展额外工具
4. 颜色选择器会自动同步编辑器状态


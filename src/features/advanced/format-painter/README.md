# Format Painter - 格式刷功能模块

格式刷功能模块提供了在编辑器中进行格式采样和应用的能力，类似于 Microsoft Word 中的格式刷功能。

## 功能特性

- ✅ **格式采样**：采样选中文本的所有格式信息，包括文本样式、颜色、字体、对齐等
- ✅ **单次应用模式**：单击格式刷按钮，采样格式后可以应用一次，应用后自动退出
- ✅ **连续应用模式**：双击格式刷按钮，采样格式后可以连续应用到多个目标文本
- ✅ **自动应用**：格式刷激活后，选中目标文本时会自动应用格式
- ✅ **键盘退出**：按 `ESC` 键可以退出格式刷模式
- ✅ **状态检测**：自动检测格式刷是否激活，按钮状态实时更新
- ✅ **协作模式检测**：自动检测协作编辑模式，在协作模式下禁用格式刷功能
- ✅ **本地存储**：格式信息会保存到浏览器本地存储，刷新页面后仍可使用

## 使用方法

### 基础用法

```vue
<template>
  <div>
    <FormatPainterButton :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { FormatPainterButton } from '#/components/tiptapPro-tenant/advanced/format-painter'
import type { Editor } from '@tiptap/vue-3'

const editor = ref<Editor | null>(null)
</script>
```

### 在工具栏中使用

```vue
<template>
  <ToolbarNav :editor="editor" :config="{ formatPainter: true }">
    <template #extra>
      <FormatPainterButton :editor="editor" />
    </template>
  </ToolbarNav>
</template>
```

### 在编辑器中使用扩展

```vue
<template>
  <EditorContent :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { FormatPainter } from '#/components/tiptapPro-tenant/advanced/format-painter'

const editor = useEditor({
  extensions: [
    StarterKit,
    FormatPainter,
    // ... 其他扩展
  ],
})
</script>
```

## API

### FormatPainterButton

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| editor | `Editor \| null \| undefined` | - | Tiptap 编辑器实例 |

#### 功能

- **单击按钮（单次模式）**：
  - 如果格式刷未激活：采样当前选中文本的格式，激活格式刷（单次模式）
  - 如果格式刷已激活：取消格式刷状态
- **双击按钮（连续模式）**：
  - 如果格式刷未激活：采样当前选中文本的格式，激活格式刷（连续模式）
  - 如果格式刷已激活：取消格式刷状态
- **自动状态更新**：按钮的激活状态会根据格式刷的激活状态自动更新
- **协作模式检测**：在协作编辑模式下，按钮会被禁用并显示提示信息

### FormatPainter Extension

#### 命令

| 命令 | 说明 |
|------|------|
| `startFormatPainting(mode?: 1 \| 2)` | 开启格式刷并采样当前选区样式，mode=1 为单次模式（默认），mode=2 为连续模式 |
| `startContinuousFormatPainting()` | 开启格式刷连续应用模式 |
| `applyFormat()` | 将采样到的样式应用到当前选区 |
| `cancelFormatPainting()` | 取消格式刷状态并清除缓存 |
| `toggleContinuousMode()` | 切换连续应用模式 |

#### Storage

```typescript
interface FormatPainterStorage {
  /** 格式刷是否激活 */
  isActive: boolean
  /** 是否为连续应用模式 */
  isContinuous: boolean
  /** 采样的格式 */
  formats: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strike?: boolean
    subscript?: boolean
    superscript?: boolean
    color?: string | null
    highlight?: string | null
    fontFamily?: string | null
    fontSize?: string | null
    textAlign?: 'left' | 'center' | 'right' | 'justify' | null
    lineHeight?: string | null
  }
}
```

## 使用流程

### 单次应用模式

1. 选中要采样的文本（包含目标格式）
2. 单击格式刷按钮
3. 选中要应用格式的目标文本
4. 格式会自动应用到目标文本，格式刷自动退出

### 连续应用模式

1. 选中要采样的文本（包含目标格式）
2. 双击格式刷按钮
3. 连续选中多个要应用格式的目标文本
4. 每次选中文本时，格式会自动应用
5. 按 `ESC` 键或再次单击格式刷按钮退出格式刷模式

## 支持的格式

格式刷支持采样和应用以下格式：

- **文本样式**：粗体、斜体、下划线、删除线、上标、下标
- **颜色**：文本颜色、背景高亮颜色
- **字体**：字体家族、字号
- **段落格式**：文本对齐（左对齐、居中、右对齐、两端对齐）、行距

## 键盘快捷键

- `ESC`：退出格式刷模式

## 注意事项

1. 格式刷功能依赖于 Tiptap 的多个扩展，确保编辑器已正确配置相关扩展：
   - `Bold`、`Italic`、`Underline`、`Strike`（文本样式）
   - `Subscript`、`Superscript`（上下标）
   - `TextStyle`、`Color`、`Highlight`（颜色）
   - `FontFamily`、`FontSize`（字体）
   - `TextAlign`、`LineHeight`（段落格式）

2. 在协作编辑模式下，格式刷功能会被自动禁用，按钮会显示禁用状态

3. 格式信息会保存到浏览器本地存储（localStorage），键名为 `tiptap-format-painter-formats`

4. 格式刷激活时，编辑器光标会显示为格式刷样式（通过 CSS 类 `cursor-format-painter`）

5. 多语言支持已集成到 `locales` 模块中，包括：
   - `editor.formatPainter` - 格式刷
   - `editor.pleaseSelectTextToSample` - 请先选择要采样的文本
   - `editor.sampleSuccessSingle` - 格式采样成功（单次模式）
   - `editor.sampleSuccessContinuous` - 格式采样成功（连续模式）
   - `editor.formatPainterExited` - 已退出格式刷模式
   - `editor.collaborationNoFormatPainter` - 协作模式下不支持格式刷功能

## 文件结构

```
format-painter/
├── FormatPainterButton.vue  # 格式刷按钮组件
├── formatPainter.ts          # 格式刷扩展实现
├── index.ts                  # 统一导出
└── README.md                 # 说明文档
```

## 技术实现

- 使用 Tiptap Extension API 实现格式采样和应用逻辑
- 使用 ProseMirror Plugin 监听键盘和鼠标事件
- 使用响应式 ref 和编辑器事件订阅实现状态同步
- 使用浏览器 localStorage 实现格式信息的持久化存储
- 通过 CSS 类名实现格式刷激活时的光标样式变化


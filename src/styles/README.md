# TiptapPro 样式文件

## 文件结构

```
styles/
├── base.css                    # 🆕 公共基础样式（变量、混入、动画）
├── word-mode.css               # Word 模式编辑器样式
├── toolbar.css                 # 主工具栏样式
├── bubble-menu.css             # 悬浮气泡菜单
├── floating-menu-toolbar.css   # 浮动菜单
├── table-bubble-menu.css       # 表格工具栏
├── table-insert-plus.css       # 表格插入功能
├── image-toolbar.css           # 图片工具栏
├── drag-handle-with-menu.css   # 拖拽手柄菜单
├── zoom-toolbar.css            # 缩放工具栏
└── collaboration.css           # 协作编辑光标
```

## 公共样式 (base.css)

### CSS 变量

```css
/* 基础色彩 */
--tp-color-text         /* 主文字颜色 */
--tp-color-text-secondary  /* 次要文字 */
--tp-color-bg           /* 背景色 */
--tp-color-bg-hover     /* 悬停背景 */
--tp-color-border       /* 边框色 */

/* 主题色 */
--tp-color-primary      /* 主色调 */
--tp-color-primary-bg   /* 主色背景 */
--tp-color-danger       /* 危险色 */
--tp-color-danger-bg    /* 危险背景 */

/* 菜单样式 */
--tp-menu-bg            /* 菜单背景 */
--tp-menu-shadow        /* 菜单阴影 */
--tp-menu-radius        /* 菜单圆角 */

/* 按钮尺寸 */
--tp-btn-size           /* 按钮大小 */
--tp-btn-size-sm        /* 小按钮 */
--tp-btn-icon-size      /* 图标大小 */

/* 动画时长 */
--tp-transition-fast    /* 快速过渡 */
--tp-transition-normal  /* 正常过渡 */
```

### 公共类

| 类名 | 说明 |
|------|------|
| `.tp-menu` | 菜单容器 |
| `.tp-menu-content` | 菜单内容 |
| `.tp-menu-group` | 菜单分组 |
| `.tp-btn` | 公共按钮 |
| `.tp-btn.active` | 激活状态 |
| `.tp-btn--danger` | 危险按钮 |
| `.tp-color-panel` | 颜色选择面板 |
| `.tp-color-item` | 颜色项 |
| `.tp-dropdown-menu` | 下拉菜单 |
| `.tp-dropdown-item` | 下拉菜单项 |

### 公共动画

```css
@keyframes tp-fade-in    /* 淡入 */
@keyframes tp-slide-in   /* 滑入 */
@keyframes tp-blink      /* 闪烁 */
```

### 工具类

| 类名 | 说明 |
|------|------|
| `.tp-flex-center` | Flex 居中 |
| `.tp-hidden` | 隐藏元素 |
| `.tp-visible` | 显示元素 |

## 使用方式

1. **在组件中引入**：

```typescript
// 引入公共基础样式
import '../shared/styles/base.css'

// 引入特定模块样式
import '../shared/styles/bubble-menu.css'
```

2. **在 word-mode.css 中已包含完整主题变量**，其他模块样式通过 CSS 变量复用。

## 深色模式

所有样式均支持深色模式，通过 `:where(.dark, .dark *)` 选择器实现：

```css
:where(.dark, .dark *) .my-component {
  background: var(--tp-menu-bg);
  color: var(--tp-color-text);
}
```

## 响应式断点

- `768px` - 移动端断点
- `480px` - 小屏手机断点

## 优化记录

### 2024-12 重构

- ✅ 新增 `base.css` 统一管理公共样式
- ✅ 提取公共 CSS 变量（`--tp-*` 前缀）
- ✅ 统一菜单、按钮、颜色面板样式
- ✅ 合并重复的深色模式样式
- ✅ 合并重复的响应式断点

**文件行数对比**：

| 文件 | 优化前 | 优化后 | 减少 |
|------|--------|--------|------|
| bubble-menu.css | 77 | 52 | 32% |
| floating-menu-toolbar.css | 205 | 110 | 46% |
| table-bubble-menu.css | 190 | 130 | 32% |
| drag-handle-with-menu.css | 527 | 320 | 39% |
| **新增 base.css** | - | 180 | - |

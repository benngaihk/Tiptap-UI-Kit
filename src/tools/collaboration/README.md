# Collaboration - 协作编辑工具模块

提供基于 Yjs + WebSocket 的实时协作编辑功能。

## 功能特性

- ✅ **实时同步**: 基于 Yjs CRDT 的实时文档同步
- ✅ **多用户协作**: 支持多用户同时编辑同一文档
- ✅ **用户光标**: 显示其他用户的编辑光标和选区
- ✅ **用户列表**: 实时追踪在线用户列表
- ✅ **智能初始化**: 自动处理新文档和已有文档的初始化逻辑
- ✅ **开关控制**: 提供开关组件，用户可控制开启/关闭（默认关闭）

## 使用方法

### 使用开关组件（推荐）

最简单的方式是使用 `CollaborationToggle` 组件，它提供了完整的开启/关闭控制：

```vue
<template>
  <div>
    <!-- 协作编辑开关 -->
    <CollaborationToggle
      v-model="collaborationEnabled"
      :options="collaborationOptions"
      :collaborators-count="collaboratorsCount"
      show-label
      @enabled="handleEnabled"
      @disabled="handleDisabled"
    />
    
    <!-- 编辑器 -->
    <TiptapEditor :features="{ collaboration: collaborationEnabled }" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CollaborationToggle } from './tools/collaboration'
import { useUserStore } from '@vben/stores'

const userStore = useUserStore()
const collaborationEnabled = ref(false) // 默认关闭

const collaborationOptions = {
  documentId: 'doc-123',
  readonly: false,
  initialContent: '<p>初始内容</p>',
  editor: editorInstance,
  getUserInfo: () => ({
    id: userStore.userInfo?.userId || 'anonymous',
    name: userStore.userInfo?.realName || '匿名用户',
  }),
  onCollaboratorsChange: (count) => {
    collaboratorsCount.value = count
  },
}

const collaboratorsCount = ref(0)

function handleEnabled() {
  console.log('协作编辑已开启')
}

function handleDisabled() {
  console.log('协作编辑已关闭')
}
</script>
```

### 使用 Composable

如果需要更细粒度的控制，可以使用 `useCollaboration` composable：

```vue
<script setup lang="ts">
import { useCollaboration } from './tools/collaboration'
import { useUserStore } from '@vben/stores'

const userStore = useUserStore()
const { enabled, connected, enable, disable } = useCollaboration()

// 开启协作编辑
const handleEnable = async () => {
  await enable({
    documentId: 'doc-123',
    editor: editorInstance,
    getUserInfo: () => ({
      id: userStore.userInfo?.userId || 'anonymous',
      name: userStore.userInfo?.realName || '匿名用户',
    }),
  })
}

// 关闭协作编辑
const handleDisable = () => {
  disable()
}
</script>
```

### 基础用法

```typescript
import { initCollaboration, createCollaborationExtensions } from './tools/collaboration'
import { useUserStore } from '@vben/stores'

const userStore = useUserStore()

// 获取用户信息
const getUserInfo = () => {
  const userInfo = userStore.userInfo
  return {
    name: userInfo?.realName || userInfo?.userName || '匿名用户',
    id: userInfo?.userId || Math.random().toString(36).substring(7),
  }
}

// 初始化协作编辑
const collaborationInstance = await initCollaboration({
  documentId: 'doc-123',
  readonly: false,
  initialContent: '<p>初始内容</p>',
  editor: editorInstance,
  getUserInfo,
  onCollaboratorsChange: (count) => {
    console.log('在线用户数:', count)
  },
  onCollaboratorsListChange: (users) => {
    console.log('在线用户列表:', users)
  },
})

// 创建协作编辑扩展
if (collaborationInstance) {
  const extensions = await createCollaborationExtensions(
    collaborationInstance,
    getUserInfo
  )
  // 将扩展添加到编辑器
  editor.use(...extensions)
}
```

### 在编辑器中使用

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { initCollaboration, createCollaborationExtensions } from './tools/collaboration'
import { useUserStore } from '@vben/stores'

const props = defineProps<{
  documentId: string
  initialContent?: string
}>()

const editor = ref<Editor | null>(null)
const collaborationInstance = ref<any>(null)
const userStore = useUserStore()

const getUserInfo = () => {
  const userInfo = userStore.userInfo
  return {
    name: userInfo?.realName || userInfo?.userName || '匿名用户',
    id: userInfo?.userId || Math.random().toString(36).substring(7),
  }
}

onMounted(async () => {
  // 初始化编辑器
  editor.value = new Editor({
    extensions: [...],
  })

  // 初始化协作编辑
  if (props.documentId) {
    collaborationInstance.value = await initCollaboration({
      documentId: props.documentId,
      initialContent: props.initialContent,
      editor: editor.value,
      getUserInfo,
    })

    // 添加协作扩展
    if (collaborationInstance.value) {
      const extensions = await createCollaborationExtensions(
        collaborationInstance.value,
        getUserInfo
      )
      editor.value.extensionManager.extensions.push(...extensions)
    }
  }
})

onBeforeUnmount(() => {
  // 清理协作编辑资源
  if (collaborationInstance.value) {
    collaborationInstance.value.destroy()
  }
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>
```

## API 参考

### `CollaborationToggle` 组件

协作编辑开关组件，提供可视化的开启/关闭控制。

**Props:**

- `modelValue` (boolean, 可选): 是否启用（v-model 绑定），默认 `false`
- `options` (CollaborationInitOptions, 可选): 协作编辑初始化选项
- `disabled` (boolean, 可选): 是否禁用，默认 `false`
- `showLabel` (boolean, 可选): 是否显示标签，默认 `false`
- `collaboratorsCount` (number, 可选): 在线用户数，默认 `0`

**Events:**

- `update:modelValue`: 状态变化时触发
- `change`: 状态变化时触发，参数为 `boolean`
- `enabled`: 协作编辑开启时触发
- `disabled`: 协作编辑关闭时触发

**示例:**

```vue
<CollaborationToggle
  v-model="enabled"
  :options="options"
  :collaborators-count="count"
  @enabled="handleEnabled"
/>
```

### `useCollaboration()` Composable

协作编辑状态管理 composable。

**返回值:**

- `enabled` (ComputedRef<boolean>): 是否启用
- `connected` (ComputedRef<boolean>): 是否已连接
- `initializing` (ComputedRef<boolean>): 是否正在初始化
- `instance` (ComputedRef<CollaborationInstance | null>): 协作编辑实例
- `enable(options)`: 开启协作编辑
- `disable()`: 关闭协作编辑
- `toggle(options?)`: 切换状态
- `reset()`: 重置状态

**示例:**

```typescript
const { enabled, enable, disable } = useCollaboration()
```

### `initCollaboration(options)`

初始化协作编辑功能。

**参数:**

- `options.documentId` (string, 必需): 文档ID，用于创建 WebSocket 房间
- `options.readonly` (boolean, 可选): 是否为只读模式，默认为 `false`
- `options.initialContent` (string | object, 可选): 初始内容，用于新文档或单人编辑场景
- `options.editor` (Editor, 可选): 编辑器实例，用于设置初始内容
- `options.getUserInfo` (() => UserInfo, 可选): 用户信息获取函数
- `options.onCollaboratorsChange` ((count: number) => void, 可选): 在线用户数变化回调
- `options.onCollaboratorsListChange` ((users: CollaboratorInfo[]) => void, 可选): 在线用户列表变化回调

**返回:**

- `CollaborationInstance | null`: 协作编辑实例，包含 `doc`、`provider` 和 `destroy` 方法

### `createCollaborationExtensions(instance, getUserInfo)`

创建协作编辑扩展配置。

**参数:**

- `instance` (CollaborationInstance | null): 协作编辑实例
- `getUserInfo` (() => UserInfo, 可选): 用户信息获取函数

**返回:**

- `Promise<Extension[]>`: Tiptap 扩展配置数组

### `getRandomColor()`

生成随机颜色，用于协作用户光标和选区高亮。

**返回:**

- `string`: 颜色值（十六进制）

## 类型定义

### `CollaboratorInfo`

协作用户信息。

```typescript
interface CollaboratorInfo {
  id: string | number
  name: string
  color: string
}
```

### `UserInfo`

用户信息（用于设置 awareness）。

```typescript
interface UserInfo {
  id: string | number
  name: string
}
```

### `CollaborationInstance`

协作编辑实例。

```typescript
interface CollaborationInstance {
  doc: any // Yjs 文档实例
  provider: any // WebSocket Provider 实例
  destroy: () => void // 销毁函数
}
```

## 样式

协作编辑模块包含以下样式：

- `.collaboration-cursor__caret`: 用户光标样式
- `.collaboration-cursor__label`: 用户名标签样式
- `.collaboration-cursor__selection`: 用户选区高亮样式

样式文件位于 `collaboration.css`，需要在项目中导入：

```typescript
import './tools/collaboration/collaboration.css'
```

## 注意事项

1. **WebSocket URL**: 需要确保 `#/api/document/websocket` 中的 `getWebSocketUrl` 函数可用
2. **文档ID**: 每个文档需要唯一的 `documentId`，用于创建独立的 WebSocket 房间
3. **初始内容**: 在多人协作场景下，如果文档已有内容，不会覆盖 Yjs 文档中的内容
4. **用户去重**: 系统会自动按用户ID去重，避免同一用户多个标签页被重复计算
5. **资源清理**: 组件销毁时务必调用 `destroy()` 方法清理 WebSocket 连接和 Yjs 文档

## 依赖

- `yjs`: Yjs CRDT 库
- `y-websocket`: Yjs WebSocket Provider
- `@tiptap/extension-collaboration`: Tiptap 协作编辑扩展
- `@tiptap/extension-collaboration-cursor`: Tiptap 协作光标扩展


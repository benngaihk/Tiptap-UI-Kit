<template>
  <teleport to="body">
    <div
      v-if="isVisible"
      ref="menuRef"
      class="slash-command-menu"
      :style="menuStyle"
      @mousedown.prevent
    >
      <!-- 搜索结果 -->
      <div v-if="filteredGroups.length > 0" class="slash-command-list">
        <template v-for="group in filteredGroups" :key="group.title">
          <div class="slash-command-group-title">{{ group.title }}</div>
          <button
            v-for="(item, itemIdx) in group.items"
            :key="item.id"
            class="slash-command-item"
            :class="{ active: isFlatIndex(group, itemIdx) === selectedIndex }"
            @click="selectItem(item)"
            @mouseenter="selectedIndex = isFlatIndex(group, itemIdx)"
          >
            <span class="slash-command-item-icon">
              <component :is="item.icon" />
            </span>
            <span class="slash-command-item-content">
              <span class="slash-command-item-title">{{ item.title }}</span>
              <span class="slash-command-item-desc">{{ item.description }}</span>
            </span>
          </button>
        </template>
      </div>

      <!-- 无结果 -->
      <div v-else class="slash-command-empty">
        {{ t('slashCommand.noResults') }}
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="isVisible" class="slash-command-backdrop" @mousedown="hide" />
  </teleport>
</template>

<script setup lang="ts">
/**
 * SlashCommandMenu - 斜杠命令菜单组件
 * @description 输入 / 时弹出的块类型选择菜单
 */
import { computed, ref, watch, nextTick, onMounted, onUnmounted, type Component } from 'vue'
import type { Editor } from '@tiptap/core'
import { t } from '@/locales'
import { slashCommandKey, type SlashCommandState } from './SlashCommandExtension'
import {
  FileTextOutlined,
  FontSizeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  LineOutlined,
  CodeOutlined,
  TableOutlined,
  PictureOutlined,
  MinusOutlined,
} from '@ant-design/icons-vue'

// ============================================================================
// Types
// ============================================================================

interface SlashCommandItem {
  id: string
  title: string
  description: string
  icon: Component
  keywords: string[]
  action: (editor: Editor) => void
}

interface SlashCommandGroup {
  title: string
  items: SlashCommandItem[]
}

// ============================================================================
// Props
// ============================================================================

const props = defineProps<{
  editor: Editor | null | undefined
}>()

// ============================================================================
// State
// ============================================================================

const isVisible = ref(false)
const position = ref({ x: 0, y: 0 })
const query = ref('')
const selectedIndex = ref(0)
const menuRef = ref<HTMLElement | null>(null)

// ============================================================================
// Menu Items
// ============================================================================

const commandGroups = computed<SlashCommandGroup[]>(() => [
  {
    title: t('slashCommand.basicBlocks'),
    items: [
      {
        id: 'paragraph',
        title: t('slashCommand.paragraph'),
        description: t('slashCommand.paragraphDesc'),
        icon: FileTextOutlined,
        keywords: ['paragraph', 'text', 'plain', '正文', '段落', 'p'],
        action: (editor: Editor) => {
          editor.chain().focus().setParagraph().run()
        },
      },
      {
        id: 'heading1',
        title: t('slashCommand.heading1'),
        description: t('slashCommand.heading1Desc'),
        icon: FontSizeOutlined,
        keywords: ['heading', 'h1', '标题', '一级标题', 'title'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        },
      },
      {
        id: 'heading2',
        title: t('slashCommand.heading2'),
        description: t('slashCommand.heading2Desc'),
        icon: FontSizeOutlined,
        keywords: ['heading', 'h2', '标题', '二级标题', 'subtitle'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        },
      },
      {
        id: 'heading3',
        title: t('slashCommand.heading3'),
        description: t('slashCommand.heading3Desc'),
        icon: FontSizeOutlined,
        keywords: ['heading', 'h3', '标题', '三级标题'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        },
      },
    ],
  },
  {
    title: t('slashCommand.lists'),
    items: [
      {
        id: 'bulletList',
        title: t('slashCommand.bulletList'),
        description: t('slashCommand.bulletListDesc'),
        icon: UnorderedListOutlined,
        keywords: ['bullet', 'list', 'unordered', '无序列表', '列表', 'ul'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        id: 'orderedList',
        title: t('slashCommand.orderedList'),
        description: t('slashCommand.orderedListDesc'),
        icon: OrderedListOutlined,
        keywords: ['ordered', 'list', 'number', '有序列表', '编号列表', 'ol'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
      {
        id: 'taskList',
        title: t('slashCommand.taskList'),
        description: t('slashCommand.taskListDesc'),
        icon: CheckSquareOutlined,
        keywords: ['task', 'todo', 'checklist', '任务列表', '待办', 'checkbox'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleTaskList().run()
        },
      },
    ],
  },
  {
    title: t('slashCommand.advanced'),
    items: [
      {
        id: 'blockquote',
        title: t('slashCommand.blockquote'),
        description: t('slashCommand.blockquoteDesc'),
        icon: LineOutlined,
        keywords: ['quote', 'blockquote', '引用', '引述', 'citation'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleBlockquote().run()
        },
      },
      {
        id: 'codeBlock',
        title: t('slashCommand.codeBlock'),
        description: t('slashCommand.codeBlockDesc'),
        icon: CodeOutlined,
        keywords: ['code', 'block', '代码块', '代码', 'pre'],
        action: (editor: Editor) => {
          editor.chain().focus().toggleCodeBlock().run()
        },
      },
      {
        id: 'table',
        title: t('slashCommand.table'),
        description: t('slashCommand.tableDesc'),
        icon: TableOutlined,
        keywords: ['table', '表格', 'grid'],
        action: (editor: Editor) => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        },
      },
      {
        id: 'image',
        title: t('slashCommand.image'),
        description: t('slashCommand.imageDesc'),
        icon: PictureOutlined,
        keywords: ['image', 'picture', '图片', '图像', 'img', 'photo'],
        action: (editor: Editor) => {
          // 插入图片占位
          const url = window.prompt(t('slashCommand.imageUrlPrompt') || 'Enter image URL')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        },
      },
      {
        id: 'horizontalRule',
        title: t('slashCommand.horizontalRule'),
        description: t('slashCommand.horizontalRuleDesc'),
        icon: MinusOutlined,
        keywords: ['divider', 'hr', 'horizontal', 'rule', '分割线', '水平线'],
        action: (editor: Editor) => {
          editor.chain().focus().setHorizontalRule().run()
        },
      },
    ],
  },
])

// ============================================================================
// Computed
// ============================================================================

const filteredGroups = computed<SlashCommandGroup[]>(() => {
  const q = query.value.toLowerCase()
  if (!q) return commandGroups.value

  return commandGroups.value
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(q))
      ),
    }))
    .filter((group) => group.items.length > 0)
})

const flatItems = computed(() => {
  return filteredGroups.value.flatMap((group) => group.items)
})

const menuStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  zIndex: 1002,
}))

// ============================================================================
// Methods
// ============================================================================

/**
 * 计算某个 item 在 flatItems 中的索引
 */
function isFlatIndex(group: SlashCommandGroup, itemIdx: number): number {
  let idx = 0
  for (const g of filteredGroups.value) {
    if (g === group) return idx + itemIdx
    idx += g.items.length
  }
  return idx + itemIdx
}

/**
 * 选中菜单项并执行对应操作
 */
function selectItem(item: SlashCommandItem) {
  const editor = props.editor
  if (!editor) return

  // 先删除 / 及其后续查询文本
  const pluginState = slashCommandKey.getState(editor.state) as SlashCommandState | undefined
  if (pluginState?.range) {
    editor.chain().focus().deleteRange(pluginState.range).run()
  }

  // 执行命令
  item.action(editor)
  hide()
}

/**
 * 激活菜单
 */
function activate(state: SlashCommandState) {
  if (!state.decorationPosition) return
  position.value = { x: state.decorationPosition.x, y: state.decorationPosition.y + 4 }
  query.value = state.query
  isVisible.value = true
  selectedIndex.value = 0

  nextTick(() => {
    adjustPosition()
  })
}

/**
 * 隐藏菜单
 */
function hide() {
  if (!isVisible.value) return
  isVisible.value = false
  query.value = ''
  selectedIndex.value = 0

  // 通过 plugin meta 关闭
  const editor = props.editor
  if (editor) {
    const { tr } = editor.state
    tr.setMeta(slashCommandKey, { deactivate: true })
    editor.view.dispatch(tr)
  }
}

/**
 * 更新查询
 */
function updateQuery(newQuery: string) {
  query.value = newQuery
  selectedIndex.value = 0
}

/**
 * 调整菜单位置，避免溢出
 */
function adjustPosition() {
  const el = menuRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 8

  let { x, y } = position.value

  // 右侧溢出
  if (x + rect.width + margin > viewportWidth) {
    x = viewportWidth - rect.width - margin
  }

  // 底部溢出 - 移到光标上方
  if (y + rect.height + margin > viewportHeight) {
    y = y - rect.height - 24 // 光标高度约 24px
  }

  position.value = { x: Math.max(margin, x), y: Math.max(margin, y) }
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

function handleKeyDown(event: KeyboardEvent) {
  if (!isVisible.value) return

  const totalItems = flatItems.value.length
  if (totalItems === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % totalItems
      scrollToSelected()
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + totalItems) % totalItems
      scrollToSelected()
      break
    case 'Enter':
      event.preventDefault()
      if (flatItems.value[selectedIndex.value]) {
        selectItem(flatItems.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      hide()
      break
  }
}

function scrollToSelected() {
  nextTick(() => {
    const el = menuRef.value
    if (!el) return
    const activeItem = el.querySelector('.slash-command-item.active')
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' })
    }
  })
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown, true)
})

// 监听查询变化，重置选中项
watch(query, () => {
  selectedIndex.value = 0
})

// ============================================================================
// Expose
// ============================================================================

defineExpose({
  activate,
  hide,
  updateQuery,
  isVisible,
})
</script>

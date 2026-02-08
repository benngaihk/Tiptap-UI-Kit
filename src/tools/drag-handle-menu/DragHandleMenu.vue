<template>
  <teleport to="body">
    <!-- 拖拽手柄菜单 -->
    <div
      v-if="isMenuVisible"
      ref="menuRef"
      class="drag-handle-menu"
      :style="menuStyle"
      @mouseenter="cancelHideMenu"
      @mouseleave="scheduleHideMenu"
      @click.stop
    >
      <!-- 顶部紧凑工具栏（图标按钮） -->
      <div class="inline-toolbar">
        <!-- 标题级别 -->
        <div class="inline-group">
          <button
            v-for="heading in headings"
            :key="heading.level"
            class="icon-btn heading-btn"
            :class="{ active: isHeadingActive(heading.level) }"
            @click="heading.action"
            :data-level="heading.level"
            :title="heading.title"
          >
            H{{ heading.level }}
          </button>
        </div>
        <!-- 文本格式 -->
        <div class="inline-group">
          <button
            v-for="format in textFormats"
            :key="format.name"
            class="icon-btn"
            :class="{ active: isActive(format.name) }"
            @click="format.action"
            :title="format.title"
          >
            <component :is="format.icon" />
          </button>
        </div>
        <!-- 列表 -->
        <div class="inline-group">
          <button
            v-for="item in listItems"
            :key="item.name"
            class="icon-btn"
            :class="{ active: isActive(item.name) }"
            @click="item.action"
            :title="item.title"
          >
            <component :is="item.icon" />
          </button>
        </div>
      </div>

      <!-- 可展开分组：缩进和对齐 -->
      <div class="menu-section compact">
        <button class="menu-item" @click="toggleIndentAlignPanel">
          <AlignLeftOutlined class="menu-item-icon" />
          <span class="menu-item-label">{{ t('editor.indentAndAlign') }}</span>
          <span class="menu-item-chevron">›</span>
        </button>
        <div v-if="indentAlignOpen" class="sub-panel">
          <div class="sub-group">
            <button class="icon-btn" :class="{ active: isActiveAlign('left') }" @click="setAlign('left')" :title="t('editor.alignLeft')">
              <AlignLeftOutlined />
            </button>
            <button class="icon-btn" :class="{ active: isActiveAlign('center') }" @click="setAlign('center')" :title="t('editor.alignCenter')">
              <AlignCenterOutlined />
            </button>
            <button class="icon-btn" :class="{ active: isActiveAlign('right') }" @click="setAlign('right')" :title="t('editor.alignRight')">
              <AlignRightOutlined />
            </button>
          </div>
          <div class="sub-group">
            <button class="icon-btn" @click="indentList" :title="t('editor.indent')">
              <MenuUnfoldOutlined />
            </button>
            <button class="icon-btn" @click="outdentList" :title="t('editor.outdent')">
              <MenuFoldOutlined />
            </button>
          </div>
        </div>
      </div>

      <!-- 可展开分组：颜色 -->
      <div class="menu-section compact">
        <button class="menu-item" @click="toggleColorPanel('text')">
          <FontColorsOutlined class="menu-item-icon" />
          <span class="menu-item-label">{{ t('editor.colors') }}</span>
          <span class="menu-item-chevron">›</span>
        </button>

        <div v-if="colorPanelType" class="color-picker-panel">
          <div class="color-picker-grid">
            <div
              v-for="c in COLORS"
              :key="c"
              class="color-picker-item"
              :style="{ background: c }"
              @click="applyColor(c)"
            />
          </div>
          <div class="sub-actions">
            <button class="mini-btn" @click="setColorMode('text')">{{ t('editor.text') }}</button>
            <button class="mini-btn" @click="setColorMode('highlight')">{{ t('editor.highlight') }}</button>
          </div>
        </div>
      </div>

      <!-- 操作 -->
      <div class="menu-section">
        <div class="menu-section-title">{{ t('editor.actions') }}</div>
        <button
          v-for="action in editActions"
          :key="action.title"
          class="menu-item"
          :class="{ 'menu-item-danger': action.danger }"
          @click="action.action"
        >
          <component :is="action.icon" class="menu-item-icon" />
          <span class="menu-item-label">{{ action.title }}</span>
        </button>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="isMenuVisible" class="drag-handle-menu-backdrop" @click="hideMenu" />
  </teleport>
</template>

<script setup lang="ts">
/**
 * DragHandleMenu - 拖拽手柄菜单组件
 * @description 提供六个点显示和菜单操作的 UI 组件
 * @features
 * - 点击六个点显示操作菜单
 * - 支持标题、文本格式、列表、对齐、颜色等操作
 * - 支持剪切、复制、删除等编辑操作
 * - 自动定位菜单，避免溢出屏幕
 */
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { t } from '@/locales'
import type { Editor } from '@tiptap/core'
import type { DragHandleClickEvent } from './DragHandleWithMenuExtension'
import {
  COLORS,
  createMenuConfig,
  createEditActions,
} from './dragHandleMenuConfig'
import type { HeadingMenuItem } from './dragHandleMenuConfig'

// 工具函数导入
import { createStateCheckers } from '@/utils/editorState'
import { createCommandRunner, type EditorChain } from '@/utils/editorCommands'
import { selectNodeContent as selectNodeContentUtil } from '@/utils/clipboard'

// Ant Design 图标
import {
  FontColorsOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'

// 导入样式
import '@/styles/drag-handle-with-menu.css'

// ============================================================================
// 常量定义
// ============================================================================

const HIDE_MENU_DELAY = 160 // 菜单隐藏延迟（毫秒）
const POSITION_SAFE_MARGIN = 8 // 位置安全边距
const POSITION_GAP = 12 // 菜单与手柄间距

// ============================================================================
// Props
// ============================================================================

const props = withDefaults(
  defineProps<{
    editor: Editor | null | undefined
    readonly?: boolean
    positionStrategy?: 'auto' | 'right' | 'left'
  }>(),
  {
    readonly: false,
    positionStrategy: 'auto',
  }
)


// ============================================================================
// 菜单状态管理
// ============================================================================

interface MenuState {
  visible: boolean
  position: { x: number; y: number }
  nodePos: number
  nodeTo: number
  handleElement: HTMLElement | null
}

const menuState = ref<MenuState>({
  visible: false,
  position: { x: 0, y: 0 },
  nodePos: 0,
  nodeTo: 0,
  handleElement: null,
})

/**
 * 处理拖拽手柄点击事件
 */
const handleDragHandleClick = (event: DragHandleClickEvent) => {
  menuState.value = {
    visible: true,
    position: event.position,
    nodePos: event.nodePos,
    nodeTo: event.nodeTo,
    handleElement: event.handleElement,
  }
}

/**
 * 隐藏菜单
 */
const hideMenu = () => {
  if (menuState.value.handleElement) {
    menuState.value.handleElement.classList.remove('active')
  }
  menuState.value.visible = false
  menuState.value.handleElement = null
}

const isMenuVisible = computed(() => menuState.value.visible)
const menuPosition = computed(() => menuState.value.position)

// ============================================================================
// 其他状态
// ============================================================================

const menuRef = ref<HTMLElement | null>(null)
const colorPanelType = ref<'text' | 'highlight' | null>(null)
const indentAlignOpen = ref(false)
let hideTimer: number | null = null

// ============================================================================
// 计算属性
// ============================================================================

const editor = computed(() => props.editor ?? null)

// 创建状态检查器
const { isActive, isHeadingActive, isActiveAlign } = createStateCheckers(editor)
// 命令执行器
const runCommand = createCommandRunner(editor)

const menuStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${menuPosition.value.x}px`,
  top: `${menuPosition.value.y}px`,
  zIndex: 1002,
}))

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 限制数值在指定范围内
 */
function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

/**
 * 更新菜单位置
 * @description 根据手柄位置和屏幕尺寸自动调整菜单位置，避免溢出
 */
function updateMenuPosition(): void {
  const handle = menuState.value.handleElement
  const menuEl = menuRef.value
  if (!handle || !menuEl) return

  const handleRect = handle.getBoundingClientRect()
  const menuWidth = menuEl.offsetWidth
  const menuHeight = menuEl.offsetHeight
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 水平方向：根据策略决定位置
  let x: number
  if (props.positionStrategy === 'right') {
    x = handleRect.right + POSITION_GAP
  } else if (props.positionStrategy === 'left') {
    x = handleRect.left - menuWidth - POSITION_GAP
  } else {
    // auto：优先右侧，溢出再切到左侧
    x = handleRect.right + POSITION_GAP
    if (x + menuWidth + POSITION_SAFE_MARGIN > viewportWidth) {
      x = handleRect.left - menuWidth - POSITION_GAP
    }
  }
  x = clamp(x, POSITION_SAFE_MARGIN, viewportWidth - menuWidth - POSITION_SAFE_MARGIN)

  // 垂直方向：优先在句柄下方展示，若底部溢出则放到上方
  let y = handleRect.bottom + POSITION_GAP
  if (y + menuHeight + POSITION_SAFE_MARGIN > viewportHeight) {
    y = handleRect.top - menuHeight - POSITION_GAP
  }
  y = clamp(y, POSITION_SAFE_MARGIN, viewportHeight - menuHeight - POSITION_SAFE_MARGIN)

  menuState.value.position = { x, y }
}

/**
 * 计划隐藏菜单
 * @description 延迟隐藏菜单，当有展开的子面板时不自动关闭
 */
function scheduleHideMenu(): void {
  // 当有展开的子面板时，不因鼠标移出而自动关闭，避免滚动时"闪退"
  if (indentAlignOpen.value || colorPanelType.value) {
    return
  }
  const el = menuRef.value
  if (hideTimer) window.clearTimeout(hideTimer)
  if (el) el.classList.add('closing')
  hideTimer = window.setTimeout(() => {
    hideTimer = null
    hideMenu()
    if (el) el.classList.remove('closing')
  }, HIDE_MENU_DELAY)
}

/**
 * 取消隐藏菜单
 */
function cancelHideMenu(): void {
  const el = menuRef.value
  if (hideTimer) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }
  if (el) el.classList.remove('closing')
}

// ============================================================================
// 生命周期与事件监听
// ============================================================================

/**
 * 重新定位菜单
 * @description 在滚动或窗口大小变化时重新计算菜单位置
 */
function onReposition(): void {
  if (!menuState.value.visible) return
  updateMenuPosition()
}

// 菜单显示后进行测量与定位
watch(isMenuVisible, async (visible) => {
  if (!visible) return
  await nextTick()
  updateMenuPosition()
})

// 监听菜单可见性变化，重置子面板状态
watch(isMenuVisible, (visible) => {
  if (!visible) {
    colorPanelType.value = null
    indentAlignOpen.value = false
  }
})

onMounted(() => {
  // 监听滚动和窗口大小变化，自动调整菜单位置
  window.addEventListener('scroll', onReposition, true)
  window.addEventListener('resize', onReposition, true)

  // 监听编辑器变化，自动隐藏菜单
  if (editor.value) {
    const handleUpdate = () => {
      if (menuState.value.visible) {
        hideMenu()
      }
    }

    editor.value.on('update', handleUpdate)
    editor.value.on('selectionUpdate', handleUpdate)
  }
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('scroll', onReposition, true)
  window.removeEventListener('resize', onReposition, true)

  // 清理定时器
  if (hideTimer) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }

  // 隐藏菜单
  hideMenu()
})

// ============================================================================
// 菜单配置（使用导入的工厂函数）
// ============================================================================

const menuConfig = computed(() => {
  if (!editor.value) return null
  return createMenuConfig(editor.value, menuState.value.nodePos, menuState.value.nodeTo, hideMenu, t)
})

const editActions = computed(() => {
  if (!editor.value) return []
  return createEditActions(editor.value, menuState.value.nodePos, menuState.value.nodeTo, hideMenu, t)
})

const headings = computed<HeadingMenuItem[]>(() => menuConfig.value?.headings ?? [])
const textFormats = computed(() => menuConfig.value?.textFormats ?? [])
const listItems = computed(() => menuConfig.value?.listItems ?? [])

// ============================================================================
// 菜单操作函数
// ============================================================================

/**
 * 选中节点内容
 */
const selectNodeContent = (from: number, to: number): void => {
  const e = editor.value
  if (!e) return
  selectNodeContentUtil(e, from, to)
}

// ============================================================================
// 颜色操作
// ============================================================================

/**
 * 切换颜色面板
 */
const toggleColorPanel = (type: 'text' | 'highlight'): void => {
  colorPanelType.value = colorPanelType.value === type ? null : type
}

/**
 * 设置颜色模式
 */
const setColorMode = (mode: 'text' | 'highlight'): void => {
  colorPanelType.value = mode
}

/**
 * 应用颜色
 */
const applyColor = (color: string): void => {
  selectNodeContent(menuState.value.nodePos, menuState.value.nodeTo)

  if (colorPanelType.value === 'text') {
    // @ts-ignore - setColor 由 Color 扩展动态添加
    runCommand((chain: EditorChain) => chain.setColor(color))()
  } else if (colorPanelType.value === 'highlight') {
    // @ts-ignore - setHighlight 由 Highlight 扩展动态添加
    runCommand((chain: EditorChain) => chain.setHighlight({ color }))()
  }

  colorPanelType.value = null
  hideMenu()
}

// ============================================================================
// 缩进与对齐操作
// ============================================================================

/**
 * 切换缩进对齐面板
 */
const toggleIndentAlignPanel = (): void => {
  indentAlignOpen.value = !indentAlignOpen.value
}

/**
 * 设置文本对齐
 */
const setAlign = (align: 'left' | 'center' | 'right'): void => {
  selectNodeContent(menuState.value.nodePos, menuState.value.nodeTo)
  runCommand((chain: EditorChain) => chain.setTextAlign(align))()
}

/**
 * 增加列表缩进
 */
const indentList = (): void => {
  runCommand((chain) => chain.sinkListItem('listItem'))()
}

/**
 * 减少列表缩进
 */
const outdentList = (): void => {
  runCommand((chain) => chain.liftListItem('listItem'))()
}


// ============================================================================
// 暴露方法
// ============================================================================

defineExpose({
  handleDragHandleClick,
})
</script>


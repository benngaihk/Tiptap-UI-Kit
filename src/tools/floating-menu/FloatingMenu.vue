<template>
  <bubble-menu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100, placement: 'top' }"
    :should-show="shouldShow"
    class="bubble-menu floating-menu"
  >
    <div class="bubble-menu-content menu-content">
      <!-- 标题快捷按钮 -->
      <div class="bubble-group menu-group">
        <HeadingButtons :editor="editor" />
      </div>

      <!-- 文本格式 -->
      <div class="bubble-group menu-group">
        <TextFormatButtons :editor="editor" />
      </div>

      <!-- 颜色工具 -->
      <div class="bubble-group menu-group">
        <ColorPicker
          :icon="FontColorsOutlined"
          type="text"
          :model-value="currentTextColor"
          :title="t('editor.textColor')"
          @select="setTextColor"
        />
        <ColorPicker
          :icon="HighlightOutlined"
          type="background"
          :model-value="currentBgColor"
          :title="t('editor.backgroundColor')"
          @select="setHighlight"
        />
      </div>

      <!-- 链接 -->
      <div class="bubble-group menu-group">
        <LinkButton :editor="editor" />
      </div>

      <!-- 列表工具 -->
      <div class="bubble-group menu-group">
        <ListTools :editor="editor" :show-task-list="true" />
      </div>

      <!-- AI 工具（与主工具栏一致的下拉按钮，支持翻译子菜单） -->
      <div class="bubble-group menu-group">
        <AiMenuButton
          v-if="editor"
          :editor="editor"
          :icon="ThunderboltOutlined"
          :label="t('editor.ai')"
          :title="t('editor.ai')"
          placement="top"
        />
      </div>
    </div>
  </bubble-menu>
</template>

<script setup lang="ts">
/**
 * FloatingMenu - 选中文本时的浮动工具栏
 * @description 选中文本时显示的浮动格式化工具栏（类似 Medium、Notion）
 */
import { computed, ref, watch } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import { t } from '@/locales'

// 工具函数和配置导入
import { createCommandRunner } from '@/utils/editorCommands'
import { HeadingButtons } from '@/features/basic/heading'
import { TextFormatButtons } from '@/features/basic/text-format'
import { ListTools } from '@/features/basic/list'
import { LinkButton } from '@/features/advanced/link'
import { ColorPicker } from '@/features/basic/color'
import { AiMenuButton } from '@/ai'

// Ant Design 组件和图标
import {
  FontColorsOutlined,
  HighlightOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue'

// ===== Props =====
const props = withDefaults(
  defineProps<{
    editor: Editor | null | undefined
    readonly?: boolean
    enabled?: boolean
  }>(),
  {
    readonly: false,
    enabled: true,
  }
)
const editor = computed(() => props.editor ?? null)


// ===== 响应式状态 =====
// 当前颜色值
const currentTextColor = ref<string>('#000000')
const currentBgColor = ref<string>('#ffffff')

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)

// ===== 辅助函数 =====
/**
 * 标准化颜色值（确保格式统一）
 */
function normalizeColor(color: string | undefined): string {
  if (!color) return '#000000'
  const trimmed = color.trim()
  if (trimmed.startsWith('#')) {
    return trimmed.toLowerCase()
  }
  return trimmed.toLowerCase()
}

// 监听编辑器状态，更新当前颜色
watch(
  () => editor.value?.getAttributes('textStyle'),
  (attrs) => {
    if (attrs?.color) {
      currentTextColor.value = normalizeColor(attrs.color)
    } else {
      currentTextColor.value = '#000000'
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => editor.value?.getAttributes('highlight'),
  (attrs) => {
    if (attrs?.color) {
      currentBgColor.value = normalizeColor(attrs.color)
    } else {
      currentBgColor.value = '#ffffff'
    }
  },
  { deep: true, immediate: true }
)

/**
 * 控制浮动菜单显示时机
 * @description 仅在有文本选中时显示，只读模式下不显示
 */
const shouldShow = (bubbleProps: { editor: any; state: any; from: number; to: number }) => {
  // 如果功能未启用，不显示
  if (!props.enabled) {
    return false
  }
  
  // 只读模式下不显示
  if (props.readonly) return false

  const { from, to } = bubbleProps
  const isEmptySelection = from === to

  // 不显示的情况：无选区、在代码块中、在表格中（表格有自己的上下文菜单）
  if (isEmptySelection) return false
  if (bubbleProps.editor.isActive('codeBlock')) return false
  if (bubbleProps.editor.isActive('table')) return false

  // 如果选中的是图片节点，不显示悬浮菜单（图片有自己的工具栏）
  if (bubbleProps.editor.isActive('image')) return false
  
  // 检查选中的节点是否是图片
  const { state } = bubbleProps
  const { selection } = state
  if (selection.node && selection.node.type.name === 'image') {
    return false
  }
  
  // 检查光标前后的节点是否是图片
  const $anchor = selection.$anchor
  const nodeAfter = $anchor.nodeAfter
  const nodeBefore = $anchor.nodeBefore
  if ((nodeAfter && nodeAfter.type.name === 'image') || (nodeBefore && nodeBefore.type.name === 'image')) {
    return false
  }

  // 如果选中的是链接，不显示文字悬浮框（链接有自己的悬浮框）
  if (bubbleProps.editor.isActive('link')) {
    return false
  }

  return true
}

/**
 * 设置文字颜色
 */
const setTextColor = (color: string) => {
  currentTextColor.value = color
  runCommand((chain) => chain.setColor(color))()
}

/**
 * 设置背景高亮
 */
const setHighlight = (color: string) => {
  currentBgColor.value = color
  runCommand((chain) => chain.setHighlight({ color }))()
}
</script>

<style scoped>


@media (max-width: 768px) {
  .bubble-menu-content {
    gap: 2px;
  }
}

.bubble-menu {
  z-index: 1010;
  display: flex;
  padding: 4px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  border: 1px solid transparent;

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    background: #1f1f1f;
    box-shadow: 0 4px 12px rgb(0 0 0 / 40%);
    border-color: #434343;
  }
}

.bubble-menu-content {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.bubble-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

.bubble-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: #333;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    color: #f0f0f0;
  }
}

.bubble-btn:hover {
  background: #f5f5f5;

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    background: #303030;
  }
}

.bubble-btn.active {
  color: #1890ff;
  background: #e6f4ff;

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    color: #4fc3f7;
    background: #1a4d6e;
  }
}

.heading-btn {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
}

.color-panel {
  display: grid;
  grid-template-columns: repeat(8, 24px);
  gap: 8px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    background: #1f1f1f;
  }
}

.color-item {
  width: 24px;
  height: 24px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: transform 0.2s;

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    border-color: #434343;
  }
}

.color-item:hover {
  box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
  transform: scale(1.2);

  :where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) & {
    box-shadow: 0 2px 8px rgb(0 0 0 / 50%);
  }
}

/* Bubble Menu 容器样式 */
</style>


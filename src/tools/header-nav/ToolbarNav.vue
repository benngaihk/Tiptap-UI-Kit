<template>
  <div v-if="enabled" class="editor-toolbar-container">
    <div class="editor-toolbar">
      <!-- 左侧：基础工具 -->
      <div class="toolbar-left">
        <!-- 第一组：撤销/重做 -->
        <div v-if="config.undoRedo" class="tool-group">
          <UndoRedoButton :editor="editor" :disabled="config.undoRedoDisabled" />
        </div>

        <!-- 第二组：格式刷 -->
        <div v-if="config.formatPainter" class="tool-group">
          <FormatPainterButton :editor="editor" :disabled="config.formatPainterDisabled" />
        </div>

        <!-- 第三组：格式清除 -->
        <div v-if="config.clearFormat" class="tool-group">
          <ClearFormatButton :editor="editor" />
        </div>

        <!-- 第四组：字体工具 -->
        <div v-if="config.font" class="tool-group">
          <FontFamilySelect :editor="editor" />
          <FontSizeSelect :editor="editor" />
        </div>

        <!-- 第五组：文本格式（粗体、斜体、下划线、删除线、行内代码） -->
        <div v-if="config.textFormat || config.codeBlock" class="tool-group">
          <TextFormatButtons :editor="editor" :show-code="config.codeBlock" />
        </div>

        <!-- 第六组：颜色选择（文本颜色、背景颜色） -->
        <div v-if="config.colorPicker" class="tool-group">
          <ToolbarGroup>
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
          </ToolbarGroup>
        </div>

        <!-- 第七组：标题和列表工具 -->
        <div v-if="config.heading || config.list" class="tool-group">
          <HeadingDropdown v-if="config.heading" :editor="editor" />
          <ListTools v-if="config.list" :editor="editor" :show-task-list="true" />
        </div>

        <!-- 第八组：对齐工具 -->
        <div v-if="config.align" class="tool-group">
          <AlignDropdown :editor="editor" />
        </div>

        <!-- 第九组：链接、表格、图片 -->
        <div v-if="config.link || config.table || config.image" class="tool-group">
          <LinkButton v-if="config.link" :editor="editor" />
          <TableButton v-if="config.table" :editor="editor" />
          <ImageUpload v-if="config.image" :editor="editor" />
        </div>

        <!-- 第十组：上标下标工具 -->
        <div v-if="config.subscriptSuperscript" class="tool-group">
          <SubscriptSuperscriptButton :editor="editor" />
        </div>

        <!-- 第十一组：AI工具 -->
        <div v-if="config.ai && editor" class="tool-group">
          <AiMenuButton
            :editor="editor"
            :icon="ThunderboltOutlined"
            :label="t('editor.ai')"
            :title="t('editor.ai')"
          />
        </div>

        <!-- 更多工具可以通过插槽扩展 -->
        <slot name="extra" />
      </div>

      <!-- 右侧：额外工具（如协作开关） -->
      <div v-if="$slots.right" class="toolbar-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ToolbarNav - 公共工具栏组件
 * @description 可配置的工具栏组件，支持通过配置控制显示哪些工具
 * @example
 * ```vue
 * <ToolbarNav :editor="editor" :config="{ textFormat: true, colorPicker: true }" />
 * <ToolbarNav :editor="editor" :enabled="false" /> // 关闭工具栏
 * ```
 */
import { computed, ref, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup } from '@/ui'
import { ColorPicker } from '@/features/basic/color'
import { TextFormatButtons } from '@/features/basic/text-format'
import { ListTools } from '@/features/basic/list'
import { HeadingDropdown } from '@/features/basic/heading'
import { AlignDropdown } from '@/features/basic/align'
import { ImageUpload } from '@/features/basic/image'

import { FontFamilySelect, FontSizeSelect } from '@/features/advanced/font'
import { ClearFormatButton } from '@/features/advanced/format-clear'
import { LinkButton } from '@/features/advanced/link'
import { TableButton } from '@/features/advanced/table'
import { SubscriptSuperscriptButton } from '@/features/advanced/subscript-superscript'
import { UndoRedoButton } from '@/features/advanced/undo-redo'
import { FormatPainterButton } from '@/features/advanced/format-painter'
import { AiMenuButton } from '@/ai'

import { createCommandRunner } from '@/utils/editorCommands'
import { t } from '@/locales'
import type { ToolbarToolsConfig } from './toolbarConfig'
import { DEFAULT_TOOLBAR_CONFIG } from './toolbarConfig'
import {
  FontColorsOutlined,
  HighlightOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  /** 编辑器实例 */
  editor: Editor | null | undefined
  /** 工具栏配置，控制显示哪些工具 */
  config?: ToolbarToolsConfig
  /** 是否启用工具栏，默认为 true */
  enabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  config: () => DEFAULT_TOOLBAR_CONFIG,
  enabled: true,
})

const editor = computed(() => props.editor ?? null)

// ===== 合并配置 =====
const config = computed(() => {
  return {
    ...DEFAULT_TOOLBAR_CONFIG,
    ...props.config,
  }
})

// ===== 响应式状态 =====
const currentTextColor = ref<string>('#000000')
const currentBgColor = ref<string>('#ffffff')

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

/**
 * 命令执行器
 */
const runCommand = createCommandRunner(editor)

// ===== 颜色应用函数 =====
const setTextColor = (color: string) => {
  currentTextColor.value = color
  runCommand((chain) => chain.setColor(color))()
}

const setHighlight = (color: string) => {
  currentBgColor.value = color
  runCommand((chain) => chain.setHighlight({ color }))()
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
</script>

<style lang="scss" scoped>
// Dark 模式选择器变量（用于统一管理暗色主题样式）
$dark-selector: ':where(.dark, .dark *) &';

/* ===== 工具栏容器 ===== */
.editor-toolbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / 8%);

  #{$dark-selector} {
    background: #1f1f1f;
    box-shadow: 0 1px 4px rgb(0 0 0 / 40%);
  }
}

/* ===== 工具栏主体 ===== */
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  min-height: 48px;
  padding: 6px 12px;
}

/* ===== 工具栏左侧区域 ===== */
.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: center;
  min-width: 0;
  flex: 1;
}

/* ===== 工具栏右侧区域 ===== */
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding-left: 12px;
}

/* ===== 工具组 ===== */
.tool-group {
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 0 6px;
  border-right: 1px solid #e8e8e8;

  #{$dark-selector} {
    border-right-color: #434343;
  }

  &:last-child {
    border-right: none;
  }

  &:first-child {
    padding-left: 0;
  }
}
</style>


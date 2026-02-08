<template>
  <bubble-menu
    v-if="editor && enabled"
    :editor="editor"
    :tippy-options="{ duration: 100, placement: 'top', offset: [0, 16] }"
    :should-show="shouldShow"
    class="table-bubble-menu"
  >
    <div class="table-menu-content">
      <!-- 第一行 -->
      <div class="table-menu-row">
        <!-- 行操作 -->
        <div class="table-menu-group">
          <button
            v-for="item in rowTools"
            :key="item.name"
            class="table-menu-btn"
            :disabled="!canExecute(item.command)"
            @click="item.action"
            :title="item.title"
          >
            <component :is="item.icon" />
          </button>
        </div>

        <!-- 列操作 -->
        <div class="table-menu-group">
          <button
            v-for="item in columnTools"
            :key="item.name"
            class="table-menu-btn"
            :disabled="!canExecute(item.command)"
            @click="item.action"
            :title="item.title"
          >
            <component :is="item.icon" />
          </button>
        </div>
      </div>

      <!-- 第二行 -->
      <div class="table-menu-row">
        <!-- 单元格操作 -->
        <div class="table-menu-group">
          <button
            v-for="item in cellTools"
            :key="item.name"
            class="table-menu-btn"
            :disabled="!canExecute(item.command)"
            @click="item.action"
            :title="item.title"
          >
            <component :is="item.icon" />
          </button>
        </div>

        <!-- 删除表格 -->
        <div class="table-menu-group">
          <button
            class="table-menu-btn table-menu-btn--danger"
            @click="deleteTable"
            :title="t('editor.deleteTable')"
          >
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </div>
  </bubble-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import { CellSelection } from '@tiptap/pm/tables'

import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'

import {
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  DeleteRowOutlined,
  DeleteColumnOutlined,
  MergeCellsOutlined,
  SplitCellsOutlined,
  TableOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'

const props = withDefaults(
  defineProps<{
    editor: Editor | null | undefined
    readonly?: boolean
    showMode?: 1 | 2
    enabled?: boolean
  }>(),
  {
    readonly: false,
    showMode: 2,
    enabled: false,
  }
)

const editor = computed(() => props.editor ?? null)

const runCommand = createCommandRunner(editor)
const { canExecute } = createStateCheckers(editor)

const rowTools = [
  {
    name: 'addRowBefore',
    icon: InsertRowAboveOutlined,
    title: t('table.addRowBefore'),
    command: 'addRowBefore',
    action: runCommand((chain) => chain.addRowBefore()),
  },
  {
    name: 'addRowAfter',
    icon: InsertRowBelowOutlined,
    title: t('table.addRowAfter'),
    command: 'addRowAfter',
    action: runCommand((chain) => chain.addRowAfter()),
  },
  {
    name: 'deleteRow',
    icon: DeleteRowOutlined,
    title: t('table.deleteRow'),
    command: 'deleteRow',
    action: runCommand((chain) => chain.deleteRow()),
  },
]

const columnTools = [
  {
    name: 'addColumnBefore',
    icon: InsertRowLeftOutlined,
    title: t('table.addColumnBefore'),
    command: 'addColumnBefore',
    action: runCommand((chain) => chain.addColumnBefore()),
  },
  {
    name: 'addColumnAfter',
    icon: InsertRowRightOutlined,
    title: t('table.addColumnAfter'),
    command: 'addColumnAfter',
    action: runCommand((chain) => chain.addColumnAfter()),
  },
  {
    name: 'deleteColumn',
    icon: DeleteColumnOutlined,
    title: t('table.deleteColumn'),
    command: 'deleteColumn',
    action: runCommand((chain) => chain.deleteColumn()),
  },
]

const cellTools = [
  {
    name: 'mergeCells',
    icon: MergeCellsOutlined,
    title: t('table.mergeCells'),
    command: 'mergeCells',
    action: runCommand((chain) => chain.mergeCells()),
  },
  {
    name: 'splitCell',
    icon: SplitCellsOutlined,
    title: t('table.splitCell'),
    command: 'splitCell',
    action: runCommand((chain) => chain.splitCell()),
  },
  {
    name: 'toggleHeaderRow',
    icon: TableOutlined,
    title: t('table.toggleHeaderRow'),
    command: 'toggleHeaderRow',
    action: runCommand((chain) => chain.toggleHeaderRow()),
  },
  {
    name: 'toggleHeaderColumn',
    icon: TableOutlined,
    title: t('table.toggleHeaderColumn'),
    command: 'toggleHeaderColumn',
    action: runCommand((chain) => chain.toggleHeaderColumn()),
  },
]

const shouldShow = (bubbleProps: { editor: any; state: any; from: number; to: number }) => {
  // 如果未启用，则不显示
  if (!props.enabled) return false

  if (props.readonly) return false

  if (props.showMode === 1) {
    if (!bubbleProps.editor.isActive('table')) return false
  }

  if (props.showMode === 2) {
    const sel = bubbleProps.state?.selection
    return sel instanceof CellSelection
  }

  return true
}

function deleteTable() {
  runCommand((chain) => chain.deleteTable())()
}
</script>

<style scoped>
.table-bubble-menu {
  z-index: 1000;
}

.table-menu-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  :where(.dark, .dark *) & {
    background: #1f1f1f;
    border-color: #434343;
  }
}

.table-menu-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.table-menu-group {
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 0 4px;
  border-right: 1px solid #e8e8e8;

  :where(.dark, .dark *) & {
    border-right-color: #434343;
  }
}

.table-menu-group:last-child {
  border-right: none;
}

.table-menu-btn {
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

  :where(.dark, .dark *) & {
    color: #f0f0f0;
  }
}

.table-menu-btn:hover:not(:disabled) {
  background: #f5f5f5;

  :where(.dark, .dark *) & {
    background: #303030;
  }
}

.table-menu-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-menu-btn--danger {
  color: #ff4d4f;

  :where(.dark, .dark *) & {
    color: #ff7875;
  }
}

.table-menu-btn--danger:hover {
  color: #fff;
  background: #ff4d4f;

  :where(.dark, .dark *) & {
    background: #ff7875;
  }
}
</style>


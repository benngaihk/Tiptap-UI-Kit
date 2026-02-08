<template>
  <ToolbarGroup>
    <Popover trigger="click" placement="bottomLeft" v-model:open="tableDropdownOpen">
      <template #content>
        <div class="table-insert-panel">
          <div class="grid" @mouseleave="resetGridHover">
            <div v-for="r in gridRows" :key="'r-'+r" class="grid-row">
              <div
                v-for="c in gridCols"
                :key="'c-'+r+'-'+c"
                :class="['grid-cell', (r <= hoverRows && c <= hoverCols) ? 'active' : '']"
                @mouseenter="setHover(r, c)"
                @click="applyCreateTable(r, c)"
              ></div>
            </div>
          </div>
          <div class="attrs">
            <div class="attr-row">
              <a-checkbox v-model:checked="tableWithHeader">{{ t('editor.includeHeader') }}</a-checkbox>
            </div>
            
            <!-- 表格操作工具栏 -->
            <div  class="table-toolbar-section">
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
              </div>
            </div>
            
            <a-button
              type="primary"
              danger
              block
              :disabled="!editor?.isActive('table')"
              @click="deleteTable(); tableDropdownOpen = false"
            >{{ t('editor.deleteTable') }}</a-button>
          </div>
        </div>
      </template>
      
      <ToolbarButton :icon="TableOutlined" :title="t('editor.insertTable')" />
    </Popover>
  </ToolbarGroup>
</template>

<script setup lang="ts">
/**
 * TableButton - 表格按钮组件
 * @description 提供表格插入面板，支持自定义行列与表头，以及删除表格功能
 */
import { computed, ref } from 'vue'
import { Popover } from 'ant-design-vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'
import {
  TableOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  DeleteRowOutlined,
  DeleteColumnOutlined,
  MergeCellsOutlined,
  SplitCellsOutlined,
} from '@ant-design/icons-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { canExecute } = createStateCheckers(editor)

// ===== 表格操作工具 =====
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

// ===== 响应式状态 =====
const tableDropdownOpen = ref(false)
const tableWithHeader = ref(true)
const gridRows = 10
const gridCols = 10
const hoverRows = ref(0)
const hoverCols = ref(0)

// ===== 表格插入：网格悬停与创建 =====
/**
 * 设置网格悬停状态
 */
function setHover(r: number, c: number) {
  hoverRows.value = r
  hoverCols.value = c
}

/**
 * 重置网格悬停状态
 */
function resetGridHover() {
  hoverRows.value = 0
  hoverCols.value = 0
}

/**
 * 应用创建表格
 * @param rows 行数
 * @param cols 列数
 */
function applyCreateTable(rows: number, cols: number) {
  const r = Math.max(1, Number(rows))
  const c = Math.max(1, Number(cols))
  runCommand((chain) => chain.insertTable({ rows: r, cols: c, withHeaderRow: tableWithHeader.value }))()
  tableDropdownOpen.value = false
}

/**
 * 删除表格
 */
function deleteTable() {
  runCommand((chain) => chain.deleteTable())()
}
</script>

<style scoped>
/* ===== 插入表格面板 ===== */
.table-insert-panel {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.grid {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  gap: 4px;
  padding: 8px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

:where(.dark, .dark *) .grid {
  background: #262626;
  border-color: #434343;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

.grid-cell {
  width: 18px;
  height: 18px;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

:where(.dark, .dark *) .grid-cell {
  border-color: #434343;
  background: #1f1f1f;
}

.grid-cell:hover {
  border-color: #40a9ff;
}

:where(.dark, .dark *) .grid-cell:hover {
  border-color: #4fc3f7;
}

.grid-cell.active {
  background: #e6f4ff;
  border-color: #91caff;
}

:where(.dark, .dark *) .grid-cell.active {
  background: #1a4d6e;
  border-color: #4fc3f7;
}

.attrs {
  display: grid;
  gap: 8px;
}

.attr-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== 表格工具栏样式 ===== */
.table-toolbar-section {
  padding: 8px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 8px;

  :where(.dark, .dark *) & {
    background: #262626;
    border-color: #434343;
  }
}

.table-menu-row {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 4px;
}

.table-menu-row:last-child {
  margin-bottom: 0;
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
  width: 28px;
  height: 28px;
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
</style>


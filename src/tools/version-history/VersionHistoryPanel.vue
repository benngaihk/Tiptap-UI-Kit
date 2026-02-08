<template>
  <a-drawer
    :open="open"
    :title="t('versionHistory.title')"
    placement="right"
    :width="400"
    @close="emit('close')"
    class="version-history-panel"
  >
    <!-- 操作按钮 -->
    <div class="version-actions">
      <a-button type="primary" size="small" @click="handleSaveVersion">
        <template #icon><SaveOutlined /></template>
        {{ t('versionHistory.saveVersion') }}
      </a-button>
    </div>

    <!-- 版本列表 -->
    <div class="version-list">
      <div v-if="versions.length === 0" class="version-empty">
        {{ t('versionHistory.noVersions') }}
      </div>

      <div
        v-for="version in versions"
        :key="version.id"
        class="version-item"
        :class="{
          'is-selected': selectedVersionId === version.id,
          'is-compare': compareVersionId === version.id,
        }"
        @click="handleSelectVersion(version)"
      >
        <div class="version-item__header">
          <span class="version-item__name">
            {{ version.name || formatTime(version.createdAt) }}
          </span>
          <a-tag v-if="version.isAutoSave" size="small" color="default">
            {{ t('versionHistory.autoSave') }}
          </a-tag>
        </div>

        <div class="version-item__meta">
          <span class="version-item__time">
            {{ formatRelativeTime(version.createdAt) }}
          </span>
          <span v-if="version.wordCount" class="version-item__count">
            {{ version.wordCount }} {{ t('versionHistory.words') }}
          </span>
        </div>

        <div class="version-item__actions" @click.stop>
          <a-tooltip :title="t('versionHistory.restore')">
            <a-button type="text" size="small" @click="handleRestore(version)">
              <template #icon><RollbackOutlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip :title="t('versionHistory.compare')">
            <a-button
              type="text"
              size="small"
              :class="{ 'is-active': compareVersionId === version.id }"
              @click="handleToggleCompare(version)"
            >
              <template #icon><DiffOutlined /></template>
            </a-button>
          </a-tooltip>
          <a-dropdown>
            <a-button type="text" size="small">
              <template #icon><MoreOutlined /></template>
            </a-button>
            <template #overlay>
              <a-menu @click="handleMenuClick($event, version)">
                <a-menu-item key="rename">{{ t('versionHistory.rename') }}</a-menu-item>
                <a-menu-item key="delete" danger>{{ t('versionHistory.delete') }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>

    <!-- 对比视图 -->
    <div v-if="selectedVersionId && compareVersionId" class="version-diff">
      <div class="version-diff__header">
        <span>{{ t('versionHistory.comparing') }}</span>
        <a-button type="link" size="small" @click="clearCompare">
          {{ t('versionHistory.clearCompare') }}
        </a-button>
      </div>
      <VersionDiffView :changes="diffChanges" />
    </div>

    <!-- 重命名对话框 -->
    <a-modal
      v-model:open="renameModalOpen"
      :title="t('versionHistory.rename')"
      @ok="handleRenameConfirm"
    >
      <a-input v-model:value="renameName" :placeholder="t('versionHistory.versionName')" />
    </a-modal>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Drawer as ADrawer,
  Button as AButton,
  Tag as ATag,
  Tooltip as ATooltip,
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
  Modal as AModal,
  Input as AInput,
  message,
} from 'ant-design-vue'
import {
  SaveOutlined,
  RollbackOutlined,
  DiffOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue'
import { t } from '@/locales'
import type { Version, DiffChange } from './types'
import VersionDiffView from './VersionDiffView.vue'

interface Props {
  open: boolean
  versions: Version[]
  selectedVersionId: string | null
  compareVersionId: string | null
  diffChanges: DiffChange[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [name?: string]
  select: [versionId: string | null]
  compare: [versionId: string | null]
  restore: [versionId: string]
  rename: [versionId: string, name: string]
  delete: [versionId: string]
}>()

// 重命名相关状态
const renameModalOpen = ref(false)
const renameName = ref('')
const renameVersionId = ref<string | null>(null)

// 时间格式化
function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('versionHistory.justNow')
  if (minutes < 60) return `${minutes} ${t('versionHistory.minutesAgo')}`
  if (hours < 24) return `${hours} ${t('versionHistory.hoursAgo')}`
  return `${days} ${t('versionHistory.daysAgo')}`
}

// 事件处理
function handleSaveVersion() {
  emit('save')
  message.success(t('versionHistory.saved'))
}

function handleSelectVersion(version: Version) {
  emit('select', version.id)
}

function handleRestore(version: Version) {
  emit('restore', version.id)
  message.success(t('versionHistory.restored'))
}

function handleToggleCompare(version: Version) {
  if (props.compareVersionId === version.id) {
    emit('compare', null)
  } else {
    emit('compare', version.id)
  }
}

function clearCompare() {
  emit('compare', null)
}

function handleMenuClick(info: { key: string | number }, version: Version) {
  const key = String(info.key)
  if (key === 'rename') {
    renameVersionId.value = version.id
    renameName.value = version.name || ''
    renameModalOpen.value = true
  } else if (key === 'delete') {
    emit('delete', version.id)
    message.success(t('versionHistory.deleted'))
  }
}

function handleRenameConfirm() {
  if (renameVersionId.value && renameName.value.trim()) {
    emit('rename', renameVersionId.value, renameName.value.trim())
    renameModalOpen.value = false
    renameVersionId.value = null
    renameName.value = ''
  }
}
</script>

<style>
.version-history-panel .ant-drawer-body {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.version-actions {
  padding: 12px 16px;
  border-bottom: 1px solid var(--tp-color-border, #e5e5e5);
}

.version-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.version-empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--tp-color-text-muted, #999);
}

.version-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--tp-color-border-light, #f0f0f0);
  transition: background-color 0.2s;
}

.version-item:hover {
  background-color: var(--tp-color-bg-hover, #f5f5f5);
}

.version-item.is-selected {
  background-color: rgba(24, 144, 255, 0.1);
  border-left: 3px solid var(--tp-color-primary, #1890ff);
}

.version-item.is-compare {
  background-color: rgba(250, 173, 20, 0.1);
}

.version-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.version-item__name {
  font-weight: 500;
  color: var(--tp-color-text, #1a1a1a);
}

.version-item__meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--tp-color-text-muted, #999);
}

.version-item__actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.version-item__actions .ant-btn.is-active {
  color: var(--tp-color-primary, #1890ff);
  background-color: rgba(24, 144, 255, 0.1);
}

.version-diff {
  border-top: 1px solid var(--tp-color-border, #e5e5e5);
  max-height: 300px;
  overflow-y: auto;
}

.version-diff__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--tp-color-bg-secondary, #f5f5f5);
  font-size: 13px;
}

/* 深色模式 */
[data-theme="dark"] .version-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .version-item.is-selected {
  background-color: rgba(24, 144, 255, 0.15);
}

[data-theme="dark"] .version-item.is-compare {
  background-color: rgba(250, 173, 20, 0.15);
}
</style>

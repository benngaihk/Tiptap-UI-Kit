<template>
  <ToolbarGroup>
    <ToolbarDropdownButton
      :icon="FileWordOutlined"
      :title="t('editor.word')"
      :items="menuItems"
      placement="bottomLeft"
    />
  </ToolbarGroup>

  <!-- 导入 Word 文件（拖拽上传） -->
  <a-modal v-model:open="importModalOpen" :title="t('editor.importWord')" :footer="null">
    <a-upload-dragger
      :show-upload-list="false"
      :custom-request="handleImport"
      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      :disabled="importing"
    >
      <p class="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p class="ant-upload-text">{{ t('editor.clickOrDragUploadWord') }}</p>
      <p class="ant-upload-hint">{{ t('editor.onlySupportDocx') }}</p>
    </a-upload-dragger>
    <div v-if="importing" style="text-align: center; margin-top: 12px; color: #999">
      {{ t('editor.importing') }}
    </div>
  </a-modal>

  <!-- 导出文件名输入框 -->
  <a-modal
    v-model:open="exportModalOpen"
    :title="t('editor.exportWord')"
    @ok="doExport"
    :ok-button-props="{ disabled: exporting }"
  >
    <a-input
      v-model:value="exportFilename"
      :placeholder="t('editor.exportFilenamePlaceholder')"
      @keyup.enter="doExport"
      :disabled="exporting"
    />
    <div v-if="exporting" style="text-align: center; margin-top: 12px; color: #999">
      {{ t('editor.exporting') }}
    </div>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * WordButton - Word 导入/导出按钮组件
 * @description 支持 .docx 文件的导入和导出
 */
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarDropdownButton } from '@/ui'
import { t } from '@/locales'
import { FileWordOutlined, ImportOutlined, ExportOutlined, InboxOutlined } from '@ant-design/icons-vue'
import { importWordFile } from './wordImport'
import { exportToWord } from './wordExport'
import type { MenuItemConfig } from '@/configs/toolbar'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 状态 =====
const importModalOpen = ref(false)
const exportModalOpen = ref(false)
const exportFilename = ref('document')
const importing = ref(false)
const exporting = ref(false)

// ===== 菜单项 =====
const menuItems = computed<MenuItemConfig[]>(() => [
  {
    key: 'import-word',
    label: t('editor.importWord'),
    icon: ImportOutlined,
    action: () => {
      importModalOpen.value = true
    },
  },
  {
    key: 'export-word',
    label: t('editor.exportWord'),
    icon: ExportOutlined,
    action: () => {
      exportFilename.value = 'document'
      exportModalOpen.value = true
    },
  },
])

/**
 * 处理 Word 文件导入
 */
async function handleImport(options: any) {
  const { file, onSuccess, onError } = options || {}
  const e = editor.value
  if (!e) return

  importing.value = true
  try {
    await importWordFile(e, file as File)
    importModalOpen.value = false
    onSuccess && onSuccess({})
  } catch (err) {
    console.error('[WordButton] Import failed:', err)
    onError && onError(err)
  } finally {
    importing.value = false
  }
}

/**
 * 执行 Word 导出
 */
async function doExport() {
  const e = editor.value
  if (!e) return

  exporting.value = true
  try {
    const html = e.getHTML()
    const name = exportFilename.value.trim() || 'document'
    await exportToWord(html, name)
    exportModalOpen.value = false
  } catch (err) {
    console.error('[WordButton] Export failed:', err)
  } finally {
    exporting.value = false
  }
}
</script>

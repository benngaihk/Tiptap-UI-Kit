<template>
  <ToolbarGroup>
    <ToolbarButton
      :icon="SnippetsOutlined"
      :title="t('editor.insertTemplate')"
      @click="templateModalOpen = true"
    />
  </ToolbarGroup>

  <!-- 模板选择模态框 -->
  <a-modal
    v-model:open="templateModalOpen"
    :title="t('editor.insertTemplate')"
    :footer="null"
    width="640px"
  >
    <div class="template-list">
      <div
        v-for="tpl in allTemplates"
        :key="tpl.key"
        class="template-card"
        @click="insertTemplate(tpl)"
      >
        <div class="template-card__icon">
          <FileTextOutlined />
        </div>
        <div class="template-card__body">
          <div class="template-card__name">{{ t(tpl.nameKey as any) }}</div>
          <div class="template-card__desc">{{ t(tpl.descKey as any) }}</div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * TemplateButton - 模板插入按钮
 * @description 支持从内置模板和自定义模板中选择并插入到编辑器
 */
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { t } from '@/locales'
import { SnippetsOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import { builtinTemplates } from './templates'
import type { TemplateItem } from './templates'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 自定义模板列表（可选，会追加到内置模板后面） */
  customTemplates?: TemplateItem[]
}

const props = withDefaults(defineProps<Props>(), {
  customTemplates: () => [],
})

const editor = computed(() => props.editor ?? null)
const runCommand = createCommandRunner(editor)

// ===== 状态 =====
const templateModalOpen = ref(false)

// ===== 合并模板列表 =====
const allTemplates = computed(() => [
  ...builtinTemplates,
  ...props.customTemplates,
])

/**
 * 插入模板内容到编辑器
 */
function insertTemplate(tpl: TemplateItem) {
  runCommand((chain) => chain.insertContent(tpl.content))()
  templateModalOpen.value = false
}
</script>

<style scoped>
.template-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

.template-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-card:hover {
  border-color: var(--menu-primary, #1890ff);
  background: #f0f5ff;
}

:where(.dark, .dark *) .template-card {
  border-color: #434343;
}

:where(.dark, .dark *) .template-card:hover {
  border-color: #4fc3f7;
  background: #1a3a4d;
}

.template-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  font-size: 20px;
  color: var(--menu-primary, #1890ff);
  background: #e6f4ff;
  border-radius: 8px;
}

:where(.dark, .dark *) .template-card__icon {
  color: #4fc3f7;
  background: #1a4d6e;
}

.template-card__body {
  flex: 1;
  min-width: 0;
}

.template-card__name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

:where(.dark, .dark *) .template-card__name {
  color: #e0e0e0;
}

.template-card__desc {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

:where(.dark, .dark *) .template-card__desc {
  color: #8c8c8c;
}

@media (max-width: 480px) {
  .template-list {
    grid-template-columns: 1fr;
  }
}
</style>

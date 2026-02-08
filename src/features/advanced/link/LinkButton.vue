<template>
  <ToolbarGroup>
    <ToolbarButton
      :icon="LinkOutlined"
      :title="t('editor.link')"
      :active="isActive('link')"
      @click="handleClick"
    />
  </ToolbarGroup>

  <!-- 链接输入模态框 -->
  <a-modal
    v-model:open="linkModalOpen"
    :title="t('editor.insertLink')"
    @ok="applyLink"
    width="400px"
  >
    <a-input
      v-model:value="linkUrl"
      :placeholder="t('editor.linkPlaceholder')"
      @keyup.enter="applyLink"
    />
  </a-modal>
</template>

<script setup lang="ts">
/**
 * LinkButton - 链接按钮
 * @description 可复用的链接按钮组件，包含链接插入/编辑功能
 */
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarButton, ToolbarGroup } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { createStateCheckers } from '@/utils/editorState'
import { t } from '@/locales'
import { LinkOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
}

const props = defineProps<Props>()
const editor = computed(() => props.editor ?? null)

// ===== 响应式状态 =====
const linkModalOpen = ref(false)
const linkUrl = ref('')

// ===== 工具函数 =====
const runCommand = createCommandRunner(editor)
const { isActive } = createStateCheckers(editor)

// ===== 方法 =====
/**
 * 处理链接按钮点击
 */
function handleClick() {
  const e = editor.value
  if (!e) return

  // 如果已经是链接，获取当前链接地址
  if (e.isActive('link')) {
    linkUrl.value = e.getAttributes('link')?.href ?? ''
  } else {
    linkUrl.value = ''
  }

  linkModalOpen.value = true
}

/**
 * 验证 URL 是否有效
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 构建链接属性
 */
function buildLinkAttrs(href: string) {
  return {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
  }
}

/**
 * 应用链接
 */
function applyLink() {
  const rawUrl = linkUrl.value.trim()
  const e = editor.value
  if (!e) return

  // 如果 URL 为空，移除链接
  if (!rawUrl) {
    runCommand((chain) => chain.unsetLink())()
    linkModalOpen.value = false
    linkUrl.value = ''
    return
  }

  // 验证 URL
  if (!isValidUrl(rawUrl)) {
    message.warning(t('editor.enterValidLink'))
    return
  }

  const hasSelection = !e.state.selection.empty
  const chain = e.chain().focus()

  if (hasSelection) {
    chain.extendMarkRange('link').setLink(buildLinkAttrs(rawUrl)).run()
  } else {
    chain
      .insertContent([
        {
          type: 'text',
          text: rawUrl,
          marks: [{ type: 'link', attrs: buildLinkAttrs(rawUrl) }],
        },
      ])
      .run()
  }

  linkModalOpen.value = false
  linkUrl.value = ''
}
</script>


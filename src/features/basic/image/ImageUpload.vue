<template>
  <ToolbarGroup>
    <ToolbarDropdownButton
      :icon="PictureOutlined"
      :title="t('editor.image')"
      :items="imageMenuItems"
      placement="bottomLeft"
    />
  </ToolbarGroup>

  <!-- 网络上传图片模态框 -->
  <a-modal v-model:open="imageModalOpen" :title="t('editor.insertImage')" @ok="applyImage">
    <a-input v-model:value="imageUrl" :placeholder="t('editor.imagePlaceholder')" />
  </a-modal>

  <!-- 本地上传图片（拖拽上传） -->
  <a-modal v-model:open="localUploadOpen" :title="t('editor.localUploadImage')" :footer="null">
    <a-upload-dragger :show-upload-list="false" :custom-request="handleLocalUpload" accept="image/*">
      <p class="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p class="ant-upload-text">{{ t('editor.clickOrDragUpload') }}</p>
      <p class="ant-upload-hint">{{ t('editor.onlySupportImage') }}</p>
    </a-upload-dragger>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * ImageUpload - 图片上传组件
 * @description 支持本地上传和网络上传图片
 */
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarDropdownButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { t } from '@/locales'
import { PictureOutlined, UploadOutlined, LinkOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { MenuItemConfig } from '@/configs/toolbar'

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 图片上传函数（可选） */
  uploadImage?: (file: File) => Promise<string>
}

const props = withDefaults(defineProps<Props>(), {
  uploadImage: undefined,
})

const editor = computed(() => props.editor ?? null)
const runCommand = createCommandRunner(editor)

// ===== 状态 =====
const imageModalOpen = ref(false)
const imageUrl = ref('')
const localUploadOpen = ref(false)

// ===== 图片上传菜单项 =====
const imageMenuItems = computed<MenuItemConfig[]>(() => [
  {
    key: 'upload-local',
    label: t('editor.localUpload'),
    icon: UploadOutlined,
    action: () => (localUploadOpen.value = true),
  },
  {
    key: 'upload-url',
    label: t('editor.webUpload'),
    icon: LinkOutlined,
    action: () => (imageModalOpen.value = true),
  },
])

/**
 * 插入图片（网络上传）
 */
function applyImage() {
  if (imageUrl.value) {
    runCommand((chain) => chain.insertContent({ type: 'image', attrs: { src: imageUrl.value } }))()
  }
  imageModalOpen.value = false
  imageUrl.value = ''
}

/**
 * 处理本地上传（自定义上传逻辑）
 * - 若父组件提供 uploadImage(file) 回调则使用其返回的 URL
 * - 否则回退为本地 DataURL 直接插入
 */
async function handleLocalUpload(options: any) {
  const { file, onSuccess, onError } = options || {}
  try {
    let url: string
    if (props.uploadImage) {
      url = await props.uploadImage(file as File)
    } else {
      // 使用 Base64 编码
      url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file as File)
      })
    }
    // 插入图片
    runCommand((chain) => chain.insertContent({ type: 'image', attrs: { src: url } }))()
    localUploadOpen.value = false
    onSuccess && onSuccess({ url })
  } catch (e) {
    onError && onError(e)
  }
}
</script>


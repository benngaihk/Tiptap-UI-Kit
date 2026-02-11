<template>
  <ToolbarGroup>
    <ToolbarButton
      :icon="AppstoreOutlined"
      :title="t('editor.imageGallery')"
      @click="openGallery"
    />
  </ToolbarGroup>

  <!-- 图库模态框 -->
  <a-modal
    v-model:open="galleryOpen"
    :title="t('editor.imageGallery')"
    :footer="null"
    width="720px"
  >
    <!-- 空状态 -->
    <div v-if="galleryImages.length === 0" class="gallery-empty">
      <FileImageOutlined class="gallery-empty__icon" />
      <p class="gallery-empty__text">{{ t('editor.galleryEmpty') }}</p>
      <p class="gallery-empty__hint">{{ t('editor.galleryEmptyHint') }}</p>
    </div>

    <!-- 图片网格 -->
    <div v-else class="gallery-grid">
      <div
        v-for="(img, index) in galleryImages"
        :key="index"
        :class="['gallery-item', { 'is-selected': selectedImages.has(index) }]"
        @click="toggleSelect(index)"
      >
        <img :src="img.src" :alt="img.alt || ''" class="gallery-item__img" />
        <div v-if="selectedImages.has(index)" class="gallery-item__check">
          <CheckCircleFilled />
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div v-if="galleryImages.length > 0" class="gallery-footer">
      <span class="gallery-footer__count">
        {{ t('editor.galleryCount').replace('{total}', String(galleryImages.length)).replace('{selected}', String(selectedImages.size)) }}
      </span>
      <a-button
        type="primary"
        :disabled="selectedImages.size === 0"
        @click="insertSelected"
      >
        {{ t('editor.galleryInsert') }}
      </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
/**
 * GalleryButton - 图库按钮
 * @description 扫描当前文档中已有的图片，展示为图库，支持选中后重新插入
 */
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { ToolbarGroup, ToolbarButton } from '@/ui'
import { createCommandRunner } from '@/utils/editorCommands'
import { t } from '@/locales'
import { AppstoreOutlined, FileImageOutlined, CheckCircleFilled } from '@ant-design/icons-vue'

interface GalleryImage {
  src: string
  alt?: string
  width?: number
  height?: number
}

// ===== Props =====
interface Props {
  editor: Editor | null | undefined
  /** 外部图片源（可选），如果提供则展示外部图片而非文档内图片 */
  images?: GalleryImage[]
}

const props = withDefaults(defineProps<Props>(), {
  images: undefined,
})

const editor = computed(() => props.editor ?? null)
const runCommand = createCommandRunner(editor)

// ===== 状态 =====
const galleryOpen = ref(false)
const selectedImages = ref<Set<number>>(new Set())
const galleryImages = ref<GalleryImage[]>([])

/**
 * 从编辑器文档中提取所有图片
 */
function collectImagesFromDoc(): GalleryImage[] {
  const ed = editor.value
  if (!ed) return []

  const images: GalleryImage[] = []
  const seen = new Set<string>()

  ed.state.doc.descendants((node) => {
    if (node.type.name === 'image' && node.attrs.src) {
      // 去重：同一 src 只收录一次
      if (!seen.has(node.attrs.src)) {
        seen.add(node.attrs.src)
        images.push({
          src: node.attrs.src,
          alt: node.attrs.alt || '',
          width: node.attrs.width || undefined,
          height: node.attrs.height || undefined,
        })
      }
    }
  })

  return images
}

/**
 * 打开图库
 */
function openGallery() {
  selectedImages.value = new Set()
  // 使用外部图片源或从文档中提取
  galleryImages.value = props.images ?? collectImagesFromDoc()
  galleryOpen.value = true
}

/**
 * 切换图片选中状态
 */
function toggleSelect(index: number) {
  const newSet = new Set(selectedImages.value)
  if (newSet.has(index)) {
    newSet.delete(index)
  } else {
    newSet.add(index)
  }
  selectedImages.value = newSet
}

/**
 * 插入选中的图片
 */
function insertSelected() {
  const sorted = [...selectedImages.value].sort((a, b) => a - b)
  const contents = sorted.map((index) => {
    const img = galleryImages.value[index]
    return {
      type: 'image' as const,
      attrs: {
        src: img.src,
        alt: img.alt || '',
        ...(img.width ? { width: img.width } : {}),
        ...(img.height ? { height: img.height } : {}),
      },
    }
  })

  if (contents.length > 0) {
    runCommand((chain) => chain.insertContent(contents))()
  }

  galleryOpen.value = false
}
</script>

<style scoped>
/* ===== 空状态 ===== */
.gallery-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #8c8c8c;
}

.gallery-empty__icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d9d9d9;
}

:where(.dark, .dark *) .gallery-empty__icon {
  color: #434343;
}

.gallery-empty__text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #595959;
}

:where(.dark, .dark *) .gallery-empty__text {
  color: #a0a0a0;
}

.gallery-empty__hint {
  font-size: 13px;
  color: #8c8c8c;
}

/* ===== 图片网格 ===== */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  max-height: 420px;
  overflow-y: auto;
  padding: 4px;
}

@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: #f5f5f5;
}

:where(.dark, .dark *) .gallery-item {
  background: #2a2a2a;
}

.gallery-item:hover {
  border-color: #bae0ff;
}

.gallery-item.is-selected {
  border-color: var(--menu-primary, #1890ff);
}

.gallery-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item__check {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 20px;
  color: var(--menu-primary, #1890ff);
  background: #fff;
  border-radius: 50%;
  line-height: 1;
}

:where(.dark, .dark *) .gallery-item__check {
  color: #4fc3f7;
  background: #1a1a1a;
}

/* ===== 底部操作栏 ===== */
.gallery-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

:where(.dark, .dark *) .gallery-footer {
  border-top-color: #434343;
}

.gallery-footer__count {
  font-size: 13px;
  color: #8c8c8c;
}
</style>

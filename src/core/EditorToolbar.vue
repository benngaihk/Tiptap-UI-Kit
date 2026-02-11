<template>
  <div class="tiptap-toolbar">
    <template v-for="(feature, index) in config.features" :key="feature">
      <!-- Divider (except for first item) -->
      <ToolbarDivider
        v-if="config.dividers && index > 0 && shouldShowDivider(feature, index)"
      />

      <!-- Undo/Redo -->
      <UndoRedoGroup v-if="feature === 'undoRedo'" :editor="editor" />

      <!-- Heading -->
      <HeadingDropdown v-else-if="feature === 'heading'" :editor="editor" />

      <!-- Text Format -->
      <TextFormatGroup v-else-if="feature === 'textFormat'" :editor="editor" />

      <!-- Font Size -->
      <FontSizeDropdown v-else-if="feature === 'fontSize'" :editor="editor" />

      <!-- List -->
      <ListGroup v-else-if="feature === 'list'" :editor="editor" />

      <!-- Align -->
      <AlignGroup v-else-if="feature === 'align'" :editor="editor" />

      <!-- Block (Quote, HR) - TODO: implement BlockGroup component -->
      <!-- <BlockGroup v-else-if="feature === 'block'" :editor="editor" /> -->

      <!-- Link -->
      <LinkButton v-else-if="feature === 'link'" :editor="editor" />

      <!-- Code Block -->
      <CodeBlockButton v-else-if="feature === 'codeBlock'" :editor="editor" />

      <!-- Subscript/Superscript -->
      <SubSupGroup v-else-if="feature === 'subSup'" :editor="editor" />

      <!-- Format Clear -->
      <FormatClearButton v-else-if="feature === 'formatClear'" :editor="editor" />

      <!-- Word Import/Export -->
      <WordButton v-else-if="feature === 'word'" :editor="editor" />

      <!-- Math Formula -->
      <MathButton v-else-if="feature === 'math'" :editor="editor" />

      <!-- Template -->
      <TemplateButton v-else-if="feature === 'template'" :editor="editor" />

      <!-- Gallery -->
      <GalleryButton v-else-if="feature === 'gallery'" :editor="editor" />

      <!-- AI (requires adapter) -->
      <AiToolbarMenu
        v-else-if="feature === 'ai' && aiAdapter"
        :editor="editor"
        :adapter="aiAdapter"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { ToolbarConfig, ToolbarFeature } from './toolbarConfig'
import type { AiAdapter } from '@/ai'

// UI Components
import ToolbarDivider from '@/ui/ToolbarDivider.vue'

// Basic Features
import { HeadingDropdown } from '@/features/basic/heading'
import { TextFormatButtons as TextFormatGroup } from '@/features/basic/text-format'
import { ListTools as ListGroup } from '@/features/basic/list'
import { AlignDropdown as AlignGroup } from '@/features/basic/align'
// BlockGroup is part of advanced features or custom implementation

// Advanced Features
import { UndoRedoGroup, FontSizeDropdown, CodeBlockButton, LinkButton, SubSupGroup, FormatClearButton, MathButton, WordButton, TemplateButton, GalleryButton } from '@/features/advanced'

// AI
import { AiToolbarMenu } from '@/ai'

interface Props {
  editor: Editor | null
  config: ToolbarConfig
  aiAdapter?: AiAdapter
}

const props = defineProps<Props>()

// Feature groups for divider logic
const featureGroups: ToolbarFeature[][] = [
  ['undoRedo'],
  ['heading', 'fontSize', 'fontFamily', 'lineHeight'],
  ['textFormat', 'textColor', 'backgroundColor'],
  ['list', 'align'],
  ['block', 'link', 'codeBlock', 'math'],
  ['subSup', 'formatClear'],
  ['word', 'template', 'gallery'],
  ['ai'],
]

const getFeatureGroup = (feature: ToolbarFeature): number => {
  return featureGroups.findIndex(group => group.includes(feature))
}

const shouldShowDivider = (feature: ToolbarFeature, index: number): boolean => {
  if (index === 0) return false
  const prevFeature = props.config.features[index - 1]
  return getFeatureGroup(feature) !== getFeatureGroup(prevFeature)
}
</script>

<style scoped>
.tiptap-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--tiptap-toolbar-bg, #fafafa);
  border-bottom: 1px solid var(--tiptap-border, #e5e5e5);
}
</style>

<!--
  PreviewMode - 预览模式组件
  @description 纯预览模式，无工具栏，不可编辑，不可点击
  @features
    - 隐藏头部工具栏
    - 隐藏底部导航栏
    - 禁止编辑和选中文本
    - 禁止所有点击交互
-->
<template>
  <div class="tiptap-preview-mode" :class="{ 'preview-mode--bordered': bordered }">
    <!-- 预览内容区域 -->
    <div class="preview-content" ref="contentRef">
      <div class="preview-document" :style="documentStyle">
        <div
          class="preview-body"
          v-html="htmlContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * PreviewMode - 预览模式组件
 * @description 提供纯预览功能，不可编辑、不可点击
 */
import { computed, ref } from 'vue'

// 样式
import '@/styles/base.css'
import '@/styles/word-mode.css'
import './preview-mode.css'

// ===== Props =====
interface Props {
  /** HTML 内容 */
  content?: string
  /** JSON 内容（优先级低于 content） */
  jsonContent?: any
  /** 是否显示边框 */
  bordered?: boolean
  /** 缩放比例（百分比，默认 100） */
  zoomLevel?: number
  /** 最大宽度（默认 100%） */
  maxWidth?: string
  /** 背景颜色 */
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  jsonContent: undefined,
  bordered: false,
  zoomLevel: 100,
  maxWidth: '100%',
  backgroundColor: '#ffffff',
})

// ===== Refs =====
const contentRef = ref<HTMLElement | null>(null)

// ===== 计算属性 =====
/**
 * HTML 内容
 * @description 优先使用 content，否则将 jsonContent 转换为 HTML
 */
const htmlContent = computed(() => {
  if (props.content) {
    return props.content
  }
  if (props.jsonContent) {
    // 简单的 JSON 转 HTML（实际项目中可能需要更复杂的转换）
    return jsonToHtml(props.jsonContent)
  }
  return ''
})

/**
 * 文档样式
 */
const documentStyle = computed(() => ({
  transform: `scale(${props.zoomLevel / 100})`,
  transformOrigin: 'top center',
  maxWidth: props.maxWidth,
  backgroundColor: props.backgroundColor,
}))

/**
 * 简单的 JSON 转 HTML
 * @description 将 Tiptap JSON 格式转换为 HTML
 */
function jsonToHtml(json: any): string {
  if (!json || typeof json !== 'object') return ''
  
  if (json.type === 'doc' && Array.isArray(json.content)) {
    return json.content.map((node: any) => nodeToHtml(node)).join('')
  }
  
  return nodeToHtml(json)
}

/**
 * 节点转 HTML
 */
function nodeToHtml(node: any): string {
  if (!node || typeof node !== 'object') return ''
  
  const { type, content, text, attrs, marks } = node
  
  // 文本节点
  if (type === 'text') {
    let result = text || ''
    // 应用 marks
    if (marks && Array.isArray(marks)) {
      marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            result = `<strong>${result}</strong>`
            break
          case 'italic':
            result = `<em>${result}</em>`
            break
          case 'underline':
            result = `<u>${result}</u>`
            break
          case 'strike':
            result = `<s>${result}</s>`
            break
          case 'code':
            result = `<code>${result}</code>`
            break
          case 'link':
            result = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer">${result}</a>`
            break
          case 'textStyle':
            const styles: string[] = []
            if (mark.attrs?.color) styles.push(`color: ${mark.attrs.color}`)
            if (mark.attrs?.fontSize) styles.push(`font-size: ${mark.attrs.fontSize}`)
            if (mark.attrs?.fontFamily) styles.push(`font-family: ${mark.attrs.fontFamily}`)
            if (styles.length > 0) {
              result = `<span style="${styles.join('; ')}">${result}</span>`
            }
            break
          case 'highlight':
            result = `<mark style="background-color: ${mark.attrs?.color || '#ffff00'}">${result}</mark>`
            break
        }
      })
    }
    return result
  }
  
  // 子内容
  const childrenHtml = content ? content.map((child: any) => nodeToHtml(child)).join('') : ''
  
  // 根据节点类型生成 HTML
  switch (type) {
    case 'paragraph':
      const pStyle = attrs?.textAlign ? `text-align: ${attrs.textAlign}` : ''
      return `<p${pStyle ? ` style="${pStyle}"` : ''}>${childrenHtml || '<br>'}</p>`
    
    case 'heading':
      const level = attrs?.level || 1
      const hStyle = attrs?.textAlign ? `text-align: ${attrs.textAlign}` : ''
      return `<h${level}${hStyle ? ` style="${hStyle}"` : ''}>${childrenHtml}</h${level}>`
    
    case 'bulletList':
      return `<ul>${childrenHtml}</ul>`
    
    case 'orderedList':
      return `<ol>${childrenHtml}</ol>`
    
    case 'listItem':
      return `<li>${childrenHtml}</li>`
    
    case 'taskList':
      return `<ul class="task-list">${childrenHtml}</ul>`
    
    case 'taskItem':
      const checked = attrs?.checked ? 'checked' : ''
      return `<li class="task-item"><input type="checkbox" ${checked} disabled />${childrenHtml}</li>`
    
    case 'blockquote':
      return `<blockquote>${childrenHtml}</blockquote>`
    
    case 'codeBlock':
      return `<pre><code>${childrenHtml}</code></pre>`
    
    case 'horizontalRule':
      return '<hr />'
    
    case 'image':
      const src = attrs?.src || ''
      const alt = attrs?.alt || ''
      const width = attrs?.width ? `width="${attrs.width}"` : ''
      return `<img src="${src}" alt="${alt}" ${width} />`
    
    case 'table':
      return `<table>${childrenHtml}</table>`
    
    case 'tableRow':
      return `<tr>${childrenHtml}</tr>`
    
    case 'tableCell':
      const colspan = attrs?.colspan > 1 ? ` colspan="${attrs.colspan}"` : ''
      const rowspan = attrs?.rowspan > 1 ? ` rowspan="${attrs.rowspan}"` : ''
      return `<td${colspan}${rowspan}>${childrenHtml}</td>`
    
    case 'tableHeader':
      const thColspan = attrs?.colspan > 1 ? ` colspan="${attrs.colspan}"` : ''
      const thRowspan = attrs?.rowspan > 1 ? ` rowspan="${attrs.rowspan}"` : ''
      return `<th${thColspan}${thRowspan}>${childrenHtml}</th>`
    
    case 'hardBreak':
      return '<br />'
    
    default:
      return childrenHtml
  }
}

// ===== 暴露方法 =====
defineExpose({
  /** 获取预览容器元素 */
  getContainer: () => contentRef.value,
})
</script>

<style scoped>
.tiptap-preview-mode {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f5f5f5;
}

.tiptap-preview-mode.preview-mode--bordered {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

:where(.dark, .dark *) .tiptap-preview-mode {
  background-color: #141414;
}

:where(.dark, .dark *) .tiptap-preview-mode.preview-mode--bordered {
  border-color: #303030;
}

.preview-content {
  display: flex;
  justify-content: center;
  padding: 24px;
  min-height: 100%;
}

.preview-document {
  width: 210mm;
  min-height: 297mm;
  padding: 25.4mm;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  box-sizing: border-box;
}

:where(.dark, .dark *) .preview-document {
  background: #1f1f1f;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.preview-body {
  /* 禁止选中文本 */
  user-select: none;
  /* 禁止所有点击事件 */
  pointer-events: none;
  /* 继承 Tiptap 编辑器的内容样式 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: #262626;
}

:where(.dark, .dark *) .preview-body {
  color: #f0f0f0;
}

/* 预览内容样式 */
.preview-body :deep(h1),
.preview-body :deep(h2),
.preview-body :deep(h3),
.preview-body :deep(h4),
.preview-body :deep(h5),
.preview-body :deep(h6) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.4;
}

.preview-body :deep(h1) { font-size: 2em; }
.preview-body :deep(h2) { font-size: 1.5em; }
.preview-body :deep(h3) { font-size: 1.25em; }
.preview-body :deep(h4) { font-size: 1.1em; }
.preview-body :deep(h5) { font-size: 1em; }
.preview-body :deep(h6) { font-size: 0.9em; }

.preview-body :deep(p) {
  margin: 0.5em 0;
}

.preview-body :deep(ul),
.preview-body :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.preview-body :deep(li) {
  margin: 0.25em 0;
}

.preview-body :deep(blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #d9d9d9;
  background: #fafafa;
  color: #666;
}

:where(.dark, .dark *) .preview-body :deep(blockquote) {
  border-left-color: #434343;
  background: #262626;
  color: #a6a6a6;
}

.preview-body :deep(pre) {
  margin: 1em 0;
  padding: 1em;
  background: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
}

:where(.dark, .dark *) .preview-body :deep(pre) {
  background: #262626;
}

.preview-body :deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  background: #f5f5f5;
  border-radius: 3px;
}

:where(.dark, .dark *) .preview-body :deep(code) {
  background: #262626;
}

.preview-body :deep(pre code) {
  padding: 0;
  background: transparent;
}

.preview-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.preview-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.preview-body :deep(th),
.preview-body :deep(td) {
  border: 1px solid #d9d9d9;
  padding: 8px 12px;
  text-align: left;
}

:where(.dark, .dark *) .preview-body :deep(th),
:where(.dark, .dark *) .preview-body :deep(td) {
  border-color: #434343;
}

.preview-body :deep(th) {
  background: #fafafa;
  font-weight: 600;
}

:where(.dark, .dark *) .preview-body :deep(th) {
  background: #262626;
}

.preview-body :deep(hr) {
  margin: 1.5em 0;
  border: none;
  border-top: 1px solid #d9d9d9;
}

:where(.dark, .dark *) .preview-body :deep(hr) {
  border-top-color: #434343;
}

.preview-body :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.preview-body :deep(.task-list) {
  list-style: none;
  padding-left: 0;
}

.preview-body :deep(.task-item) {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.preview-body :deep(.task-item input[type="checkbox"]) {
  margin-top: 0.3em;
}
</style>


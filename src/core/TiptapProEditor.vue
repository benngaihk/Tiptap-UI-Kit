<template>
  <div class="tiptap-pro-editor word-mode" :class="{ 'is-preview-mode': isPreviewMode }">
    <!-- 工具栏（预览模式下隐藏） -->
    <ToolbarNav
      v-if="editorInstance && !isPreviewMode"
      :editor="editorInstance"
      :config="toolbarConfig"
      :enabled="shouldShowHeaderNav"
      class="word-toolbar"
    >
      <!-- 协作编辑状态显示（在工具栏右侧） -->
      <template v-if="shouldShowCollaboration" #right>
        <CollaborationToggle
          v-model="collaborationEnabled"
          :collaborators-count="collaboration.collaboratorsCount.value"
          :collaborators-list="[...collaboration.collaboratorsList.value]"
          show-label
          @change="handleCollaborationChange"
        />
      </template>
    </ToolbarNav>

    <!-- 功能模块：链接悬浮框（预览模式下禁用） -->
    <LinkBubbleMenu
      v-if="editorInstance && !isPreviewMode && (props.features?.linkBubbleMenu ?? false)"
      :editor="editorInstance"
      :readonly="readonly"
      :enabled="props.features?.linkBubbleMenu ?? false"
    />

    <!-- 功能模块：表格工具栏（预览模式下禁用） -->
    <TableToolbar
      v-if="editorInstance && !isPreviewMode"
      :editor="editorInstance"
      :readonly="readonly"
      :show-mode="props.tableMenuShowMode ?? 2"
      :enabled="props.features?.tableToolbar ?? false"
    />

    <!-- 功能模块：图片工具栏（预览模式下禁用） -->
    <ImageToolbar
      v-if="editorInstance && !isPreviewMode && (props.features?.image ?? false)"
      :editor="editorInstance"
      :readonly="readonly"
      :enabled="props.features?.image ?? false"
    />

    <!-- 功能模块：悬浮菜单（预览模式下禁用） -->
    <FloatingMenu
      v-if="editorInstance && !isPreviewMode && (props.features?.floatingMenu ?? false)"
      :editor="editorInstance"
      :readonly="readonly"
      :enabled="props.features?.floatingMenu ?? false"
    />

    <!-- 功能模块：斜杠命令菜单（预览模式下禁用） -->
    <SlashCommandMenu
      v-if="editorInstance && !isPreviewMode && (props.features?.slashCommand ?? false)"
      ref="slashCommandMenuRef"
      :editor="editorInstance"
    />

    <!-- 功能模块：六个点菜单（预览模式下禁用） -->
    <DragHandleMenu
      v-if="editorInstance && !isPreviewMode && (props.features?.dragHandleMenu ?? false)"
      ref="dragHandleMenuRef"
      :editor="editorInstance"
      :readonly="readonly"
    />

    <!-- Word 文档区域容器 -->
    <div class="word-document-container" ref="containerRef">
      <div class="document-pages" :style="{ transform: `scale(${zoomLevel / 100})` }">
        <div class="continuous-pages">
          <EditorContent v-if="editorInstance" :editor="editorInstance" class="word-content-multi" />
          <div v-else class="editor-fallback">{{ editorError || t('editor.initializing') }}</div>
        </div>
      </div>
    </div>

    <!-- 底部导航（预览模式下隐藏） -->
    <FooterNav
      v-if="editorInstance && !isPreviewMode && shouldShowFooterNav"
      v-model:zoomLevel="zoomLevel"
      :totalPages="totalPages"
      :editor="editorInstance"
      :showCharCount="true"
    />

    <!-- AI 文档助手（文字指令编辑文档，跟随 AI 功能开启） -->
    <AiChatPanel
      v-if="aiChatEnabled"
      :editor="editorInstance"
      :show-settings-entry="props.features?.aiSettings !== false"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * TiptapProEditor - 基础版富文本编辑器
 * @description 支持基础版功能的 Tiptap 编辑器
 */
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { debounce } from '@/utils/debounce'
import { Editor, EditorContent } from '@tiptap/vue-3'
import type { Editor as CoreEditor } from '@tiptap/core'
import type { TiptapProEditorProps } from './editorTypes'
import { A4_WIDTH_PX, A4_HEIGHT_PX, PAGE_PADDING_TOP_PX, PAGE_PADDING_BOTTOM_PX, PAGE_CONTENT_HEIGHT_PX } from '@/extensions/pageConstants'
// @vben/locales removed - using built-in i18n
import { createI18n, detectDefaultLocale, t, useI18n as useTiptapI18n, type LocaleCode } from '@/locales'

// 公共工具栏
import { ToolbarNav, BASIC_TOOLBAR_CONFIG, ADVANCED_TOOLBAR_CONFIG, type ToolbarToolsConfig } from '@/tools/header-nav'

// 功能模块组件
import { LinkBubbleMenu } from '@/tools/link-bubble'
import { AiChatPanel } from '@/ai/agent'
import { TableToolbar } from '@/tools/table-toolbar'
import { FooterNav } from '@/tools/footer-nav'
import { ImageToolbar } from '@/tools/image-toolbar'
import { FloatingMenu } from '@/tools/floating-menu'
import { DragHandleMenu } from '@/tools/drag-handle-menu'
import { SlashCommandMenu, SlashCommandExtension } from '@/tools/slash-command'
import type { SlashCommandState } from '@/tools/slash-command'

// 协作编辑模块（统一从 collaboration 模块导入）
import {
  CollaborationToggle,
  useCollaboration,
  normalizeContent,
} from '@/tools/collaboration'

// 用户信息获取
import { useUserStore } from '@/adapters'

// 扩展配置（根据版本动态加载）
import { getExtensionsByVersion } from '@/extensions/coreExtensions'
import { DragHandleWithMenuExtension } from '@/tools/drag-handle-menu'

// 样式（variables.css 需最先加载以定义 CSS 变量，base.css 需在其他样式之前加载）
import '@/styles/variables.css'
import '@/styles/base.css'
import '@/styles/word-mode.css'
import '@/styles/toolbar.css'
import '@/styles/image-toolbar.css'
import '@/styles/floating-menu-toolbar.css'
import '@/styles/drag-handle-with-menu.css'
import '@/styles/image-resize.css'
import '@/styles/collaboration.css'
import '@/styles/slash-command.css'

// 主题预设（类名作用域隔离：.theme-word / .theme-notion / ...，随包发布，使用者无需单独引入）
import '@/themes/presets/word.css'
import '@/themes/presets/notion.css'
import '@/themes/presets/github.css'
import '@/themes/presets/typora.css'

const props = withDefaults(defineProps<TiptapProEditorProps>(), {
  zoomBarPlacement: 'bottom',
  readonly: false,
  previewMode: false,
  initialContent: '',
  // 默认全功能：与 0.1.x 行为一致（旧文档含表格/公式可正常打开，AI 入口有对应扩展支撑）；
  // 追求更小运行时的使用者显式传 'basic' / 'minimal'
  version: 'premium',
})

// ===== 预览模式 =====
const isPreviewMode = computed(() => props.previewMode)

const emit = defineEmits<{
  update: [content: any]
  'update:modelValue': [value: string | object]
  collaboratorsChange: [count: number]
  collaboratorsListChange: [users: Array<{ id: string | number; name: string; color: string }>]
}>()

// ===== 基础状态 =====
const editor = shallowRef<Editor | null>(null)
const editorError = ref<string | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const dragHandleMenuRef = ref<InstanceType<typeof DragHandleMenu> | null>(null)
const slashCommandMenuRef = ref<InstanceType<typeof SlashCommandMenu> | null>(null)
const totalPages = ref(1)
const zoomLevel = ref(100)
const isFirstInit = ref(true)
const isInitializing = ref(false)

const editorInstance = computed(() => editor.value as Editor)

// ===== 用户信息获取 =====
const userStore = useUserStore()

/**
 * 获取用户信息
 */
const getUserInfo = (): { id: string | number; name: string } => {
  try {
    const userInfo = userStore.userInfo
    if (userInfo) {
      const id = userInfo.userId || (userInfo as any).id || (userInfo as any).user_id || 'anonymous'
      const name = userInfo.realName || userInfo.userName || (userInfo as any).name || (userInfo as any).real_name || (userInfo as any).username || t('editor.anonymousUser')
      return { id, name }
    }
  } catch {}
  return { id: 'anonymous', name: t('editor.anonymousUser') }
}

// ===== 协作编辑（使用 Composable） =====
const collaboration = useCollaboration({
  getUserInfo,
  onCollaboratorsChange: (count) => emit('collaboratorsChange', count),
  onCollaboratorsListChange: (users) => emit('collaboratorsListChange', users),
})

// 协作功能开关状态（用于 UI 绑定）
const collaborationEnabled = ref(false)

/**
 * 同步协作人数到 editor.storage（供扩展读取）
 * - `FormatPainter` 扩展会读取 `editor.storage.__collaborationUsersCount` 来判断是否需要在多人时禁用
 */
watch(
  () => [editor.value, collaboration.collaboratorsCount.value] as const,
  ([e, count]) => {
    if (!e) return
    try {
      ;(e as any).storage.__collaborationUsersCount = count
    } catch {}
  },
  { immediate: true }
)

/**
 * 获取功能配置值
 */
const getFeatureConfig = (featureName: 'headerNav' | 'footerNav' | 'collaboration'): boolean => {
  if (props.features?.[featureName] !== undefined) {
    return props.features[featureName] as boolean
  }
  if (props.versionConfig?.features?.[featureName] !== undefined) {
    return props.versionConfig.features[featureName] as boolean
  }
  return false
}

// ===== 功能显示控制 =====
const shouldShowHeaderNav = computed(() => getFeatureConfig('headerNav'))
const shouldShowFooterNav = computed(() => getFeatureConfig('footerNav'))

// 协作功能需要环境变量配置 VITE_COLLABORATION_WS_URL
const collaborationWsUrl = computed(() => import.meta.env?.VITE_COLLABORATION_WS_URL || '')

// 组件是否启用协作（features.collaboration）
const isCollaborationFeatureEnabled = computed(() => getFeatureConfig('collaboration'))

// 检查并提示：如果组件开启了协作但没有配置 WS URL
const shouldShowCollaboration = computed(() => {
  if (isCollaborationFeatureEnabled.value && !collaborationWsUrl.value) {
    console.warn('[Tiptap UI Kit] Collaboration feature enabled but VITE_COLLABORATION_WS_URL is not configured in .env')
    return false
  }
  return isCollaborationFeatureEnabled.value && !!collaborationWsUrl.value
})

/**
 * 检查协作功能是否可用
 */
const isCollaborationAvailable = computed(() => {
  return collaborationEnabled.value && shouldShowCollaboration.value && !!props.documentId
})

// ===== 协作功能开关处理 =====
const handleCollaborationChange = async (enabled: boolean) => {
  if (collaborationEnabled.value !== enabled) {
    collaborationEnabled.value = enabled
  }
}

// 监听 shouldShowCollaboration 变化，同步到 collaborationEnabled
watch(
  () => shouldShowCollaboration.value,
  (newValue) => {
    if (collaborationEnabled.value !== newValue) {
      collaborationEnabled.value = newValue
    }
  },
  { immediate: true }
)

// 监听 collaborationEnabled 变化，重新初始化编辑器
watch(
  () => collaborationEnabled.value,
  async (newValue, oldValue) => {
    if (oldValue === undefined) return
    if (newValue !== oldValue && editor.value && !isInitializing.value) {
      await initEditor()
    }
  }
)

// ===== 工具栏配置 =====
const toolbarConfig = computed<ToolbarToolsConfig>(() => {
  // 协作模式下，两人及以上时禁用撤销/重做和格式刷按钮
  // 单人时不禁用，保持正常使用体验
  const disableUndoRedo = isCollaborationAvailable.value && collaboration.collaboratorsCount.value > 1
  
  switch (props.version) {
    case 'advanced':
    case 'premium':
      return {
        ...ADVANCED_TOOLBAR_CONFIG,
        codeBlock: true,
        link: true,
        table: true,
        font: true,
        lineHeight: true,
        clearFormat: true,
        undoRedo: true,
        undoRedoDisabled: disableUndoRedo,
        subscriptSuperscript: true,
        formatPainter: true,
        formatPainterDisabled: disableUndoRedo,
      }
    case 'basic':
    default:
      return {
        ...BASIC_TOOLBAR_CONFIG,
        undoRedo: true,
        undoRedoDisabled: disableUndoRedo,
      }
  }
})

// AI 文档助手：仅在加载了 AI 扩展的档位（advanced/premium）可用；
// versionConfig.features.ai 与 features.aiChat 均可显式关闭；预览/只读下隐藏
const aiChatEnabled = computed(
  () =>
    (props.version === 'advanced' || props.version === 'premium') &&
    props.versionConfig?.features?.ai !== false &&
    props.features?.aiChat !== false &&
    !isPreviewMode.value &&
    !props.readonly
)

// ===== 国际化 =====
// Use locale from props instead of @vben/locales
// 不传 locale 时按浏览器语言自动检测（zh → zh-CN/zh-TW，其它 → en-US）
const currentLocale = computed(() => props.locale || detectDefaultLocale())

const mapLocaleToTiptapLocale = (locale: string): LocaleCode => {
  const localeMap: Record<string, LocaleCode> = {
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'zh-HK': 'zh-TW',
    'en-US': 'en-US',
    'en': 'en-US',
  }
  if (localeMap[locale]) return localeMap[locale]
  if (locale.startsWith('zh')) return locale.includes('TW') || locale.includes('HK') ? 'zh-TW' : 'zh-CN'
  if (locale.startsWith('en')) return 'en-US'
  return 'zh-CN'
}

const initTiptapI18n = () => {
  const tiptapLocale = mapLocaleToTiptapLocale(currentLocale.value)
  createI18n({ locale: tiptapLocale, fallbackLocale: 'en-US' })
}

initTiptapI18n()

watch(
  () => currentLocale.value,
  (newLocale) => {
    const tiptapLocale = mapLocaleToTiptapLocale(newLocale)
    const tiptapI18n = useTiptapI18n()
    tiptapI18n.setLocale(tiptapLocale)
  },
  { immediate: false }
)

// ===== 页面计算 =====
const calculatePages = () => {
  nextTick(() => {
    const proseMirrorEl = containerRef.value?.querySelector('.ProseMirror')
    if (!proseMirrorEl) return

    const style = getComputedStyle(proseMirrorEl as Element)
    const paddingTop = parseFloat(style.paddingTop) || 0
    const paddingBottom = parseFloat(style.paddingBottom) || 0
    const contentHeight = proseMirrorEl.scrollHeight - (paddingTop + paddingBottom)
    const pageContentHeight = A4_HEIGHT_PX - (paddingTop + paddingBottom)
    const pages = Math.ceil(contentHeight / pageContentHeight)
    totalPages.value = Math.max(pages, 1)
  })
}

// 分页计算：防抖 + requestAnimationFrame 合帧，避免输入时频繁强制重排
// （编辑器初始化后的首次分页计算仍直接调用 calculatePages，保证首屏不跳动）
let pagesRafId: number | null = null
const schedulePageCalculation = debounce(() => {
  if (pagesRafId !== null) cancelAnimationFrame(pagesRafId)
  pagesRafId = requestAnimationFrame(() => {
    pagesRafId = null
    calculatePages()
  })
}, 200)

// update 事件防抖派发（getJSON 全文序列化开销较大）
const emitUpdateDebounced = debounce((editorInst: CoreEditor) => {
  if (editorInst.isDestroyed) return
  emit('update', editorInst.getJSON())
}, 200)

// ===== 编辑器内容管理 =====
const getEditorContent = () => {
  try {
    return editor.value?.getJSON() ?? null
  } catch {
    return null
  }
}

const getInitialContent = (): any => {
  // 非首次初始化且未开启协作，保留当前内容
  if (!isFirstInit.value && editor.value && !isCollaborationAvailable.value) {
    const currentContent = getEditorContent()
    if (currentContent) return currentContent
  }
  // 使用 collaboration 模块的 normalizeContent（modelValue 优先于 initialContent）
  return normalizeContent(props.modelValue ?? props.initialContent, { silent: true })
}

// ===== v-model 支持 =====
// 以「是否绑定了 update:modelValue 监听器」判定 v-model 是否启用：
// 用 ref<string>()（初值 undefined）绑定 v-model 是常见写法，不能用 modelValue !== undefined 判定
const hasModelValueListener = !!getCurrentInstance()?.vnode.props?.['onUpdate:modelValue']

// 记录最近一次 emit 出去的值：v-model 回环写回时 O(1) 短路，避免每次按键的二次全文序列化
let lastEmittedModelValue: string | object | undefined

/**
 * 同步 v-model（不防抖，v-model 语义要求同步）
 * @description modelValue 当前为 object 时输出 JSON，否则输出 HTML 字符串
 */
const emitModelValue = (editorInst: CoreEditor) => {
  if (!hasModelValueListener) return
  const isObjectMode = typeof props.modelValue === 'object' && props.modelValue !== null
  const value = isObjectMode ? editorInst.getJSON() : editorInst.getHTML()
  lastEmittedModelValue = value
  emit('update:modelValue', value)
}

// 外部 modelValue 变化时同步到编辑器（先与当前内容比较，避免 v-model 循环更新）
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === undefined || !editor.value) return
    // 我们刚 emit 出去的值被父组件写回来了（v-model 回环），直接短路
    if (newValue === lastEmittedModelValue) return
    // 协作模式下内容由 Yjs 共享文档管理，外部整体 setContent 会覆盖所有协作者的内容
    if (isCollaborationAvailable.value) {
      console.warn('[TiptapProEditor] Ignoring external modelValue write while collaboration is active.')
      return
    }
    const isObjectMode = typeof newValue === 'object' && newValue !== null
    const isSame = isObjectMode
      ? JSON.stringify(editor.value.getJSON()) === JSON.stringify(newValue)
      : editor.value.getHTML() === newValue
    if (!isSame) {
      editor.value.commands.setContent(newValue as any, { emitUpdate: false })
      schedulePageCalculation()
    }
  }
)

// ===== 协作功能初始化（使用 useCollaboration） =====
const initCollaborationFeature = async (initialContent: any, extensions: any[]) => {
  if (!isCollaborationAvailable.value) {
    collaboration.disable()
    return
  }

  try {
    // 如果已有协作实例，先销毁
    if (collaboration.instance.value) {
      collaboration.disable()
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 使用 useCollaboration 的 initWithExtensions 方法
    // 这样会自动处理状态更新（collaboratorsCount, collaboratorsList）
    const collabExtensions = await collaboration.initWithExtensions({
      documentId: props.documentId!,
      readonly: props.readonly,
      initialContent,
      getUserInfo,
    })

    if (collabExtensions.length === 0) {
      return
    }

    // 添加协作扩展
    extensions.push(...collabExtensions)
  } catch {}
}

// 注：工具栏状态的「事务 → 响应式」桥接由各子组件的 useReactiveEditor（src/utils/editorState.ts）
// 自行订阅完成，本组件无需（也不应）在父级做 triggerRef 广播。

// ===== 编辑器初始化 =====
const initEditor = async () => {
  if (isInitializing.value) return

  try {
    isInitializing.value = true

    const initialContentToUse = getInitialContent()

    if (isFirstInit.value) {
      isFirstInit.value = false
    }

    // 获取扩展配置
    // 协作模式下需要禁用 History 扩展，因为 @tiptap/extension-collaboration 自带历史管理
    const enableImageResize = props.versionConfig?.features?.advanced !== false
    const extensions = getExtensionsByVersion(props.version, {
      enableImageResize,
      disableHistory: isCollaborationAvailable.value,
    })

    // 添加拖拽手柄扩展
    if (props.features?.dragHandleMenu) {
      extensions.push(
        DragHandleWithMenuExtension.configure({
          onHandleClick: (event) => dragHandleMenuRef.value?.handleDragHandleClick(event),
        })
      )
    }

    // 添加斜杠命令扩展
    if (props.features?.slashCommand) {
      extensions.push(
        SlashCommandExtension.configure({
          onActivate: (state: SlashCommandState) => slashCommandMenuRef.value?.activate(state),
          onDeactivate: () => slashCommandMenuRef.value?.hide(),
          onQueryChange: (query: string) => slashCommandMenuRef.value?.updateQuery(query),
        })
      )
    }

    // 初始化协作功能
    await initCollaborationFeature(initialContentToUse, extensions)

    // 销毁旧编辑器（先 flush 待派发的 update，避免丢失最后 200ms 内的输入）
    if (editor.value) {
      emitUpdateDebounced.flush()
      editor.value.destroy()
      editor.value = null
    }

    await nextTick()

    // 协作模式下不设置初始内容
    const shouldSetContentOnInit = !isCollaborationAvailable.value

    // 创建编辑器（预览模式下也设为不可编辑）
    editor.value = new Editor({
      editable: !props.readonly && !isPreviewMode.value,
      extensions,
      content: shouldSetContentOnInit ? initialContentToUse : undefined,
      editorProps: {
        attributes: { class: 'word-editor-content' },
      },
      onUpdate: ({ editor }) => {
        schedulePageCalculation()
        // v-model 同步不防抖，update 事件防抖派发
        emitModelValue(editor)
        emitUpdateDebounced(editor)
      },
    })

    await nextTick()

    // 更新协作实例中的 editor 引用
    if (collaboration.instance.value && editor.value) {
      collaboration.setEditor(editor.value)
    }

    // 初始化 CSS 变量
    if (containerRef.value) {
      containerRef.value.style.setProperty('--a4-width-px', `${A4_WIDTH_PX}px`)
      containerRef.value.style.setProperty('--padding-top-px', `${PAGE_PADDING_TOP_PX}px`)
      containerRef.value.style.setProperty('--padding-bottom-px', `${PAGE_PADDING_BOTTOM_PX}px`)
      containerRef.value.style.setProperty('--page-content-height-px', `${PAGE_CONTENT_HEIGHT_PX}px`)
    }

    calculatePages()
    // 观察内容元素尺寸：字体/图片/异步 NodeView 加载完成引起的内容高度变化都会触发页数重算
    observeContentResize()
  } catch (error) {
    console.error('[TiptapProEditor] Editor initialization failed:', error)
    editorError.value = t('editor.initFailed')
  } finally {
    isInitializing.value = false
  }
}

// ===== 清理 =====
const destroyEditor = async () => {
  collaboration.disable()
  if (editor.value) {
    // 先 flush 待派发的 update，避免丢失最后 200ms 内的输入（自动保存场景）
    emitUpdateDebounced.flush()
    editor.value.destroy()
    editor.value = null
  }
}

// ===== 生命周期 =====
// 观察「内容元素 + 外层容器」的尺寸变化重算页数：
// 内容元素（.ProseMirror）覆盖字体/图片加载、异步 NodeView 造成的内容高度变化；
// 外层容器覆盖窗口缩放、编辑器从隐藏容器变为可见等布局场景
let containerResizeObserver: ResizeObserver | null = null

const observeContentResize = () => {
  if (typeof ResizeObserver === 'undefined') return
  if (!containerResizeObserver) {
    containerResizeObserver = new ResizeObserver(() => {
      schedulePageCalculation()
    })
  } else {
    containerResizeObserver.disconnect()
  }
  if (containerRef.value) containerResizeObserver.observe(containerRef.value)
  const contentDom = editor.value?.view?.dom
  if (contentDom) containerResizeObserver.observe(contentDom)
}

onMounted(async () => {
  await initEditor()
  // 字体加载完成后内容高度会变化，就绪后再校正一次页数
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => schedulePageCalculation()).catch(() => {})
  }
})

onBeforeUnmount(async () => {
  containerResizeObserver?.disconnect()
  containerResizeObserver = null
  // 分页计算直接丢弃；update 事件在 destroyEditor 内 flush（不丢最后 200ms 的输入）
  schedulePageCalculation.cancel()
  if (pagesRafId !== null) {
    cancelAnimationFrame(pagesRafId)
    pagesRafId = null
  }
  await destroyEditor()
})

// ===== 属性监听 =====
const watchAndReinit = (
  getter: () => any,
  shouldReinit: (newValue: any, oldValue: any) => boolean = (newVal, oldVal) => newVal !== oldVal
) => {
  watch(
    getter,
    async (newValue, oldValue) => {
      if (oldValue === undefined || !editor.value || isInitializing.value) return
      if (shouldReinit(newValue, oldValue)) {
        await nextTick()
        await initEditor()
      }
    }
  )
}

watchAndReinit(
  () => props.features?.dragHandleMenu,
  (newVal, oldVal) => (newVal ?? false) !== (oldVal ?? false)
)

watchAndReinit(
  () => props.features?.slashCommand,
  (newVal, oldVal) => (newVal ?? false) !== (oldVal ?? false)
)

watchAndReinit(
  () => props.documentId,
  (newId, oldId) => shouldShowCollaboration.value && newId !== oldId
)

// ===== 暴露方法 =====
defineExpose({
  getEditor: () => editor.value,
  getJSON: () => editor.value?.getJSON() || null,
  getHTML: () => editor.value?.getHTML() || '',
  getText: () => editor.value?.getText() || '',
})
</script>

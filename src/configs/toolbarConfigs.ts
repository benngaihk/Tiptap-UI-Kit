/**
 * Toolbar Config Factories
 * 提供创建工具栏按钮与菜单项的工厂函数
 */
import { computed } from 'vue'
import type { Editor } from '@tiptap/core'

import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  EditOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
  FileTextOutlined,
  BulbOutlined,
} from '@ant-design/icons-vue'

import { createCommandRunner } from '@/utils/editorCommands'
// import { currentTranslateLang, setTranslateLang } from '../stores/translate'
// 暂时注释掉，后续迁移
const currentTranslateLang = { value: '' }
const setTranslateLang = (_label: string) => {}
import type {
  ToolbarButtonConfig,
  HeadingConfig,
  ListToolConfig,
  MenuItemConfig,
} from './toolbar'

/**
 * 创建文本格式工具配置
 */
export function createTextFormatTools(editor: Editor): ToolbarButtonConfig[] {
  const runCommand = createCommandRunner(computed(() => editor))

  return [
    {
      name: 'bold',
      icon: BoldOutlined,
      title: '粗体 (Ctrl+B)',
      action: runCommand((chain) => chain.toggleBold()),
    },
    {
      name: 'italic',
      icon: ItalicOutlined,
      title: '斜体 (Ctrl+I)',
      action: runCommand((chain) => chain.toggleItalic()),
    },
    {
      name: 'underline',
      icon: UnderlineOutlined,
      title: '下划线 (Ctrl+U)',
      action: runCommand((chain) => (chain as any).toggleUnderline?.() ?? chain),
    },
    {
      name: 'strike',
      icon: StrikethroughOutlined,
      title: '删除线',
      action: runCommand((chain) => chain.toggleStrike()),
    },
    {
      name: 'code',
      icon: CodeOutlined,
      title: '行内代码',
      action: runCommand((chain) => chain.toggleCode()),
    },
  ]
}

/**
 * 创建标题工具配置
 */
export function createHeadingTools(editor: Editor): HeadingConfig[] {
  const runCommand = createCommandRunner(computed(() => editor))

  const levels = [1, 2, 3, 4, 5, 6] as const
  return levels.map((level) => ({
    level,
    title: `标题 ${level}`,
    action: runCommand((chain) => chain.toggleHeading({ level })),
  }))
}

/**
 * 创建列表工具配置
 */
export function createListTools(editor: Editor): ListToolConfig[] {
  const runCommand = createCommandRunner(computed(() => editor))

  return [
    {
      name: 'bulletList',
      icon: UnorderedListOutlined,
      title: '无序列表',
      action: runCommand((chain) => chain.toggleBulletList()),
    },
    {
      name: 'orderedList',
      icon: OrderedListOutlined,
      title: '有序列表',
      action: runCommand((chain) => chain.toggleOrderedList()),
    },
    {
      name: 'taskList',
      icon: CheckSquareOutlined,
      title: '任务列表',
      action: runCommand((chain) => (chain as any).toggleTaskList?.() ?? chain),
    },
  ]
}

/**
 * 创建 AI 工具菜单项配置
 * @param editor 编辑器实例
 * @param t 翻译函数，用于国际化
 */
export function createAiToolMenuItems(editor: Editor, t: (key: string, params?: Record<string, any>) => string = (key) => key): MenuItemConfig[] {
  const defaultLang = currentTranslateLang.value || ''
  
  // 语言代码映射
  const LANGUAGE_CODES = [
    { code: 'zh-CN', key: 'zh-CN' },
    { code: 'zh-TW', key: 'zh-TW' },
    { code: 'en', key: 'en' },
    { code: 'ja', key: 'ja' },
    { code: 'th', key: 'th' },
    { code: 'fr', key: 'fr' },
    { code: 'es', key: 'es' },
    { code: 'pt', key: 'pt' },
    { code: 'ko', key: 'ko' },
    { code: 'vi', key: 'vi' },
    { code: 'ru', key: 'ru' },
    { code: 'de', key: 'de' },
    { code: 'hi', key: 'hi' },
    { code: 'id', key: 'id' },
  ]

  return [
    {
      key: 'continueWriting',
      label: t('editor.continueWriting'),
      icon: ThunderboltOutlined,
      action: () => {
        editor.commands.focus()
        ;(editor.commands as any).continueWriting?.()
      },
    },
    {
      key: 'polish',
      label: t('editor.polish'),
      icon: EditOutlined,
      action: () => {
        editor.commands.focus()
        ;(editor.commands as any).polish?.()
      },
    },
    {
      key: 'summarize',
      label: t('editor.summarize'),
      icon: FileTextOutlined,
      action: () => {
        editor.commands.focus()
        ;(editor.commands as any).summarize?.()
      },
    },
    {
      key: 'translate',
      label: defaultLang ? t('editor.translateTo', { lang: defaultLang }) : t('editor.translate'),
      icon: TranslationOutlined,
      action: () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            editor.commands.focus()
            ;(editor.commands as any).translate?.(currentTranslateLang.value)
          })
        })
      },
      children: LANGUAGE_CODES.map(({ code, key }) => {
        const langLabel = t(`editor.lang.${key}`)
        return {
          key: `translate-${code}`,
          label: langLabel,
          action: () => {
            setTranslateLang(langLabel)
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                editor.commands.focus()
                ;(editor.commands as any).translate?.(langLabel)
              })
            })
          },
        }
      }),
    },
    {
      key: 'customAi',
      label: t('editor.customAi'),
      icon: BulbOutlined,
      action: () => {
        editor.commands.focus()
        ;(editor.commands as any).customAi?.()
      },
    },
  ]
}


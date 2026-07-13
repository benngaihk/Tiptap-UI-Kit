/**
 * Editor State Utilities
 * @description 编辑器状态检查工具函数
 */

import { onBeforeUnmount, shallowRef, triggerRef, watch } from 'vue'
import type { Ref } from 'vue'
import type { Editor } from '@tiptap/core'

/** Attribute value type for editor state checks */
type AttributeValue = string | number | boolean | null | undefined

/**
 * 让编辑器实例变成"事务响应式"
 * @description Tiptap 的事务不会触发 Vue 响应式更新（editor 实例身份不变），
 * 导致依赖 editor 的 computed（isActive/getAttributes 等）不跟随光标移动重新求值。
 * 本组合式函数内部订阅 editor 的 transaction 事件并 triggerRef 强制通知依赖方。
 * 注意：不能用「computed 依赖 tick」实现——computed 重新求值后返回的仍是同一个
 * Editor 实例，Vue 会因值相等（===）跳过下游 effect，必须用 triggerRef 绕过该截断。
 * 自动处理实例更换与卸载清理。必须在组件 setup 中调用。
 *
 * @example
 * ```typescript
 * const editor = useReactiveEditor(() => props.editor)
 * const { isActive } = createStateCheckers(editor) // isActive 现在跟随光标变化
 * ```
 */
export function useReactiveEditor<T extends Editor>(
  getEditor: () => T | null | undefined
): Ref<T | null> {
  // watch 的 immediate 回调会立即写入当前值，这里只需 null 初始化
  const editorRef = shallowRef(null) as Ref<T | null>
  let current: Editor | null = null
  const onTransaction = () => {
    if (current && !current.isDestroyed) triggerRef(editorRef)
  }
  watch(
    getEditor,
    (e) => {
      if (current) current.off('transaction', onTransaction)
      current = e ?? null
      editorRef.value = (e ?? null) as T | null
      if (current) current.on('transaction', onTransaction)
    },
    { immediate: true }
  )
  onBeforeUnmount(() => {
    if (current) {
      current.off('transaction', onTransaction)
      current = null
    }
  })
  return editorRef
}

/**
 * 状态检查器接口
 */
export interface StateCheckers {
  /** 检查节点/标记是否激活 */
  isActive: (name: string, attributes?: Record<string, AttributeValue>) => boolean
  /** 检查标题级别是否激活 */
  isHeadingActive: (level: number) => boolean
  /** 检查对齐方式是否激活 */
  isActiveAlign: (value: 'left' | 'center' | 'right' | 'justify') => boolean
  /** 检查命令是否可执行 */
  canExecute: (command: string) => boolean
}

/**
 * 创建状态检查器
 * @description 创建一组用于检查编辑器状态的函数
 * @param editor - 编辑器实例引用
 * @returns 状态检查函数集合
 *
 * @example
 * ```typescript
 * const { isActive, isHeadingActive, canExecute } = createStateCheckers(editor)
 *
 * if (isActive('bold')) {
 *   console.log('当前文本是粗体')
 * }
 *
 * if (isHeadingActive(1)) {
 *   console.log('当前是标题 1')
 * }
 *
 * if (canExecute('toggleBold')) {
 *   console.log('可以切换粗体')
 * }
 * ```
 */
export function createStateCheckers(editor: Ref<Editor | null | undefined>): StateCheckers {
  return {
    /**
     * 检查节点/标记是否激活
     * @param name - 节点或标记名称
     * @param attributes - 可选的属性对象
     * @returns 是否激活
     */
    isActive: (name: string, attributes?: Record<string, AttributeValue>) => {
      const e = editor.value
      if (!e) return false
      return attributes ? e.isActive(name, attributes) : e.isActive(name)
    },

    /**
     * 检查标题级别是否激活
     * @param level - 标题级别 (1-6)
     * @returns 是否激活
     */
    isHeadingActive: (level: number) => {
      const e = editor.value
      if (!e) return false
      return e.isActive('heading', { level })
    },

    /**
     * 检查对齐方式是否激活
     * @param value - 对齐方式
     * @returns 是否激活
     */
    isActiveAlign: (value: 'left' | 'center' | 'right' | 'justify') => {
      const e = editor.value
      if (!e) return false
      return e.isActive({ textAlign: value })
    },

    /**
     * 检查命令是否可执行
     * @param command - 命令名称
     * @returns 是否可执行
     */
    canExecute: (command: string) => {
      const e = editor.value
      if (!e) return false
      // Tiptap commands are dynamically added, use type assertion through unknown
      const canObj = e.can() as unknown as Record<string, ((...args: unknown[]) => boolean) | undefined>
      const fn = canObj[command]
      return typeof fn === 'function' ? fn() : false
    },
  }
}

/**
 * 检查节点/标记是否激活
 * @description 直接检查，无需创建检查器对象
 * @param editor - 编辑器实例引用
 * @param name - 节点或标记名称
 * @param attributes - 可选的属性对象
 * @returns 是否激活
 *
 * @example
 * ```typescript
 * if (isActive(editor, 'bold')) {
 *   console.log('粗体已激活')
 * }
 * ```
 */
export function isActive(
  editor: Ref<Editor | null | undefined>,
  name: string,
  attributes?: Record<string, AttributeValue>
): boolean {
  const e = editor.value
  if (!e) return false
  return attributes ? e.isActive(name, attributes) : e.isActive(name)
}

/**
 * 检查标题级别是否激活
 * @param editor - 编辑器实例引用
 * @param level - 标题级别 (1-6)
 * @returns 是否激活
 */
export function isHeadingActive(
  editor: Ref<Editor | null | undefined>,
  level: number
): boolean {
  const e = editor.value
  if (!e) return false
  return e.isActive('heading', { level })
}

/**
 * 检查对齐方式是否激活
 * @param editor - 编辑器实例引用
 * @param value - 对齐方式
 * @returns 是否激活
 */
export function isActiveAlign(
  editor: Ref<Editor | null | undefined>,
  value: 'left' | 'center' | 'right' | 'justify'
): boolean {
  const e = editor.value
  if (!e) return false
  return e.isActive({ textAlign: value })
}

/**
 * 检查命令是否可执行
 * @param editor - 编辑器实例引用
 * @param command - 命令名称
 * @returns 是否可执行
 */
export function canExecute(
  editor: Ref<Editor | null | undefined>,
  command: string
): boolean {
  const e = editor.value
  if (!e) return false
  const canObj = e.can() as unknown as Record<string, ((...args: unknown[]) => boolean) | undefined>
  const fn = canObj[command]
  return typeof fn === 'function' ? fn() : false
}

/**
 * 获取当前段落样式
 * @description 获取当前光标位置的段落样式（正文或标题级别）
 * @param editor - 编辑器实例引用
 * @returns 段落样式标识 ('paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
 */
export function getCurrentParagraphStyle(
  editor: Ref<Editor | null | undefined>
): string {
  const e = editor.value
  if (!e) return 'paragraph'

  for (let i = 1; i <= 6; i++) {
    if (e.isActive('heading', { level: i })) {
      return `h${i}`
    }
  }

  return 'paragraph'
}

/**
 * 获取当前文本对齐方式
 * @description 获取当前光标位置的文本对齐方式
 * @param editor - 编辑器实例引用
 * @returns 对齐方式 ('left' | 'center' | 'right' | 'justify')
 */
export function getCurrentTextAlign(
  editor: Ref<Editor | null | undefined>
): 'left' | 'center' | 'right' | 'justify' {
  const e = editor.value
  if (!e) return 'left'

  const alignments: Array<'left' | 'center' | 'right' | 'justify'> = [
    'left',
    'center',
    'right',
    'justify',
  ]

  for (const align of alignments) {
    if (e.isActive({ textAlign: align })) {
      return align
    }
  }

  return 'left'
}



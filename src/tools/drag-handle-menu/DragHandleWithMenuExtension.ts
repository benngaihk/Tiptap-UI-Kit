/**
 * DragHandleWithMenu Extension - 六个点显示扩展
 * @description 为块级元素添加可点击的拖拽手柄（六个点）
 * @features
 * - 在块级元素左侧显示六个点图标
 * - 点击六个点触发菜单显示
 * - 自动排除表格、图片等特殊节点
 * - 智能处理列表嵌套情况
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { h, render } from 'vue'
import { HolderOutlined } from '@ant-design/icons-vue'

// ============================================================================
// 常量
// ============================================================================

export const dragHandleWithMenuKey = new PluginKey('dragHandleWithMenu')

// 不显示手柄的节点类型
const EXCLUDED_NODE_TYPES = ['doc', 'table', 'image', 'figure', 'tableCell', 'tableHeader'] as const
const EXCLUDED_LIST_TYPES = ['taskList', 'listItem', 'taskItem'] as const
const ALLOWED_LIST_TYPES = ['orderedList', 'bulletList'] as const

// ============================================================================
// 类型定义
// ============================================================================

export interface DragHandleClickEvent {
  position: { x: number; y: number }
  nodePos: number
  nodeTo: number
  handleElement: HTMLElement
}

export interface DragHandleWithMenuOptions {
  onHandleClick?: (event: DragHandleClickEvent) => void
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 判断是否应该显示六个点
 * @description 根据节点类型和父节点类型判断是否显示拖拽手柄
 * @param node 当前节点
 * @param parent 父节点
 * @returns 是否显示手柄
 */
function shouldShowHandle(node: ProseMirrorNode, parent: ProseMirrorNode): boolean {
  // 必须是块级元素，且不是文档根节点
  if (!node.isBlock || node.type.name === 'doc') return false

  // 排除特定节点类型
  if (EXCLUDED_NODE_TYPES.includes(node.type.name as any)) return false
  if (parent.type.name === 'table') return false

  // 列表处理逻辑
  if (ALLOWED_LIST_TYPES.includes(node.type.name as any)) {
    return true // 有序列表和无序列表显示手柄
  }

  if (EXCLUDED_LIST_TYPES.includes(node.type.name as any)) {
    return false // 任务列表和列表项不显示手柄
  }

  // 列表项内部的段落不显示手柄
  if (
    (parent.type.name === 'listItem' || parent.type.name === 'taskItem') &&
    node.type.name === 'paragraph'
  ) {
    return false
  }

  // 如果父节点是有序列表或无序列表，其内部的段落不显示手柄
  if (
    ALLOWED_LIST_TYPES.includes(parent.type.name as any) &&
    node.type.name === 'paragraph'
  ) {
    return false
  }

  // 表格单元格内不显示手柄
  if (parent.type.name === 'tableCell' || parent.type.name === 'tableHeader') {
    return false
  }

  // 空节点不显示手柄
  if (node.content.size === 0) return false

  return true
}

/**
 * 创建六个点的 DOM 元素
 * @description 六个点只负责显示和点击事件，不包含拖拽功能
 * @param node 节点
 * @param pos 节点位置
 * @param view 编辑器视图
 * @param onHandleClick 点击回调
 * @returns 手柄 DOM 元素
 */
function createDragHandle(
  node: ProseMirrorNode,
  pos: number,
  view: any,
  onHandleClick?: (event: DragHandleClickEvent) => void
): HTMLElement {
  const handle = document.createElement('div')
  handle.className = 'drag-handle'
  handle.contentEditable = 'false'
  // 六个点本身不包含拖拽功能，只用于显示和点击
  handle.draggable = false

  // 使用 Ant Design Vue 图标：HolderOutlined
  // 直接渲染到手柄元素内，避免维护自定义 SVG
  render(h(HolderOutlined), handle)

  // 阻止 mousedown 冒泡和默认行为，防止触发 ProseMirror 的选区更新导致组件重渲染
  // 从而解决了"需要点击两次"的问题
  handle.addEventListener('mousedown', (e) => {
    e.stopPropagation()
    e.preventDefault()
  })

  // 点击事件处理
  handle.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const nodeTo = pos + node.nodeSize
    const handleRect = handle.getBoundingClientRect()

    // 移除其他 handle 的 active 类（确保只有一个激活）
    view.dom.querySelectorAll('.drag-handle.active').forEach((el: Element) => {
      el.classList.remove('active')
    })

    // 添加 active 类
    handle.classList.add('active')

    // 触发回调，传递位置和节点信息
    if (onHandleClick) {
      onHandleClick({
        position: { x: handleRect.right + 10, y: handleRect.top },
        nodePos: pos,
        nodeTo,
        handleElement: handle,
      })
    }
  })

  return handle
}

// ============================================================================
// 扩展定义
// ============================================================================

export const DragHandleWithMenuExtension = Extension.create<DragHandleWithMenuOptions>({
  name: 'dragHandleWithMenu',

  addOptions() {
    return {
      onHandleClick: undefined,
    }
  },

  addProseMirrorPlugins() {
    const options = this.options

    return [
      new Plugin({
        key: dragHandleWithMenuKey,

        props: {
          decorations(state) {
            const decorations: Decoration[] = []

            state.doc.descendants((node, pos) => {
              const $pos = state.doc.resolve(pos)
              const parent = $pos.parent

              if (!shouldShowHandle(node, parent)) {
                return true
              }

              // 将手柄插入到块级节点内部（pos + 1），以便 CSS 能在该块 hover 时显示
              decorations.push(
                Decoration.widget(
                  pos + 1,
                  (view) => createDragHandle(node, pos, view, options.onHandleClick),
                  {
                    side: -1,
                    stopEvent: (e) => {
                      // 让 ProseMirror 忽略手柄上的 mousedown 和 click 事件
                      // 确保 DOM 事件能正常被 handle 及其子元素捕获
                      return e.type === 'mousedown' || e.type === 'click'
                    },
                  }
                )
              )

              return true
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})


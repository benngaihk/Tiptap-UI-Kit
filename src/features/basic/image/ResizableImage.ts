/**
 * ResizableImage Extension - 可调整大小的图片扩展（支持拖拽移动）
 * @description 扩展标准 Image 扩展，支持 width、height 属性用于调整图片大小，并添加可拖拽的调整手柄
 * @features
 * - 支持图片在文字之间拖拽移动（独立实现，不依赖 drag-handle）
 * - 支持图片大小调整（等比例缩放）
 * - 支持图片对齐（左对齐、居中、右对齐）
 */

import Image from '@tiptap/extension-image'

export interface ResizableImageOptions {
  HTMLAttributes?: Record<string, any>
  inline?: boolean
  allowBase64?: boolean
  /** 是否启用图片增强功能（拖拽大小调整），默认 true */
  enableResize?: boolean
}

export const ResizableImage = Image.extend<ResizableImageOptions>({
  name: 'image',

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
      inline: true,
      allowBase64: true,
      enableResize: true, // 默认开启图片增强功能
    }
  },

  addAttributes() {
    // 创建尺寸属性的通用配置
    const createSizeAttribute = (name: 'width' | 'height') => ({
      default: null,
      parseHTML: (element: HTMLElement) => {
        const value = element.getAttribute(name)
        return value ? parseInt(value, 10) : null
      },
      renderHTML: (attributes: Record<string, any>) => {
        return attributes[name] ? { [name]: attributes[name] } : {}
      },
    })

    return {
      ...this.parent?.(),
      width: createSizeAttribute('width'),
      height: createSizeAttribute('height'),
      align: {
        default: null,
        parseHTML: (element) => {
          const align =
            element.getAttribute('data-align') ||
            element.style.textAlign ||
            element.parentElement?.style.textAlign
          return align === 'left' || align === 'center' || align === 'right' ? align : null
        },
        renderHTML: (attributes) => {
          return attributes.align ? { 'data-align': attributes.align } : {}
        },
      },
    }
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const options = this.options
      const enableResize = options.enableResize !== false // 默认开启
      
      const dom = document.createElement('div')
      dom.className = 'resizable-image-wrapper'
      dom.setAttribute('data-type', 'resizable-image-wrapper')
      
      // 设置对齐方式
      if (node.attrs.align) {
        dom.style.textAlign = node.attrs.align
        dom.setAttribute('data-align', node.attrs.align)
      }

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.alt = node.attrs.alt || ''
      img.title = node.attrs.title || ''
      
      // 根据配置决定是否启用拖拽功能
      if (enableResize) {
        img.draggable = true
        img.style.cursor = 'move'
      }

      // 设置图片大小
      const updateImageSize = () => {
        if (node.attrs.width) {
          img.style.width = `${node.attrs.width}px`
          img.style.height = 'auto'
        } else if (node.attrs.height) {
          img.style.height = `${node.attrs.height}px`
          img.style.width = 'auto'
        } else {
          img.style.maxWidth = '100%'
          img.style.height = 'auto'
        }
      }
      updateImageSize()

      // 图片加载完成后，如果没有设置宽度，使用自然宽度
      img.onload = () => {
        if (!node.attrs.width && !node.attrs.height && img.naturalWidth > 0) {
          img.style.width = `${img.naturalWidth}px`
          img.style.height = 'auto'
        }
      }

      // 应用其他 HTML 属性
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (key !== 'width' && key !== 'height' && key !== 'src' && key !== 'alt' && key !== 'title') {
          img.setAttribute(key, value)
        }
      })

      // 创建右下角的调整手柄（圆点模式）- 仅在启用增强功能时创建
      let resizeHandle: HTMLDivElement | null = null
      if (enableResize) {
        resizeHandle = document.createElement('div')
        resizeHandle.className = 'resize-handle'
        resizeHandle.setAttribute('contenteditable', 'false')
        // 阻止调整手柄触发图片拖拽
        resizeHandle.draggable = false
        dom.appendChild(resizeHandle)
      }

      dom.appendChild(img)

      // 图片点击事件，选中图片节点
      dom.addEventListener('click', (e) => {
        if (enableResize && resizeHandle && (e.target === resizeHandle || resizeHandle.contains(e.target as HTMLElement))) {
          return
        }
        e.stopPropagation()
        const pos = typeof getPos === 'function' ? getPos() : null
        if (pos !== null && pos !== undefined) {
          editor.commands.setNodeSelection(pos)
        }
      })

      // 图片拖拽功能：支持在文字之间移动（仅在启用增强功能时）
      if (enableResize) {
        img.addEventListener('dragstart', (e: DragEvent) => {
          const pos = typeof getPos === 'function' ? getPos() : null
          if (pos !== null && pos !== undefined) {
            const { state } = editor
            const nodeAtPos = state.doc.nodeAt(pos)
            if (nodeAtPos && nodeAtPos.type.name === 'image') {
              // 设置拖拽效果
              if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move'
                // 创建拖拽预览图像（可选，提升用户体验）
                const dragImage = img.cloneNode(true) as HTMLImageElement
                dragImage.style.width = `${img.offsetWidth}px`
                dragImage.style.height = `${img.offsetHeight}px`
                dragImage.style.opacity = '0.5'
                document.body.appendChild(dragImage)
                e.dataTransfer.setDragImage(dragImage, img.offsetWidth / 2, img.offsetHeight / 2)
                setTimeout(() => {
                  if (document.body.contains(dragImage)) {
                    document.body.removeChild(dragImage)
                  }
                }, 0)
              }
            }
          }
        })

        // 阻止调整手柄触发图片拖拽
        if (resizeHandle) {
          resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation()
          })
        }
      }

      // 拖拽调整大小（等比例缩放）- 仅在启用增强功能时
      if (enableResize && resizeHandle) {
        let isResizing = false
        let startX = 0
        let startY = 0
        let startWidth = 0
        let startHeight = 0
        let aspectRatio = 1

        const handleMouseDown = (e: MouseEvent) => {
          // 阻止调整手柄触发图片拖拽，但允许调整大小
          e.preventDefault()
          e.stopPropagation()
          // 临时禁用拖拽功能
          img.draggable = false
          isResizing = true
          startX = e.clientX
          startY = e.clientY
          
          // 获取当前图片尺寸
          startWidth = node.attrs.width || img.offsetWidth || img.naturalWidth
          startHeight = node.attrs.height || img.offsetHeight || img.naturalHeight

          // 计算宽高比（优先使用自然尺寸）
          if (img.naturalWidth && img.naturalHeight) {
            aspectRatio = img.naturalHeight / img.naturalWidth
          } else if (startWidth && startHeight) {
            aspectRatio = startHeight / startWidth
          } else {
            aspectRatio = 1
          }

          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
          dom.classList.add('resizing')
        }

        const handleMouseMove = (e: MouseEvent) => {
          if (!isResizing) return

          // 计算鼠标移动的距离（使用对角线距离，保持等比例）
          const deltaX = e.clientX - startX
          const deltaY = e.clientY - startY
          
          // 使用较大的变化量来保持等比例
          const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY
          
          // 计算新宽度（保持宽高比）
          const newWidth = Math.max(50, Math.min(2000, startWidth + delta))
          const newHeight = newWidth * aspectRatio

          // 实时更新图片尺寸
          img.style.width = `${newWidth}px`
          img.style.height = `${newHeight}px`
        }

        const handleMouseUp = () => {
          if (!isResizing) return
          isResizing = false

          const finalWidth = parseInt(img.style.width, 10)
          const finalHeight = parseInt(img.style.height, 10)
          const pos = typeof getPos === 'function' ? getPos() : null

          if (pos !== null && pos !== undefined) {
            // 使用 editor 的链式命令更新图片尺寸
            const { state, view } = editor
            const { tr } = state
            const nodeAtPos = tr.doc.nodeAt(pos)
            
            if (nodeAtPos && nodeAtPos.type.name === 'image') {
              tr.setNodeMarkup(pos, undefined, {
                ...nodeAtPos.attrs,
                width: finalWidth,
                height: finalHeight,
              })
              view.dispatch(tr)
            }
          }

          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
          dom.classList.remove('resizing')
          // 恢复拖拽功能
          img.draggable = true
        }

        resizeHandle.addEventListener('mousedown', handleMouseDown)
      }

      return {
        dom,
        contentDOM: null,
        update: (updatedNode) => {
          // 更新图片源
          if (updatedNode.attrs.src !== node.attrs.src) {
            img.src = updatedNode.attrs.src
          }

          // 更新图片尺寸
          if (
            updatedNode.attrs.width !== node.attrs.width ||
            updatedNode.attrs.height !== node.attrs.height
          ) {
            if (updatedNode.attrs.width) {
              img.style.width = `${updatedNode.attrs.width}px`
              img.style.height = 'auto'
            } else if (updatedNode.attrs.height) {
              img.style.height = `${updatedNode.attrs.height}px`
              img.style.width = 'auto'
            } else {
              img.style.width = ''
              img.style.height = ''
              img.style.maxWidth = '100%'
            }
          }

          // 更新对齐方式
          if (updatedNode.attrs.align !== node.attrs.align) {
            if (updatedNode.attrs.align) {
              dom.style.textAlign = updatedNode.attrs.align
              dom.setAttribute('data-align', updatedNode.attrs.align)
            } else {
              dom.style.textAlign = ''
              dom.removeAttribute('data-align')
            }
          }

          node = updatedNode
          return true
        },
        destroy: () => {
          // 清理工作（如果需要）
        },
      }
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, ...rest } = HTMLAttributes
    const style: string[] = []
    
    if (width) {
      style.push(`width: ${width}px`)
    }
    if (height) {
      style.push(`height: ${height}px`)
    }
    
    return [
      'img',
      {
        ...rest,
        ...(style.length > 0 ? { style: style.join('; ') } : {}),
      },
    ]
  },
})


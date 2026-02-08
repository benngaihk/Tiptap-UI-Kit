/**
 * TableCellWithBackground - 支持背景色的表格单元格扩展
 * @description 基于 TableKit 的 TableCell，添加 backgroundColor 属性支持
 * 参考：https://tiptap.dev/docs/editor/extensions/table
 */
import { TableCell } from '@tiptap/extension-table'

/**
 * 自定义 TableCell 扩展，支持 backgroundColor 属性
 * 用于表格悬浮框中的背景色设置功能
 */
export const TableCellWithBackground = TableCell.extend({
  addAttributes() {
    return {
      // 继承父类的所有属性
      ...this.parent?.(),
      // 添加 backgroundColor 属性
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-background-color') || element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
      // 添加 textAlign 属性（如果 TableToolbar 需要）
      textAlign: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-text-align') || element.style.textAlign || null,
        renderHTML: (attributes) => {
          if (!attributes.textAlign) {
            return {}
          }
          return {
            'data-text-align': attributes.textAlign,
            style: `text-align: ${attributes.textAlign}`,
          }
        },
      },
    }
  },
})


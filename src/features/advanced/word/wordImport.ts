/**
 * Word 导入工具
 * @description 使用 mammoth 将 .docx 文件转换为 HTML 并插入编辑器
 * @note mammoth 为按需动态加载，仅在实际执行导入时下载
 */
import type { Editor } from '@tiptap/core'

export interface WordImportResult {
  html: string
  messages: string[]
}

/**
 * 将 Word 文件转换为 HTML
 * @param file - .docx 文件
 * @returns 转换结果（HTML + 消息）
 */
export async function convertWordToHtml(file: File): Promise<WordImportResult> {
  // 动态加载 mammoth（CJS 包，做 default/命名空间兼容处理）
  const mammothModule: any = await import('mammoth')
  const mammoth = mammothModule.default ?? mammothModule

  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
      ],
    },
  )

  return {
    html: result.value as string,
    messages: (result.messages as Array<{ message: string }>).map((m) => m.message),
  }
}

/**
 * 导入 Word 文件到编辑器
 * @param editor - Tiptap 编辑器实例
 * @param file - .docx 文件
 */
export async function importWordFile(editor: Editor, file: File): Promise<WordImportResult> {
  const result = await convertWordToHtml(file)

  if (result.html) {
    editor.chain().focus().setContent(result.html).run()
  }

  return result
}

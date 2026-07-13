/**
 * Document Tools - AI 文档编辑工具集
 * @description 把编辑器的基本操作封装成结构化「工具」（OpenAI function-calling 格式），
 * 供 AI agent 通过 tool-use 循环调用，实现「用文字描述来编写和修改文档」。
 *
 * 寻址设计：
 * - 块级操作用「块索引」（文档顶层节点的序号，read_document 返回）
 * - 行内操作用「文本查找」（find + occurrence），不暴露脆弱的 ProseMirror 位置
 * - 每次修改后返回最新文档概要，模型无需再调 read_document 对齐索引
 */

import type { Editor } from '@tiptap/core'

// ============================================================================
// 类型
// ============================================================================

/** 工具定义（parameters 为 JSON Schema，与 OpenAI function calling 对齐） */
export interface DocumentTool {
  name: string
  description: string
  parameters: Record<string, unknown>
  /** 执行工具，返回给模型看的结果文本；抛错时错误信息也会回传给模型 */
  execute: (editor: Editor, args: Record<string, unknown>) => string
}

interface BlockInfo {
  index: number
  /** 节点起点前的位置（block 边界） */
  from: number
  /** 节点终点后的位置 */
  to: number
  node: import('@tiptap/pm/model').Node
}

// ============================================================================
// 内部工具函数
// ============================================================================

/** 收集文档顶层块 */
function getBlocks(editor: Editor): BlockInfo[] {
  const blocks: BlockInfo[] = []
  editor.state.doc.forEach((node, offset, index) => {
    blocks.push({ index, from: offset, to: offset + node.nodeSize, node })
  })
  return blocks
}

/** 单个块的简短描述（类型 + 截断文本） */
function describeBlock(node: import('@tiptap/pm/model').Node, maxLen: number): string {
  let type = node.type.name
  if (type === 'heading') type = `h${node.attrs.level}`
  else if (type === 'paragraph') type = 'p'
  else if (type === 'bulletList') type = 'ul'
  else if (type === 'orderedList') type = 'ol'
  else if (type === 'codeBlock') type = `code(${node.attrs.language || 'text'})`
  else if (type === 'table') {
    const rows = node.childCount
    const cols = rows > 0 ? node.firstChild!.childCount : 0
    return `table ${rows}x${cols}: ${truncate(node.textContent, maxLen)}`
  }

  const text = node.textContent.trim()
  return text ? `${type}: ${truncate(text, maxLen)}` : `${type}: (empty)`
}

function truncate(text: string, maxLen: number): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > maxLen ? `${t.slice(0, maxLen)}…` : t
}

/** 文档概要：[i] type: text（模型用它获得块索引） */
export function getDocumentOutline(editor: Editor, maxLenPerBlock = 150, maxBlocks = 300): string {
  const blocks = getBlocks(editor)
  if (blocks.length === 0) return '(document is empty)'
  const lines = blocks
    .slice(0, maxBlocks)
    .map((b) => `[${b.index}] ${describeBlock(b.node, maxLenPerBlock)}`)
  if (blocks.length > maxBlocks) {
    lines.push(`… (${blocks.length - maxBlocks} more blocks omitted)`)
  }
  return lines.join('\n')
}

/** 修改成功后返回给模型的统一结果（附最新概要，避免索引漂移） */
function okWithOutline(editor: Editor, message: string): string {
  return `${message}\nDocument now:\n${getDocumentOutline(editor, 80)}`
}

/** 校验并解析块索引范围 */
function resolveBlockRange(
  editor: Editor,
  fromBlock: number,
  toBlock?: number
): { from: number; to: number; count: number } {
  const blocks = getBlocks(editor)
  const last = typeof toBlock === 'number' ? toBlock : fromBlock
  if (
    !Number.isInteger(fromBlock) ||
    !Number.isInteger(last) ||
    fromBlock < 0 ||
    last >= blocks.length ||
    fromBlock > last
  ) {
    throw new Error(
      `Invalid block range [${fromBlock}, ${last}]. Document has ${blocks.length} blocks (0-${blocks.length - 1}). Call read_document to get fresh indexes.`
    )
  }
  return { from: blocks[fromBlock].from, to: blocks[last].to, count: last - fromBlock + 1 }
}

interface TextMatch {
  from: number
  to: number
  /** 匹配所在顶层块索引（用于多匹配歧义提示） */
  blockIndex: number
}

/**
 * 扫描全文，返回 find 文本的所有匹配区间（绝对位置）。
 * 支持跨行内节点边界（如一半加粗一半普通）的匹配；
 * 在块级结构边界（嵌套段落/表格单元格）和硬换行处插入不可匹配的哨兵字符，
 * 避免「相邻单元格文本拼起来恰好等于 find」这类跨结构假匹配。
 */
function findAllTextRanges(editor: Editor, find: string): TextMatch[] {
  if (!find) throw new Error('`find` must be a non-empty string.')
  const doc = editor.state.doc

  // 逐块拼接文本并记录每个字符的绝对位置，避免跨块误匹配
  const matches: TextMatch[] = []
  doc.forEach((block, blockOffset, blockIndex) => {
    let text = ''
    const positions: number[] = []
    block.descendants((node, pos) => {
      if (node.isText && node.text) {
        for (let i = 0; i < node.text.length; i++) {
          text += node.text[i]
          // +1 跳过块的开始 token
          positions.push(blockOffset + 1 + pos + i)
        }
      } else if (node.isBlock || node.type.name === 'hardBreak') {
        // 结构边界：用户的 find 不会包含 \u0000，跨边界的假匹配自然失配
        if (text) {
          text += '\u0000'
          positions.push(-1)
        }
      }
      return true
    })
    let idx = text.indexOf(find)
    while (idx !== -1) {
      matches.push({
        from: positions[idx],
        to: positions[idx + find.length - 1] + 1,
        blockIndex,
      })
      idx = text.indexOf(find, idx + 1)
    }
  })
  return matches
}

/**
 * 解析出唯一目标匹配。
 * occurrence 未显式传入且存在多个匹配时抛错要求消歧，避免默默改错位置。
 */
function resolveSingleMatch(
  editor: Editor,
  find: string,
  occurrence: number | undefined
): { from: number; to: number } {
  const matches = findAllTextRanges(editor, find)
  if (matches.length === 0) {
    throw new Error(`Text not found: "${truncate(find, 60)}". Check exact wording with read_document.`)
  }
  if (occurrence === undefined) {
    if (matches.length > 1) {
      const blocks = [...new Set(matches.map((m) => m.blockIndex))].join(', ')
      throw new Error(
        `Found ${matches.length} matches for "${truncate(find, 60)}" (in block(s) ${blocks}). Pass occurrence (1-${matches.length}) to disambiguate.`
      )
    }
    return matches[0]
  }
  if (!Number.isInteger(occurrence) || occurrence < 1 || occurrence > matches.length) {
    throw new Error(`Occurrence ${occurrence} out of range: only ${matches.length} match(es) found.`)
  }
  return matches[occurrence - 1]
}

// ============================================================================
// 工具定义
// ============================================================================

const readDocument: DocumentTool = {
  name: 'read_document',
  description:
    'Read the current document as an outline of top-level blocks with their indexes. Always call this first to understand the document and get fresh block indexes.',
  parameters: { type: 'object', properties: {}, additionalProperties: false },
  execute: (editor) => {
    const blocks = getBlocks(editor)
    return `Document has ${blocks.length} block(s):\n${getDocumentOutline(editor)}`
  },
}

const getSelection: DocumentTool = {
  name: 'get_selection',
  description:
    "Get the user's currently selected text, if any. Useful when the user refers to “the selected text” / “选中的文字”.",
  parameters: { type: 'object', properties: {}, additionalProperties: false },
  execute: (editor) => {
    const { from, to, empty } = editor.state.selection
    if (empty) return 'No text is selected.'
    const text = editor.state.doc.textBetween(from, to, '\n')
    return `Selected text (${text.length} chars): "${truncate(text, 2000)}"`
  },
}

const insertBlocks: DocumentTool = {
  name: 'insert_blocks',
  description:
    'Insert new content into the document as HTML. Supported tags: p, h1-h6, ul/ol/li, table/tr/th/td, blockquote, pre/code, strong, em, u, s, a, img, hr. Keep HTML simple and valid.',
  parameters: {
    type: 'object',
    properties: {
      html: { type: 'string', description: 'HTML content to insert' },
      position: {
        type: 'string',
        enum: ['documentStart', 'documentEnd', 'beforeBlock', 'afterBlock'],
        description: 'Where to insert',
      },
      blockIndex: {
        type: 'number',
        description: 'Required when position is beforeBlock/afterBlock: the anchor block index',
      },
    },
    required: ['html', 'position'],
    additionalProperties: false,
  },
  execute: (editor, args) => {
    const html = String(args.html || '')
    if (!html.trim()) throw new Error('`html` must not be empty.')
    const position = String(args.position)
    let pos: number
    if (position === 'documentStart') {
      pos = 0
    } else if (position === 'documentEnd') {
      pos = editor.state.doc.content.size
    } else if (position === 'beforeBlock' || position === 'afterBlock') {
      const blockIndex = Number(args.blockIndex)
      const range = resolveBlockRange(editor, blockIndex)
      pos = position === 'beforeBlock' ? range.from : range.to
    } else {
      throw new Error(`Unknown position: ${position}`)
    }
    const ok = editor.chain().insertContentAt(pos, html).run()
    if (!ok) throw new Error('Insert failed: the HTML may be invalid for this position.')
    return okWithOutline(editor, 'Inserted.')
  },
}

const replaceBlocks: DocumentTool = {
  name: 'replace_blocks',
  description:
    'Replace a range of top-level blocks (inclusive) with new HTML content. Use read_document indexes.',
  parameters: {
    type: 'object',
    properties: {
      fromBlock: { type: 'number', description: 'First block index to replace' },
      toBlock: { type: 'number', description: 'Last block index (defaults to fromBlock)' },
      html: { type: 'string', description: 'Replacement HTML content' },
    },
    required: ['fromBlock', 'html'],
    additionalProperties: false,
  },
  execute: (editor, args) => {
    const html = String(args.html || '')
    if (!html.trim()) throw new Error('`html` must not be empty. To remove blocks use delete_blocks.')
    const { from, to, count } = resolveBlockRange(
      editor,
      Number(args.fromBlock),
      args.toBlock === undefined ? undefined : Number(args.toBlock)
    )
    const ok = editor.chain().insertContentAt({ from, to }, html).run()
    if (!ok) throw new Error('Replace failed: the HTML may be invalid.')
    return okWithOutline(editor, `Replaced ${count} block(s).`)
  },
}

const deleteBlocks: DocumentTool = {
  name: 'delete_blocks',
  description: 'Delete a range of top-level blocks (inclusive). Use read_document indexes.',
  parameters: {
    type: 'object',
    properties: {
      fromBlock: { type: 'number', description: 'First block index to delete' },
      toBlock: { type: 'number', description: 'Last block index (defaults to fromBlock)' },
    },
    required: ['fromBlock'],
    additionalProperties: false,
  },
  execute: (editor, args) => {
    const { from, to, count } = resolveBlockRange(
      editor,
      Number(args.fromBlock),
      args.toBlock === undefined ? undefined : Number(args.toBlock)
    )
    const ok = editor.chain().deleteRange({ from, to }).run()
    if (!ok) throw new Error('Delete failed.')
    return okWithOutline(editor, `Deleted ${count} block(s).`)
  },
}

const editText: DocumentTool = {
  name: 'edit_text',
  description:
    'Replace an exact text snippet with new plain text (keeps surrounding formatting). For structural changes use replace_blocks instead.',
  parameters: {
    type: 'object',
    properties: {
      find: { type: 'string', description: 'Exact text to find (case-sensitive)' },
      replace: { type: 'string', description: 'Replacement plain text (may be empty to delete)' },
      occurrence: {
        type: 'number',
        description:
          'Which match to replace, 1-based. Required when there are multiple matches (unless replaceAll).',
      },
      replaceAll: { type: 'boolean', description: 'Replace every match. Default false.' },
    },
    required: ['find', 'replace'],
    additionalProperties: false,
  },
  execute: (editor, args) => {
    const find = String(args.find ?? '')
    const replace = String(args.replace ?? '')

    if (args.replaceAll) {
      // 一次性收集全部区间，单条事务里从后往前替换：
      // 前面的位置不受影响、每个原始匹配恰好替换一次、一次 Cmd+Z 可全部撤销
      const matches = findAllTextRanges(editor, find)
      if (matches.length === 0) throw new Error(`Text not found: "${truncate(find, 60)}"`)
      editor
        .chain()
        .command(({ tr }) => {
          for (let i = matches.length - 1; i >= 0; i--) {
            tr.insertText(replace, matches[i].from, matches[i].to)
          }
          return true
        })
        .run()
      return okWithOutline(editor, `Replaced ${matches.length} occurrence(s).`)
    }

    const occurrence = args.occurrence === undefined ? undefined : Number(args.occurrence)
    const { from, to } = resolveSingleMatch(editor, find, occurrence)
    editor
      .chain()
      .command(({ tr }) => {
        tr.insertText(replace, from, to)
        return true
      })
      .run()
    return okWithOutline(editor, 'Text replaced.')
  },
}

/** 行内格式 → mark 名与属性 */
const FORMAT_MARKS: Record<string, { mark: string; attrs?: (args: Record<string, unknown>) => Record<string, unknown> }> = {
  bold: { mark: 'bold' },
  italic: { mark: 'italic' },
  underline: { mark: 'underline' },
  strike: { mark: 'strike' },
  code: { mark: 'code' },
  highlight: {
    mark: 'highlight',
    attrs: (args) => (args.color ? { color: String(args.color) } : {}),
  },
  textColor: {
    mark: 'textStyle',
    attrs: (args) => ({ color: String(args.color || '#000000') }),
  },
}

const formatText: DocumentTool = {
  name: 'format_text',
  description:
    'Add or remove inline formatting on an exact text snippet. Formats: bold, italic, underline, strike, code, highlight, textColor. For highlight/textColor pass `color` (hex).',
  parameters: {
    type: 'object',
    properties: {
      find: { type: 'string', description: 'Exact text to format (case-sensitive)' },
      occurrence: {
        type: 'number',
        description: 'Which match, 1-based. Required when there are multiple matches.',
      },
      formats: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['bold', 'italic', 'underline', 'strike', 'code', 'highlight', 'textColor'],
        },
        description: 'Formats to apply or remove',
      },
      action: { type: 'string', enum: ['add', 'remove'], description: 'Default add' },
      color: { type: 'string', description: 'Hex color for highlight/textColor' },
    },
    required: ['find', 'formats'],
    additionalProperties: false,
  },
  execute: (editor, args) => {
    const find = String(args.find ?? '')
    const occurrence = args.occurrence === undefined ? undefined : Number(args.occurrence)
    const formats = Array.isArray(args.formats) ? args.formats.map(String) : []
    if (formats.length === 0) throw new Error('`formats` must not be empty.')
    const action = args.action === 'remove' ? 'remove' : 'add'

    const { from, to } = resolveSingleMatch(editor, find, occurrence)
    let chain = editor.chain().setTextSelection({ from, to })
    for (const format of formats) {
      const def = FORMAT_MARKS[format]
      if (!def) throw new Error(`Unknown format: ${format}`)
      if (action === 'add') {
        chain = chain.setMark(def.mark, def.attrs ? def.attrs(args) : undefined)
      } else if (format === 'textColor') {
        // 不能 unsetMark('textStyle')：会连带清掉 fontSize/fontFamily 等其它 textStyle 属性
        chain = chain.setMark('textStyle', { color: null })
      } else {
        chain = chain.unsetMark(def.mark)
      }
    }
    const ok = chain.setTextSelection(to).run()
    if (!ok) {
      throw new Error(
        `Formatting failed. The "${formats.join(', ')}" mark(s) may not be enabled in this editor.`
      )
    }
    return okWithOutline(editor, `Formatting ${action === 'add' ? 'applied' : 'removed'}.`)
  },
}

// ============================================================================
// 导出
// ============================================================================

/** 所有文档编辑工具（顺序即推荐调用优先级） */
export const documentTools: DocumentTool[] = [
  readDocument,
  getSelection,
  insertBlocks,
  replaceBlocks,
  deleteBlocks,
  editText,
  formatText,
]

/** 按名称查找工具 */
export function getDocumentTool(name: string): DocumentTool | undefined {
  return documentTools.find((t) => t.name === name)
}

/** 转成 OpenAI function-calling 的 tools 数组 */
export function toOpenAiTools(tools: DocumentTool[] = documentTools) {
  return tools.map((t) => ({
    type: 'function' as const,
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }))
}

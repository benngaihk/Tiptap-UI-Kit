/**
 * Word 导出工具
 * @description 将编辑器 HTML 内容导出为 .docx 文件
 */
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
  ExternalHyperlink,
  type ITableCellOptions,
} from 'docx'
import { saveAs } from 'file-saver'

/** 标题级别映射 */
const HEADING_MAP: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  H1: HeadingLevel.HEADING_1,
  H2: HeadingLevel.HEADING_2,
  H3: HeadingLevel.HEADING_3,
  H4: HeadingLevel.HEADING_4,
  H5: HeadingLevel.HEADING_5,
  H6: HeadingLevel.HEADING_6,
}

/** 对齐方式映射 */
const ALIGN_MAP: Record<string, (typeof AlignmentType)[keyof typeof AlignmentType]> = {
  left: AlignmentType.LEFT,
  center: AlignmentType.CENTER,
  right: AlignmentType.RIGHT,
  justify: AlignmentType.JUSTIFIED,
}

/** 内联文本样式上下文 */
interface InlineStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  strike: boolean
  code: boolean
  link: string | null
  superscript: boolean
  subscript: boolean
}

const defaultInlineStyle: InlineStyle = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  code: false,
  link: null,
  superscript: false,
  subscript: false,
}

/**
 * 从 HTML 元素中解析对齐方式
 */
function getAlignment(el: Element): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  const style = (el as HTMLElement).style?.textAlign
  if (style && ALIGN_MAP[style]) return ALIGN_MAP[style]
  return undefined
}

/**
 * 将内联节点转换为 TextRun 数组
 */
function parseInlineNodes(node: Node, style: InlineStyle): (TextRun | ExternalHyperlink)[] {
  const runs: (TextRun | ExternalHyperlink)[] = []

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || ''
    if (!text) return runs

    const run = new TextRun({
      text,
      bold: style.bold || undefined,
      italics: style.italic || undefined,
      underline: style.underline ? {} : undefined,
      strike: style.strike || undefined,
      font: style.code ? { name: 'Courier New' } : undefined,
      superScript: style.superscript || undefined,
      subScript: style.subscript || undefined,
    })

    if (style.link) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text,
              bold: style.bold || undefined,
              italics: style.italic || undefined,
              underline: {},
              style: 'Hyperlink',
            }),
          ],
          link: style.link,
        }),
      )
    } else {
      runs.push(run)
    }

    return runs
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return runs

  const el = node as Element
  const tag = el.tagName.toUpperCase()

  // 根据标签更新样式
  const newStyle = { ...style }
  if (tag === 'STRONG' || tag === 'B') newStyle.bold = true
  if (tag === 'EM' || tag === 'I') newStyle.italic = true
  if (tag === 'U') newStyle.underline = true
  if (tag === 'S' || tag === 'DEL' || tag === 'STRIKE') newStyle.strike = true
  if (tag === 'CODE') newStyle.code = true
  if (tag === 'SUP') newStyle.superscript = true
  if (tag === 'SUB') newStyle.subscript = true
  if (tag === 'A') newStyle.link = el.getAttribute('href')

  // BR 标签处理为换行
  if (tag === 'BR') {
    runs.push(new TextRun({ break: 1 }))
    return runs
  }

  for (const child of Array.from(el.childNodes)) {
    runs.push(...parseInlineNodes(child, newStyle))
  }

  return runs
}

/**
 * 将 <li> 元素转为段落
 */
function parseListItem(
  li: Element,
  ordered: boolean,
  level: number,
): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const runs = parseInlineNodes(li, { ...defaultInlineStyle })
  // 过滤出 TextRun（排除嵌套列表生成的段落）
  const textRuns = runs.filter((r): r is TextRun => r instanceof TextRun || r instanceof ExternalHyperlink)

  if (textRuns.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: textRuns,
        numbering: ordered
          ? { reference: 'ordered-list', level }
          : { reference: 'bullet-list', level },
      }),
    )
  }

  // 处理嵌套列表
  for (const child of Array.from(li.children)) {
    const childTag = child.tagName.toUpperCase()
    if (childTag === 'UL') {
      paragraphs.push(...parseList(child, false, level + 1))
    } else if (childTag === 'OL') {
      paragraphs.push(...parseList(child, true, level + 1))
    }
  }

  return paragraphs
}

/**
 * 将 <ul>/<ol> 元素转为段落数组
 */
function parseList(list: Element, ordered: boolean, level = 0): Paragraph[] {
  const paragraphs: Paragraph[] = []
  for (const li of Array.from(list.children)) {
    if (li.tagName.toUpperCase() === 'LI') {
      paragraphs.push(...parseListItem(li, ordered, level))
    }
  }
  return paragraphs
}

/**
 * 将表格 HTML 转换为 docx Table
 */
function parseTable(tableEl: Element): Table {
  const rows: TableRow[] = []

  const trElements = tableEl.querySelectorAll('tr')
  for (const tr of Array.from(trElements)) {
    const cells: TableCell[] = []
    const tdElements = tr.querySelectorAll('td, th')
    for (const td of Array.from(tdElements)) {
      const cellOpts: ITableCellOptions = {
        children: [
          new Paragraph({
            children: parseInlineNodes(td, { ...defaultInlineStyle }) as TextRun[],
          }),
        ],
        width: { size: 100, type: WidthType.AUTO },
      }
      cells.push(new TableCell(cellOpts))
    }
    if (cells.length > 0) {
      rows.push(new TableRow({ children: cells }))
    }
  }

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  })
}

/**
 * 将代码块转为段落
 */
function parseCodeBlock(pre: Element): Paragraph[] {
  const code = pre.querySelector('code') || pre
  const text = code.textContent || ''
  const lines = text.split('\n')

  return lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ',
            font: { name: 'Courier New' },
            size: 20,
          }),
        ],
        spacing: { before: 0, after: 0 },
      }),
  )
}

/**
 * 解析块级 HTML 节点为 docx 元素
 */
function parseBlockNodes(container: Element): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []

  for (const node of Array.from(container.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        elements.push(new Paragraph({ children: [new TextRun({ text })] }))
      }
      continue
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue

    const el = node as Element
    const tag = el.tagName.toUpperCase()

    // 标题
    if (HEADING_MAP[tag]) {
      const runs = parseInlineNodes(el, { ...defaultInlineStyle })
      elements.push(
        new Paragraph({
          heading: HEADING_MAP[tag],
          children: runs as TextRun[],
          alignment: getAlignment(el),
        }),
      )
      continue
    }

    // 段落
    if (tag === 'P') {
      const runs = parseInlineNodes(el, { ...defaultInlineStyle })
      if (runs.length > 0) {
        elements.push(
          new Paragraph({
            children: runs as TextRun[],
            alignment: getAlignment(el),
          }),
        )
      } else {
        elements.push(new Paragraph({}))
      }
      continue
    }

    // 列表
    if (tag === 'UL') {
      elements.push(...parseList(el, false))
      continue
    }
    if (tag === 'OL') {
      elements.push(...parseList(el, true))
      continue
    }

    // 代码块
    if (tag === 'PRE') {
      elements.push(...parseCodeBlock(el))
      continue
    }

    // 表格
    if (tag === 'TABLE') {
      elements.push(parseTable(el))
      continue
    }

    // 引用块
    if (tag === 'BLOCKQUOTE') {
      const innerElements = parseBlockNodes(el)
      for (const inner of innerElements) {
        if (inner instanceof Paragraph) {
          elements.push(
            new Paragraph({
              ...((inner as any).options || {}),
              indent: { left: 720 },
              border: {
                left: { style: 'single' as any, size: 6, color: '999999' },
              },
            }),
          )
        } else {
          elements.push(inner)
        }
      }
      continue
    }

    // 分隔线
    if (tag === 'HR') {
      elements.push(
        new Paragraph({
          children: [new TextRun({ text: '─'.repeat(50) })],
          alignment: AlignmentType.CENTER,
        }),
      )
      continue
    }

    // DIV 或其他容器 → 递归
    if (el.children.length > 0) {
      elements.push(...parseBlockNodes(el))
    } else {
      const text = el.textContent?.trim()
      if (text) {
        elements.push(new Paragraph({ children: [new TextRun({ text })] }))
      }
    }
  }

  return elements
}

/**
 * 将编辑器 HTML 导出为 .docx 文件并下载
 * @param html - 编辑器 HTML 内容
 * @param filename - 文件名（不含扩展名）
 */
export async function exportToWord(html: string, filename = 'document'): Promise<void> {
  // 解析 HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  const children = parseBlockNodes(body)

  // 保底：至少一个空段落
  if (children.length === 0) {
    children.push(new Paragraph({}))
  }

  const document = new Document({
    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [
            { level: 0, format: 'bullet', text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
            { level: 1, format: 'bullet', text: '\u25CB', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
            { level: 2, format: 'bullet', text: '\u25AA', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 2160, hanging: 360 } } } },
          ],
        },
        {
          reference: 'ordered-list',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
            { level: 1, format: 'lowerLetter', text: '%2.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
            { level: 2, format: 'lowerRoman', text: '%3.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 2160, hanging: 360 } } } },
          ],
        },
      ],
    },
    sections: [
      {
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(document)
  saveAs(blob, `${filename}.docx`)
}

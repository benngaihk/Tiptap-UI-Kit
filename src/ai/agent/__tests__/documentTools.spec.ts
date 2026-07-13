/**
 * documentTools 单元测试（无头 Editor）
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { documentTools, getDocumentTool, getDocumentOutline, toOpenAiTools } from '../documentTools'

let editor: Editor

function run(name: string, args: Record<string, unknown> = {}): string {
  const tool = getDocumentTool(name)
  if (!tool) throw new Error(`tool not found: ${name}`)
  return tool.execute(editor, args)
}

beforeEach(() => {
  editor = new Editor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Table,
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<h1>标题一</h1><p>这是<strong>第一段</strong>正文。</p><p>第二段正文。</p>',
  })
})

afterEach(() => {
  editor.destroy()
})

describe('read_document / outline', () => {
  it('lists blocks with indexes and types', () => {
    const result = run('read_document')
    expect(result).toContain('3 block(s)')
    expect(result).toContain('[0] h1: 标题一')
    expect(result).toContain('[1] p: 这是第一段正文。')
    expect(result).toContain('[2] p: 第二段正文。')
  })

  it('outline truncates long blocks', () => {
    editor.commands.setContent(`<p>${'长'.repeat(300)}</p>`)
    const outline = getDocumentOutline(editor, 100)
    expect(outline).toContain('…')
    expect(outline.length).toBeLessThan(200)
  })
})

describe('get_selection', () => {
  it('reports no selection', () => {
    expect(run('get_selection')).toContain('No text is selected')
  })

  it('returns selected text', () => {
    editor.commands.setTextSelection({ from: 1, to: 4 })
    expect(run('get_selection')).toContain('标题一')
  })
})

describe('insert_blocks', () => {
  it('inserts at document end', () => {
    run('insert_blocks', { html: '<p>新段落</p>', position: 'documentEnd' })
    expect(editor.getHTML()).toContain('新段落')
    expect(run('read_document')).toContain('[3] p: 新段落')
  })

  it('inserts before a block', () => {
    run('insert_blocks', { html: '<h2>插入的标题</h2>', position: 'beforeBlock', blockIndex: 1 })
    expect(run('read_document')).toContain('[1] h2: 插入的标题')
  })

  it('inserts after a block', () => {
    run('insert_blocks', { html: '<p>插在标题后</p>', position: 'afterBlock', blockIndex: 0 })
    expect(run('read_document')).toContain('[1] p: 插在标题后')
  })

  it('inserts a table', () => {
    run('insert_blocks', {
      html: '<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>',
      position: 'documentEnd',
    })
    expect(run('read_document')).toMatch(/table 2x2/)
  })

  it('rejects empty html', () => {
    expect(() => run('insert_blocks', { html: '  ', position: 'documentEnd' })).toThrow()
  })
})

describe('replace_blocks', () => {
  it('replaces a single block', () => {
    run('replace_blocks', { fromBlock: 2, html: '<h2>替换后的标题</h2>' })
    const outline = run('read_document')
    expect(outline).toContain('[2] h2: 替换后的标题')
    expect(outline).not.toContain('第二段正文')
  })

  it('replaces a range of blocks', () => {
    run('replace_blocks', { fromBlock: 1, toBlock: 2, html: '<p>合并成一段</p>' })
    const outline = run('read_document')
    expect(outline).toContain('2 block(s)')
    expect(outline).toContain('[1] p: 合并成一段')
  })

  it('rejects out-of-range indexes with helpful error', () => {
    expect(() => run('replace_blocks', { fromBlock: 99, html: '<p>x</p>' })).toThrow(/0-2/)
  })
})

describe('delete_blocks', () => {
  it('deletes one block', () => {
    run('delete_blocks', { fromBlock: 0 })
    const outline = run('read_document')
    expect(outline).toContain('2 block(s)')
    expect(outline).not.toContain('标题一')
  })

  it('deletes a range (trailing empty paragraph is kept by the editor)', () => {
    run('delete_blocks', { fromBlock: 1, toBlock: 2 })
    const outline = run('read_document')
    // StarterKit 的 TrailingNode 会在文档尾部保留一个空段落，属编辑器交互设计
    expect(outline).toContain('标题一')
    expect(outline).not.toContain('第二段')
    expect(outline).not.toContain('第一段')
  })
})

describe('edit_text', () => {
  it('replaces first occurrence and keeps formatting around', () => {
    run('edit_text', { find: '第一段', replace: '首段' })
    const html = editor.getHTML()
    expect(html).toContain('首段')
    expect(html).not.toContain('第一段')
    // 加粗标记仍存在
    expect(html).toContain('<strong>')
  })

  it('matches text spanning mark boundaries', () => {
    // "这是第一段" 跨越 普通文本("这是") 和 strong("第一段")
    run('edit_text', { find: '这是第一段', replace: '本段' })
    expect(editor.state.doc.textContent).toContain('本段正文')
  })

  it('replaces the nth occurrence', () => {
    editor.commands.setContent('<p>苹果一</p><p>苹果二</p>')
    run('edit_text', { find: '苹果', replace: '香蕉', occurrence: 2 })
    const text = editor.state.doc.textContent
    expect(text).toContain('苹果一')
    expect(text).toContain('香蕉二')
  })

  it('replaceAll replaces every occurrence', () => {
    editor.commands.setContent('<p>猫和猫与猫</p>')
    const result = run('edit_text', { find: '猫', replace: '狗', replaceAll: true })
    expect(result).toContain('3 occurrence(s)')
    expect(editor.state.doc.textContent).toBe('狗和狗与狗')
  })

  it('replaceAll where replacement contains the find replaces each original match exactly once', () => {
    // 'a' → 'aa'：不能指数膨胀，每个原始匹配只替换一次
    editor.commands.setContent('<p>a和a与a</p>')
    const result = run('edit_text', { find: 'a', replace: 'aa', replaceAll: true })
    expect(result).toContain('3 occurrence(s)')
    expect(editor.state.doc.textContent).toBe('aa和aa与aa')
  })

  it('does not match text spanning table cells', () => {
    editor.commands.setContent('<table><tr><td>价格</td><td>100</td></tr></table>')
    // '格100' 跨两个单元格，不应视为匹配
    expect(() => run('edit_text', { find: '格100', replace: 'x' })).toThrow(/not found/i)
    // 单元格内部的文本仍可正常匹配
    run('edit_text', { find: '100', replace: '200' })
    expect(editor.state.doc.textContent).toContain('200')
  })

  it('throws when multiple matches and no occurrence is given', () => {
    editor.commands.setContent('<p>苹果一</p><p>苹果二</p>')
    expect(() => run('edit_text', { find: '苹果', replace: '香蕉' })).toThrow(/occurrence \(1-2\)/i)
    // 文档未被修改
    expect(editor.state.doc.textContent).toContain('苹果一')
    expect(editor.state.doc.textContent).toContain('苹果二')
  })

  it('throws helpful error when text not found', () => {
    expect(() => run('edit_text', { find: '不存在的文字', replace: 'x' })).toThrow(/not found/i)
  })
})

describe('format_text', () => {
  it('applies bold and italic', () => {
    run('format_text', { find: '第二段', formats: ['bold', 'italic'] })
    expect(editor.getHTML()).toMatch(/<(strong|em)>.*<(strong|em)>?/)
    const html = editor.getHTML()
    expect(html).toContain('strong')
    expect(html).toContain('em')
  })

  it('removes bold', () => {
    run('format_text', { find: '第一段', formats: ['bold'], action: 'remove' })
    expect(editor.getHTML()).not.toContain('<strong>')
  })

  it('applies text color', () => {
    run('format_text', { find: '标题一', formats: ['textColor'], color: '#ff0000' })
    expect(editor.getHTML()).toContain('#ff0000')
  })

  it('applies highlight with color', () => {
    run('format_text', { find: '第二段', formats: ['highlight'], color: '#ffff00' })
    expect(editor.getHTML()).toContain('mark')
  })

  it('throws when multiple matches and no occurrence is given', () => {
    editor.commands.setContent('<p>重点</p><p>重点</p>')
    expect(() => run('format_text', { find: '重点', formats: ['bold'] })).toThrow(/occurrence \(1-2\)/i)
  })

  it('removes textColor by clearing only the color attribute (no throw, color gone)', () => {
    run('format_text', { find: '标题一', formats: ['textColor'], color: '#ff0000' })
    expect(editor.getHTML()).toContain('#ff0000')
    // remove 走 setMark('textStyle', { color: null })，不 unsetMark 整个 textStyle，
    // 以免连带清掉 fontSize/fontFamily 等其它 textStyle 属性（本测试环境无 fontSize 扩展，
    // 仅验证不抛错且颜色被移除）
    run('format_text', { find: '标题一', formats: ['textColor'], action: 'remove' })
    expect(editor.getHTML()).not.toContain('#ff0000')
  })
})

describe('OpenAI tools export', () => {
  it('produces valid function definitions', () => {
    const tools = toOpenAiTools()
    expect(tools).toHaveLength(documentTools.length)
    for (const t of tools) {
      expect(t.type).toBe('function')
      expect(t.function.name).toBeTruthy()
      expect(t.function.description).toBeTruthy()
      expect(t.function.parameters).toHaveProperty('type', 'object')
    }
  })
})

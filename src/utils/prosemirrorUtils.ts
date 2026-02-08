/**
 * ProseMirror Utilities
 * @description Shared utility functions for ProseMirror operations
 */

import type { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model'

/**
 * Build paragraph nodes from text with newlines
 * @description Splits text by newlines and creates paragraph nodes
 * @param text - The text to convert to paragraph nodes
 * @param schema - The ProseMirror schema
 * @returns Array of paragraph nodes
 *
 * @example
 * ```typescript
 * const nodes = buildParagraphNodesFromText('Line 1\nLine 2', editor.state.schema)
 * const tr = state.tr
 * tr.replaceWith(from, to, nodes)
 * editor.view.dispatch(tr)
 * ```
 */
export function buildParagraphNodesFromText(
  text: string,
  schema: Schema
): ProseMirrorNode[] {
  if (!schema.nodes.paragraph) {
    console.warn('[prosemirrorUtils] Schema does not have paragraph node')
    return []
  }

  const lines = text.split(/\r?\n/)
  const nodes: ProseMirrorNode[] = []

  for (const line of lines) {
    if (line.length > 0) {
      // Create paragraph with text
      const textNode = schema.text(line)
      const paragraphNode = schema.nodes.paragraph.create(null, textNode)
      nodes.push(paragraphNode)
    } else {
      // Create empty paragraph for blank lines
      const paragraphNode = schema.nodes.paragraph.create()
      nodes.push(paragraphNode)
    }
  }

  return nodes
}

/**
 * Check if text contains newlines
 * @param text - The text to check
 * @returns True if text contains newlines
 */
export function hasNewlines(text: string): boolean {
  return /\r?\n/.test(text)
}

/**
 * Validate selection range against document
 * @param selection - The selection range to validate
 * @param docSize - The document content size
 * @returns True if selection is valid
 */
export function isValidSelection(
  selection: { from: number; to: number },
  docSize: number
): boolean {
  return (
    selection.from >= 0 &&
    selection.to >= 0 &&
    selection.from <= docSize &&
    selection.to <= docSize &&
    selection.from <= selection.to
  )
}

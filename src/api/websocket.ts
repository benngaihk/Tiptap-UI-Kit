/**
 * WebSocket URL Provider (Stub)
 * This is a placeholder that reads from environment variables
 * Replace with actual API implementation in production
 */

/**
 * Get WebSocket URL for collaboration
 */
export function getWebSocketUrl(documentId: string): string {
  const baseUrl = import.meta.env?.VITE_COLLABORATION_WS_URL
  if (!baseUrl) {
    console.warn('[Tiptap] VITE_COLLABORATION_WS_URL not configured')
    return ''
  }
  return `${baseUrl}/${documentId}`
}

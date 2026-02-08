/**
 * Collaboration Configuration
 * Loaded from environment variables
 */

export interface CollaborationConfig {
  /** WebSocket URL for y-websocket */
  wsUrl: string
}

/**
 * Get collaboration WebSocket URL from environment
 */
export function getCollaborationWsUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_COLLABORATION_WS_URL || ''
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_COLLABORATION_WS_URL || ''
  }
  return ''
}

/**
 * Check if collaboration is configured
 */
export function isCollaborationConfigured(): boolean {
  return !!getCollaborationWsUrl()
}

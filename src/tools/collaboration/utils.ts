/**
 * Collaboration Utils - 协作编辑工具函数
 */

import type { CollaboratorInfo } from './types'

/** 预设颜色列表 */
const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
]

/** 生成随机颜色 */
export function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)] || '#3b82f6'
}

/** 日志工具（静默模式） */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (..._args: unknown[]) => {}

export const logger = {
  info: noop,
  warn: noop,
  error: noop,
  success: noop,
}

/** 定时器管理器 */
export class TimerManager {
  private timeouts: NodeJS.Timeout[] = []
  private intervals: NodeJS.Timeout[] = []

  setTimeout(fn: () => void, delay: number): NodeJS.Timeout {
    const id = setTimeout(() => {
      const idx = this.timeouts.indexOf(id)
      if (idx > -1) this.timeouts.splice(idx, 1)
      fn()
    }, delay)
    this.timeouts.push(id)
    return id
  }

  setInterval(fn: () => void, delay: number): NodeJS.Timeout {
    const id = setInterval(fn, delay)
    this.intervals.push(id)
    return id
  }

  clearTimeout(id: NodeJS.Timeout): void {
    clearTimeout(id)
    const idx = this.timeouts.indexOf(id)
    if (idx > -1) this.timeouts.splice(idx, 1)
  }

  clearAll(): { timeoutCount: number; intervalCount: number } {
    const counts = { timeoutCount: this.timeouts.length, intervalCount: this.intervals.length }
    this.timeouts.forEach(clearTimeout)
    this.intervals.forEach(clearInterval)
    this.timeouts = []
    this.intervals = []
    return counts
  }
}

/** Event emitter interface - flexible to accommodate various providers */
interface EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, handler: (...args: any[]) => void) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off: (event: string, handler: (...args: any[]) => void) => void
}

/** Event listener record */
interface EventListenerRecord {
  target: EventEmitter
  event: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => void
}

/** 事件监听器管理器 */
export class EventManager {
  private listeners: EventListenerRecord[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(target: any, event: string, handler: (...args: any[]) => void): void {
    if (target && typeof target.on === 'function') {
      target.on(event, handler)
      this.listeners.push({ target, event, handler })
    }
  }

  removeAll(): number {
    let count = 0
    this.listeners.forEach(({ target, event, handler }) => {
      try {
        if (typeof target?.off === 'function') {
          target.off(event, handler)
          count++
        }
      } catch {
        // Ignore cleanup errors
      }
    })
    this.listeners = []
    return count
  }
}

/** Awareness state interface */
interface AwarenessState {
  user?: {
    id?: string | number
    name?: string
    color?: string
  }
}

/** 获取去重用户列表 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUniqueUsers(awareness: any): CollaboratorInfo[] {
  const states = awareness.getStates() as Map<number, AwarenessState>
  const userMap = new Map<string | number, CollaboratorInfo>()

  states.forEach((state: AwarenessState, clientId: number) => {
    if (state.user) {
      const id = state.user.id || clientId
      if (!userMap.has(id)) {
        userMap.set(id, {
          id,
          name: state.user.name || `用户${clientId}`,
          color: state.user.color || '#3b82f6',
        })
      }
    }
  })

  return Array.from(userMap.values())
}

/** JSON content node interface */
interface JSONContentNode {
  type: string
  content?: JSONContentNode[]
}

/** 检查文档是否为空 */
export function isDocumentEmpty(content: JSONContentNode | null | undefined): boolean {
  if (!content || content.type !== 'doc') return !content
  const nodes = content.content
  if (!Array.isArray(nodes) || nodes.length === 0) return true
  if (nodes.length > 1) return false
  const first = nodes[0]
  return first?.type === 'paragraph' && (!first?.content || first.content.length === 0)
}

/** 防抖函数 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): { run: T; cancel: () => void } {
  let id: NodeJS.Timeout | null = null

  const run = ((...args: any[]) => {
    if (id) clearTimeout(id)
    id = setTimeout(() => {
      fn(...args)
      id = null
    }, delay)
  }) as T

  const cancel = () => {
    if (id) {
      clearTimeout(id)
      id = null
    }
  }

  return { run, cancel }
}

/** 规范化 WebSocket URL */
export function normalizeWebSocketUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null

  const trimmed = url.trim()
  
  // 已是 WebSocket URL
  if (trimmed.startsWith('ws://') || trimmed.startsWith('wss://')) {
    return trimmed
  }

  // HTTP → WebSocket
  if (trimmed.startsWith('http://')) {
    return trimmed.replace(/^http:\/\//, 'ws://')
  }
  if (trimmed.startsWith('https://')) {
    return trimmed.replace(/^https:\/\//, 'wss://')
  }

  // 相对路径
  if (trimmed.startsWith('/')) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}${trimmed}`
  }

  // 其他：添加协议
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  return `${protocol}${trimmed}`
}

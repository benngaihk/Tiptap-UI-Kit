/**
 * Notification Adapter
 * Allows users to plug in their own notification system (e.g., ant-design-vue, element-plus)
 */

export interface NotificationOptions {
  message: string
  description?: string
  duration?: number
}

export interface NotificationAdapter {
  success(options: NotificationOptions): void
  error(options: NotificationOptions): void
  warning(options: NotificationOptions): void
  info(options: NotificationOptions): void
}

/**
 * Default notification adapter using console
 */
export const defaultNotificationAdapter: NotificationAdapter = {
  success: (opts) => console.log('✅', opts.message, opts.description || ''),
  error: (opts) => console.error('❌', opts.message, opts.description || ''),
  warning: (opts) => console.warn('⚠️', opts.message, opts.description || ''),
  info: (opts) => console.info('ℹ️', opts.message, opts.description || ''),
}

/**
 * External notification library interface
 * Compatible with ant-design-vue, element-plus, etc.
 */
export interface ExternalNotificationLib {
  success: (opts: NotificationOptions) => void
  error: (opts: NotificationOptions) => void
  warning: (opts: NotificationOptions) => void
  info: (opts: NotificationOptions) => void
}

/**
 * Create an Ant Design Vue notification adapter
 * @example
 * import { notification } from 'ant-design-vue'
 * const adapter = createAntdNotificationAdapter(notification)
 */
export function createAntdNotificationAdapter(notification: ExternalNotificationLib): NotificationAdapter {
  return {
    success: (opts) => notification.success(opts),
    error: (opts) => notification.error(opts),
    warning: (opts) => notification.warning(opts),
    info: (opts) => notification.info(opts),
  }
}

// Global adapter instance
let _adapter: NotificationAdapter = defaultNotificationAdapter

export function setNotificationAdapter(adapter: NotificationAdapter): void {
  _adapter = adapter
}

export function getNotificationAdapter(): NotificationAdapter {
  return _adapter
}

/** Shorthand for showing notifications */
export const notify = {
  success: (opts: NotificationOptions) => _adapter.success(opts),
  error: (opts: NotificationOptions) => _adapter.error(opts),
  warning: (opts: NotificationOptions) => _adapter.warning(opts),
  info: (opts: NotificationOptions) => _adapter.info(opts),
}

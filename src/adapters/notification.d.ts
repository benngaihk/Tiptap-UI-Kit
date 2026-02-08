/**
 * Notification Adapter
 * Allows users to plug in their own notification system (e.g., ant-design-vue, element-plus)
 */
export interface NotificationOptions {
    message: string;
    description?: string;
    duration?: number;
}
export interface NotificationAdapter {
    success(options: NotificationOptions): void;
    error(options: NotificationOptions): void;
    warning(options: NotificationOptions): void;
    info(options: NotificationOptions): void;
}
/**
 * Default notification adapter using console
 */
export declare const defaultNotificationAdapter: NotificationAdapter;
/**
 * Create an Ant Design Vue notification adapter
 * @example
 * import { notification } from 'ant-design-vue'
 * const adapter = createAntdNotificationAdapter(notification)
 */
export declare function createAntdNotificationAdapter(notification: any): NotificationAdapter;
export declare function setNotificationAdapter(adapter: NotificationAdapter): void;
export declare function getNotificationAdapter(): NotificationAdapter;
/** Shorthand for showing notifications */
export declare const notify: {
    success: (opts: NotificationOptions) => void;
    error: (opts: NotificationOptions) => void;
    warning: (opts: NotificationOptions) => void;
    info: (opts: NotificationOptions) => void;
};
//# sourceMappingURL=notification.d.ts.map
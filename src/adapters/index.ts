/**
 * Adapters Entry
 * Provides compatibility layer for @vben/* packages
 */

// User store adapter (replaces @vben/stores)
export { useUserStore, setUserInfo } from './user'
export type { UserInfo } from './user'

// Preferences adapter (replaces @vben/preferences)
export { usePreferences, initTheme } from './preferences'

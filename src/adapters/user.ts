/**
 * User Adapter
 * Replaces @vben/stores useUserStore
 */

import { reactive, readonly } from 'vue'

export interface UserInfo {
  userId: string | number
  realName: string
  userName: string
  avatar?: string
}

interface UserStoreState {
  userInfo: UserInfo | null
}

const state = reactive<UserStoreState>({
  userInfo: null,
})

/**
 * Set user info (call this on app init)
 */
export function setUserInfo(info: UserInfo): void {
  state.userInfo = info
}

/**
 * Get user store (compatible with @vben/stores)
 */
export function useUserStore() {
  return {
    userInfo: readonly(state).userInfo,
    setUserInfo,
    getUserInfo: () => state.userInfo,
  }
}

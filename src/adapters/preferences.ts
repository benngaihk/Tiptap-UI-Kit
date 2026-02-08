/**
 * Preferences Adapter
 * Replaces @vben/preferences
 */

import { ref, computed, readonly } from 'vue'

type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>('light')

/**
 * Use preferences (compatible with @vben/preferences)
 */
export function usePreferences() {
  const theme = computed(() => currentTheme.value)
  const isDark = computed(() => currentTheme.value === 'dark')
  
  const setTheme = (t: Theme) => {
    currentTheme.value = t
    // Update data-theme attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t)
    }
  }
  
  const toggleTheme = () => {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }
  
  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    setTheme,
    toggleTheme,
  }
}

/**
 * Initialize theme from system preferences
 */
export function initTheme(): void {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    currentTheme.value = prefersDark ? 'dark' : 'light'
  }
}

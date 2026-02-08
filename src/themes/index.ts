/**
 * Theme Manager
 * API for theme switching and customization
 */

import type { ThemeMode, ThemePreset } from '@/core/editorConfig'

/** Current theme state */
let currentPreset: ThemePreset = 'default'
let currentMode: ThemeMode = 'light'

/** Custom theme registry */
const customThemes: Map<string, Record<string, string>> = new Map()

/**
 * Set theme
 */
export function setTheme(preset: ThemePreset, mode: ThemeMode = 'light'): void {
  currentPreset = preset
  currentMode = mode
  
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  
  // Remove existing theme classes
  root.classList.remove('theme-default', 'theme-notion', 'theme-github', 'theme-typora', 'theme-word')
  
  // Add new theme class
  if (preset !== 'default') {
    root.classList.add(`theme-${preset}`)
  }
  
  // Set mode
  root.setAttribute('data-theme', mode === 'auto' ? getSystemTheme() : mode)
  
  // Apply custom theme if registered
  if (preset === 'custom' && customThemes.has('custom')) {
    applyCustomTheme(customThemes.get('custom')!)
  }
}

/**
 * Get current theme
 */
export function getTheme(): { preset: ThemePreset; mode: ThemeMode } {
  return { preset: currentPreset, mode: currentMode }
}

/**
 * Toggle between light and dark mode
 */
export function toggleThemeMode(): ThemeMode {
  const newMode = currentMode === 'light' ? 'dark' : 'light'
  setTheme(currentPreset, newMode)
  return newMode
}

/**
 * Register custom theme
 */
export function registerTheme(name: string, variables: Record<string, string>): void {
  customThemes.set(name, variables)
}

/**
 * Apply custom theme variables
 */
export function applyCustomTheme(variables: Record<string, string>): void {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value)
  }
}

/**
 * Get system theme preference
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Watch system theme changes
 */
export function watchSystemTheme(callback: (mode: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {}
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light')
  }
  
  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}

/** Export all presets for import */
export const THEME_PRESETS = ['default', 'notion', 'github', 'typora', 'word'] as const

// ===== Device View Management =====

/** Device view type */
export type DeviceView = 'pc' | 'pad' | 'mobile'

/** Current device view */
let currentDevice: DeviceView = 'pc'

/**
 * Set device view
 */
export function setDeviceView(device: DeviceView): void {
  currentDevice = device
  
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  root.setAttribute('data-device', device)
}

/**
 * Get current device view
 */
export function getDeviceView(): DeviceView {
  return currentDevice
}

/** Export device view options */
export const DEVICE_VIEWS = ['pc', 'pad', 'mobile'] as const

// ===== Orientation Management =====

/** Orientation type */
export type Orientation = 'portrait' | 'landscape'

/** Current orientation */
let currentOrientation: Orientation = 'portrait'

/**
 * Set orientation
 */
export function setOrientation(orientation: Orientation): void {
  currentOrientation = orientation
  
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  root.setAttribute('data-orientation', orientation)
}

/**
 * Get current orientation
 */
export function getOrientation(): Orientation {
  return currentOrientation
}

/** Export orientation options */
export const ORIENTATIONS = ['portrait', 'landscape'] as const

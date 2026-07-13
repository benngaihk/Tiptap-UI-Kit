/**
 * Debounce - 防抖工具
 * @description 全仓唯一的防抖实现，带 cancel（丢弃待执行调用）与 flush（立即执行待执行调用）。
 * 组件卸载前若不想丢失最后一次调用（如 update 事件派发），用 flush 而不是 cancel。
 */

export type DebouncedFn<T extends (...args: unknown[]) => void> = ((...args: Parameters<T>) => void) & {
  /** 丢弃待执行的调用 */
  cancel: () => void
  /** 立即执行待执行的调用（若有） */
  flush: () => void
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): DebouncedFn<T> {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pendingArgs: Parameters<T> | null = null

  const debounced = ((...args: Parameters<T>) => {
    pendingArgs = args
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      const callArgs = pendingArgs
      pendingArgs = null
      fn(...(callArgs as Parameters<T>))
    }, delay)
  }) as DebouncedFn<T>

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    pendingArgs = null
  }

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
      const callArgs = pendingArgs
      pendingArgs = null
      if (callArgs) fn(...callArgs)
    }
  }

  return debounced
}

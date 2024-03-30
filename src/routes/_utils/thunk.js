// @ts-check
/**
 * Run a function once, then cache the result and return the cached result thereafter
 * @type {<T>(fn: () => T) => () => T}
 */
export function thunk (func) {
  /** @type {ReturnType<typeof func>} */
  let cached
  let runOnce = false
  return () => {
    if (!runOnce) {
      cached = func()
      runOnce = true
    }
    return cached
  }
}

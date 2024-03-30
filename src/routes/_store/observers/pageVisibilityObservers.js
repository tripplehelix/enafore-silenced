export function pageVisibilityObservers (store) {
  if (!process.env.BROWSER) {
    return
  }

  document.addEventListener('visibilitychange', () => {
    store.set({ pageVisibilityHidden: document.hidden })
  })
}

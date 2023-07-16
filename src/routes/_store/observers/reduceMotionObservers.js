export function reduceMotionObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('reduceMotion', reduceMotion => {
    document.body.classList.toggle('reduce-motion', reduceMotion)
  })
}

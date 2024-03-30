export function reduceMotionObservers (store) {
  if (!process.env.BROWSER) {
    return
  }

  store.observe('reduceMotion', reduceMotion => {
    document.body.classList.toggle('reduce-motion', reduceMotion)
  })
}

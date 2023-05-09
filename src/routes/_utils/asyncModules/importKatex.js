export const importKatex = () =>
  Promise.all([
    import('katex'),
    new Promise((resolve, reject) => {
      if (document.querySelector('#theKatexStyle')) {
        return resolve()
      }
      const style = document.createElement('link')
      style.addEventListener('load', resolve)
      style.addEventListener('error', reject)
      style.id = 'theKatexStyle'
      style.rel = 'stylesheet'
      style.integrity = 'sha384-3UiQGuEI4TTMaFmGIZumfRPtfKQ3trwQE2JgosJxCnGmQpL/lJdjpcHkaaFwHlcI'
      style.crossOrigin = 'anonymous'
      style.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css'
      document.head.appendChild(style)
    })
  ]).then(e => e[0].default)

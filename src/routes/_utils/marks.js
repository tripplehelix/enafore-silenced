const enabled = process.env.BROWSER && performance.mark && (
  process.env.NODE_ENV !== 'production' ||
  (typeof location !== 'undefined' && location.search.includes('marks=true'))
)

const perf = process.env.BROWSER && performance

export function mark (name) {
  if (enabled) {
    perf.mark(`start ${name}`)
  }
}

export function stop (name) {
  if (enabled) {
    perf.mark(`end ${name}`)
    perf.measure(name, `start ${name}`, `end ${name}`)
  }
}

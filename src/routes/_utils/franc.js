import FrancWorker from '../_workers/franc.js'
import PromiseWorker from 'promise-worker'
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru.js'

const cache = new QuickLRU({ maxSize: 150 })

let worker

export function init () {
  worker = worker || new PromiseWorker(new FrancWorker())
}

async function decodeWithoutCache (text) {
  init()
  return await worker.postMessage(text)
}

export async function franc (text) {
  let result = cache.get(text)
  if (!result) {
    result = await decodeWithoutCache(text)
    cache.set(text, result)
  }
  return result
}

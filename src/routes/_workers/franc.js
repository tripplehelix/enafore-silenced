import { decompress } from 'fzstd'
import registerPromiseWorker from 'promise-worker/register.js'
self.decompress=decompress;
registerPromiseWorker(async (text) => {
  debugger
  //return franc(text)
})

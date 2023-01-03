import { decompress } from 'fzstd'
import registerPromiseWorker from 'promise-worker/register.js'
const francAll = (async () => {
  const ab = await (await fetch('/franc-all.zst')).arrayBuffer()
  const u8 = new Uint8Array(ab)
  const d8 = decompress(u8)
  const sr = new TextDecoder().decode(d8)
  const sf = sr.replace(/export{.+/, 'return{franc:K,francAll:B}')
  return new Function(sf)().francAll // eslint-disable-line no-new-func
})()
registerPromiseWorker(async (text) => {
  return (await francAll)(text)
})

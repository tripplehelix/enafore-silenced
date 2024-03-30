// @ts-check
import { thunk } from '../thunk.js'

export const isWebKit = thunk(() => process.env.BROWSER && 'webkitIndexedDB' in globalThis)

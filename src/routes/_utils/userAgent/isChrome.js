// @ts-check
import { thunk } from '../thunk.js'

export const isChrome = thunk(() => process.env.BROWSER && /Chrome/.test(navigator.userAgent))

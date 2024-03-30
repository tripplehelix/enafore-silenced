// @ts-check
import { thunk } from '../thunk.js'

export const isIOS = thunk(() => process.env.BROWSER && /iP(?:hone|ad|od)/.test(navigator.userAgent))

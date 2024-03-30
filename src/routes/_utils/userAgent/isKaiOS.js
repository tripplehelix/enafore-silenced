// @ts-check
import { thunk } from '../thunk.js'

export const isKaiOS = thunk(() => process.env.BROWSER && /KAIOS/.test(navigator.userAgent))

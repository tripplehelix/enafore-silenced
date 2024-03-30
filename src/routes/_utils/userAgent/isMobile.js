// @ts-check
import { thunk } from '../thunk.js'

export const isMobile = thunk(() => process.env.BROWSER && /(?:iPhone|iPod|iPad|Android|KAIOS)/.test(navigator.userAgent))

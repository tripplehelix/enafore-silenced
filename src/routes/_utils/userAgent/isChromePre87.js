// @ts-check
import { isChrome } from './isChrome.js'
import { thunk } from '../thunk.js'

// https://caniuse.com/cookie-store-api
export const isChromePre87 = thunk(() => (process.env.BROWSER && isChrome() && typeof cookieStore === 'undefined'))

// @ts-check
import { getEmojiRegex } from './emojiRegex.ts'

// replace emoji in HTML with something else, safely skipping HTML tags
/**
 * @param {string} string
 * @param {(substring: string, ...args: any[]) => string} replacer
 */
export function replaceEmoji (string, replacer) {
  const emojiRegex = getEmojiRegex()
  return string.replace(emojiRegex, replacer)
}

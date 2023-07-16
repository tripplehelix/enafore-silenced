import { emojifyText } from './emojifyText.js'
import { massageStatusPlainText } from './massageStatusPlainText.js'

export function massageUserText (text, emojis, $autoplayGifs, $disableDecomojiConverter) {
  text = text || ''
  text = emojifyText(text, emojis, $autoplayGifs, $disableDecomojiConverter)
  text = massageStatusPlainText(text)
  return text
}

import { replaceAll } from './strings.js'
import { replaceEmoji } from './replaceEmoji.js'
import { testEmojiSupported } from './testEmojiSupported.js'

export function emojifyText (text, emojis, autoplayGifs) {
  // replace native emoji with wrapped spans so we can give them the proper font-family
  // as well as show tooltips
  text = replaceEmoji(text, substring => {
    if(testEmojiSupported(substring)) {
      return `<span class="inline-emoji">${substring}</span>`
    } else {
      return `<span class="inline-emoji unsupported" style="background-image:url('https://github.com/googlefonts/noto-emoji/blob/main/png/72/emoji_u${[...substring].map(e=>e.codePointAt(0).toString(16)).join("_")}.png?raw=tru')">${substring}</span>`
    }
  })

  // replace custom emoji
  if (emojis) {
    for (const emoji of emojis) {
      const urlToUse = autoplayGifs ? emoji.url : emoji.static_url
      const shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(
        text,
        shortcodeWithColons,
        `<img class="inline-custom-emoji" draggable="false" src="${urlToUse}"
                    alt="${shortcodeWithColons}" title="${shortcodeWithColons}" />`
      )
    }
  }

  return text
}

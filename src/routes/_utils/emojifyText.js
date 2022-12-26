import { replaceAll } from './strings.js'
import { replaceEmoji } from './replaceEmoji.js'
import { testEmojiSupported } from './testEmojiSupported.js'

export function emojifyText (text, emojis, autoplayGifs) {
  // replace native emoji with wrapped spans so we can give them the proper font-family
  // as well as show tooltips
  text = replaceEmoji(text, substring => {
    if(!testEmojiSupported(substring)) {
      if(!document.getElementById("emoji-font-"+substring)) {
        document.head.appendChild(
          Object.assign(
            document.createElement("link"),
            {
              href: "https://fonts.googleapis.com/css2?family=Noto+Colr+Emoji+Glyf&text=" + encodeURIComponent(substring),
              rel:"stylesheet",
              id: "emoji-font-" + substring
            }
          )
        )
      }
    }
    return `<span class="inline-emoji">${substring}</span>`
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

window.addEventListener("input", function (e) {
  emojifyText(e.originalTarget.value) // load emoji fonts when typed in textareas and inputs and stuff
})
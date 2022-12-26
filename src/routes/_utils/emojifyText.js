import { replaceAll } from './strings.js'
import { replaceEmoji } from './replaceEmoji.js'
import { testEmojiSupported } from './testEmojiSupported.js'

const styleEle = document.createElement("style")
styleEle.id = "theEmojiStyle"
document.head.appendChild(styleEle)
const polyfilled = new Set()
export function emojifyText (text, emojis, autoplayGifs) {
  // replace native emoji with wrapped spans so we can give them the proper font-family
  // as well as show tooltips
  text = replaceEmoji(text, substring => {
    if(!testEmojiSupported(substring)) {
      if(!polyfilled.has(substring)) {
        polyfilled.add(substring);
        (async () => {
          styleEle.textContent += await(await fetch("https://fonts.googleapis.com/css2?family=Noto+Colr+Emoji+Glyf&text=" + encodeURIComponent(substring))).text()
        })()
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

if(typeof window !== "undefined") {
  window.addEventListener("input", function (e) {
    emojifyText(e.data+"")
  })
}
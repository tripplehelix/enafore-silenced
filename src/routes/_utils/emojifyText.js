import { replaceAll } from './strings.js'
import { replaceEmoji } from './replaceEmoji.js'
import { testEmojiSupported } from './testEmojiSupported.js'

let styleEle;
if(typeof window !== "undefined") {
  styleEle = document.createElement("style")
  styleEle.id = "theEmojiStyle"
  styleEle.textContent = "@import url(https://fonts.googleapis.com/css2?family=Noto+Color+Emoji);"
  document.head.appendChild(styleEle)
  window.addEventListener("input", function (e) {
    emojifyText(e.data+"")
  })
}

const polyfilled = new Set()
export function emojifyText (text, emojis, autoplayGifs) {
  // replace native emoji with wrapped spans so we can give them the proper font-family
  // as well as show tooltips
  text = replaceEmoji(text, substring => {
    if(styleEle && !polyfilled.has(substring) && !testEmojiSupported(substring)) {
      polyfilled.add(substring);
      /*(async () => {
        styleEle.textContent += await(await fetch("https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&text=" + encodeURIComponent(substring))).text()
      })()*/
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
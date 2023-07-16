import { replaceAll } from './strings.js'
import { replaceEmoji } from './replaceEmoji.js'

const decomojiMap = {
  a: 'あ',
  i: 'い',
  u: 'う',
  e: 'え',
  o: 'お',
  ka: 'か',
  ki: 'き',
  ku: 'く',
  ke: 'け',
  ko: 'こ',
  sa: 'さ',
  shi: 'し',
  su: 'す',
  se: 'せ',
  so: 'そ',
  ta: 'た',
  ti: 'ち',
  tsu: 'つ',
  te: 'て',
  to: 'と',
  na: 'な',
  ni: 'に',
  nu: 'ぬ',
  ne: 'ね',
  no: 'の',
  ha: 'は',
  hi: 'ひ',
  fu: 'ふ',
  he: 'へ',
  ho: 'ほ',
  ma: 'ま',
  mi: 'み',
  mu: 'む',
  me: 'め',
  mo: 'も',
  ya: 'や',
  yu: 'ゆ',
  yo: 'よ',
  ra: 'ら',
  ri: 'り',
  ru: 'る',
  re: 'れ',
  ro: 'ろ',
  wa: 'わ',
  wo: 'を',
  n: 'ん',
  ga: 'が',
  gi: 'ぎ',
  gu: 'ぐ',
  ge: 'げ',
  go: 'ご',
  za: 'ざ',
  zi: 'じ',
  zu: 'ず',
  ze: 'ぜ',
  zo: 'ぞ',
  da: 'だ',
  di: 'ぢ',
  du: 'づ',
  de: 'で',
  do: 'ど',
  ba: 'ば',
  bi: 'び',
  bu: 'ぶ',
  be: 'べ',
  bo: 'ぼ',
  pa: 'ぱ',
  pi: 'ぴ',
  pu: 'ぷ',
  pe: 'ぺ',
  po: 'ぽ',
  la: 'ぁ',
  li: 'ぃ',
  lu: 'ぅ',
  le: 'ぇ',
  lo: 'ぉ',
  lya: 'ゃ',
  lyu: 'ゅ',
  lyo: 'ょ',
  ltsu: 'っ',
  ten: '、',
  maru: '。',
  kkb: '（',
  kka: '）',
  wave: '～'
}
const decomojiRegex = new RegExp(
  String.raw`(?::_(?:${Object.keys(decomojiMap).join('|')}):[\s\u200b]*)+`,
  'g'
)

export function emojifyText (
  text,
  emojis,
  autoplayGifs,
  disableDecomojiConverter
) {
  // replace native emoji with wrapped spans so we can give them the proper font-family
  // as well as show tooltips
  text = replaceEmoji(text, substring => {
    return `<span class="inline-emoji">${substring}</span>`
  })

  // replace custom emoji
  if (emojis) {
    if (!disableDecomojiConverter) {
      text = text.replace(decomojiRegex, s => {
        for (const k in decomojiMap) {
          const shortcodeWithColons = `:_${k}:`
          s = replaceAll(s, shortcodeWithColons, decomojiMap[k])
        }
        return `<span class="decomoji">${s}</span>`
      })
    }
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

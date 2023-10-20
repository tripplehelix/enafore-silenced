import { grabAllTextNodes } from './grabAllTextNodes.js'
import { escapeRegExp } from './escapeRegExp.js'
import { getEmojiRegex } from './emojiRegex.js'

function consumeBalanced (string, open, close) {
  let balance = 1
  let index = 0
  while (index < string.length) {
    if (string[index] === '\\' && string[index + 1] === open) {
      balance++
      index += 2
    } else if (string[index] === '\\' && string[index + 1] === close) {
      balance--
      if (balance === 0) {
        break
      }
      index += 2
    } else {
      index++
    }
  }
  return {
    consumed: string.slice(0, index),
    remaining: string.slice(index + 2)
  }
}

export function renderPostHTML ({
  originalStatus,
  autoplayGifs,
  disableDecomojiConverter,
  emojis,
  mentionsByURL
}) {
  const dom = document.createElement('div')
  if (!originalStatus.content) {
    return dom
  }
  dom.innerHTML = originalStatus.content
  for (const quoteInline of dom.querySelectorAll('quote-inline')) {
    quoteInline.remove()
  }
  const textNodes = grabAllTextNodes(dom, [])
  const customEmoji = [...emojis.keys()].map(e => escapeRegExp(e)).join('|')
  const unicodeEmoji = getEmojiRegex().source
  const part = new RegExp(`:(${customEmoji}):|(${unicodeEmoji})|(.)`, 'g')
  for (const node of textNodes) {
    let newNodes = []
    // eslint-disable-next-line no-unused-vars
    for (const [_, customEmoji, unicodeEmoji, text] of node.nodeValue.matchAll(part)) {
      if (text) {
        if (typeof newNodes[newNodes.length - 1] === 'string') {
          newNodes[newNodes.length - 1] += text
        } else {
          newNodes.push(text)
        }
      } else if (customEmoji) {
        const emoji = emojis.get(customEmoji)
        if (!emoji) newNodes.push(`:${customEmoji}:`)
        const urlToUse = autoplayGifs ? emoji.url : emoji.static_url
        const shortcodeWithColons = `:${emoji.shortcode}:`
        newNodes.push(Object.assign(new Image(), {
          className: 'inline-custom-emoji',
          draggable: false,
          src: urlToUse,
          alt: shortcodeWithColons,
          title: shortcodeWithColons
        }))
      } else if (unicodeEmoji) {
        newNodes.push(Object.assign(document.createElement('span'), {
          className: 'inline-emoji',
          textContent: unicodeEmoji
        }))
      }
    }
    newNodes = newNodes.map(text => {
      if (typeof text !== 'string') return text
      const fragment = document.createDocumentFragment()
      let match
      while ((match = text.match(/((?<!\$)\$\$(?!\$))|(\\\()|(\\\[)/))) {
        const prev = text.slice(0, match.index)
        if (prev !== '') fragment.append(prev)
        text = text.slice(match.index + match[0].length)
        if (match[1]) {
          const consumed = text.slice(0, text.indexOf('$$'))
          fragment.appendChild(Object.assign(document.createElement('code'), { textContent: consumed, className: 'to-katexify' }))
          text = text.slice(consumed.length + 2)
        } else if (match[2]) {
          const { consumed, remaining } = consumeBalanced(text, '(', ')')
          fragment.appendChild(Object.assign(document.createElement('code'), { textContent: consumed, className: 'to-katexify' }))
          text = remaining
        } else if (match[3]) {
          const { consumed, remaining } = consumeBalanced(text, '[', ']')
          fragment.appendChild(Object.assign(document.createElement('pre'), { textContent: consumed, className: 'to-katexify' }))
          text = remaining
        }
      }
      if (text !== '') fragment.append(text)
      return fragment
    })
    node.replaceWith(...newNodes)
  }
  const anchors = Array.from(dom.getElementsByTagName('A'))
  for (const anchor of anchors) {
    if (originalStatus.tags && anchor.classList.contains('hashtag')) {
      for (const tag of originalStatus.tags) {
        if (anchor.getAttribute('href').toLowerCase().endsWith(`/${tag.name.toLowerCase()}`)) {
          anchor.setAttribute('href', `/tags/${tag.name}`)
          anchor.removeAttribute('target')
          anchor.removeAttribute('rel')
          anchor.className = 'hashtag'
          continue
        }
      }
    } else if (anchor.classList.contains('mention')) {
      const mention = mentionsByURL.get(anchor.getAttribute('href'))
      if (mention) {
        mention.included = true
        anchor.setAttribute('href', `/accounts/${mention.id}`)
        anchor.setAttribute('title', `@${mention.acct}`)
        anchor.removeAttribute('target')
        anchor.removeAttribute('rel')
        anchor.className = 'mention'
        anchor.textContent = `@${mention.username}`
        continue
      }
    }
    anchor.setAttribute('title', anchor.href)
    anchor.setAttribute('target', '_blank')
    anchor.setAttribute('rel', 'nofollow noopener')
    anchor.className = ''
  }
  return dom
}

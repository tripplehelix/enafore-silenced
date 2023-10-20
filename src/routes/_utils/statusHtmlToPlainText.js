import { mark, stop } from './marks.js'

const domParser = process.browser && new DOMParser()

// mentions like "@foo" have to be expanded to "@foo@example.com"
function massageMentions (doc, mentions) {
  const anchors = doc.querySelectorAll('a.mention')
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    const href = anchor.getAttribute('href')
    const mention = mentions.find(mention => mention.url === href)
    if (mention) {
      anchor.innerText = `@${mention.acct}`
    }
  }
}

// paragraphs should be separated by double newlines
// single <br/>s should become single newlines
function innerTextRetainingNewlines (doc) {
  const brs = doc.querySelectorAll('br')
  for (let j = 0; j < brs.length; j++) {
    const br = brs[j]
    br.parentNode.replaceChild(doc.createTextNode('\n'), br)
  }
  return [].map.call(doc.body.childNodes, e => e.textContent).join('\n\n')
}

export function statusHtmlToPlainText (html, mentions) {
  if (!html) {
    return ''
  }
  mark('statusHtmlToPlainText')
  const doc = domParser.parseFromString(html, 'text/html')
  massageMentions(doc, mentions)
  const res = innerTextRetainingNewlines(doc)
  stop('statusHtmlToPlainText')
  return res
}

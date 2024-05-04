import {
  DefaultTreeAdapterMap,
  parseFragment,
  defaultTreeAdapter,
} from 'parse5'
import { mark, stop } from './marks.js'
import { Mention } from './types.ts'

const blockElements =
  /^(p$|d[dlti]|a[rsd]|fo[or]|mai|na|se[ac]|bl|fi|ce|h|men|[uo]l|li|le|op|pre|x|pl|fr|det|sum)/

export function statusDomToPlainText(
  doc: DefaultTreeAdapterMap['parentNode'],
  mentions?: Mention[],
): string {
  mark('statusDomToPlainText')
  function walkElements(node: DefaultTreeAdapterMap['parentNode']): string {
    let s = ''
    for (const child of node.childNodes) {
      if (defaultTreeAdapter.isElementNode(child)) {
        if (child.tagName === 'br') {
          s += '\n'
        } else if (child.tagName === 'a') {
          const c = child.attrs.find((attr) => attr.name === 'class')
          const h = child.attrs.find((attr) => attr.name === 'href')
          let m: Mention | undefined
          if (
            mentions != null &&
            c != null &&
            c.value.split(/\s+/).includes('mention') &&
            h != null &&
            (m = mentions.find(
              (mention) =>
                h.value === mention.url ||
                h.value === '/accounts/' + mention.id,
            )) != null
          ) {
            s += '@' + m.acct
            continue
          }
        } else if (child.tagName === 'img') {
          const alt = child.attrs.find((attr) => attr.name === 'alt')
          if (alt != null) s += alt.value
        }
        s += walkElements(child)
        if (blockElements.test(child.tagName)) s += '\n\n'
      } else if (defaultTreeAdapter.isTextNode(child)) {
        s += child.value
      }
    }
    return s
  }
  const s = walkElements(doc)
  stop('statusDomToPlainText')
  return s
}

export function statusHtmlToPlainText(html: string, mentions: any): string {
  if (!html) {
    return ''
  }
  return statusDomToPlainText(parseFragment(html), mentions)
}

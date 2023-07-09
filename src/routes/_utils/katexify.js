import { importKatex } from './asyncModules/importKatex.js'

function grabAllTextNodes (node, allText) {
  const childNodes = node.childNodes
  let length = childNodes.length
  let subnode
  let nodeType
  while (length--) {
    subnode = childNodes[length]
    nodeType = subnode.nodeType
    if (nodeType === 3) {
      allText.push(subnode)
    } else if (
      nodeType === 1 &&
      !('ownerSVGElement' in subnode) &&
      !/^(?:iframe|noframes|noscript|script|select|style|textarea|code|pre)$/.test(
        subnode.nodeName.toLowerCase()
      )
    ) {
      grabAllTextNodes(subnode, allText)
    }
  }
  return allText
}

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

export function katexify (node) {
  const promises = []
  const allText = grabAllTextNodes(node, [])
  let length = allText.length
  let modified
  let fragment
  let subnode
  let text
  while (length--) {
    modified = false
    fragment = document.createDocumentFragment()
    subnode = allText[length]
    text = subnode.nodeValue
    function render (string, displayMode) {
      modified = true
      const element = document.createElement('span')
      element.textContent = string
      promises.push(importKatex().then(katex => {
        katex.render(string, element, {
          throwOnError: false,
          displayMode
        })
      }))
      return element
    }
    let match
    while ((match = text.match(/((?<!\$)\$\$(?!\$))|(\\\()|(\\\[)/))) {
      const prev = text.slice(0, match.index)
      if (prev !== '') fragment.appendChild(document.createTextNode(prev))
      text = text.slice(match.index + match[0].length)
      if (match[1]) {
        const consumed = text.slice(0, text.indexOf('$$'))
        fragment.appendChild(render(consumed, false))
        text = text.slice(consumed.length + 2)
      } else if (match[2]) {
        const { consumed, remaining } = consumeBalanced(text, '(', ')')
        fragment.appendChild(render(consumed, false))
        text = remaining
      } else if (match[3]) {
        const { consumed, remaining } = consumeBalanced(text, '[', ']')
        fragment.appendChild(render(consumed, true))
        text = remaining
      }
    }
    if (text !== '') fragment.appendChild(document.createTextNode(text))
    if (modified) {
      subnode.parentNode.replaceChild(fragment, subnode)
    }
  }
  return promises.length ? Promise.all(promises) : null
}

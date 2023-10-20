import { get } from '../_utils/lodash-lite.js'
import { mark, stop } from '../_utils/marks.js'
import {
  decode as decodeBlurhash,
  init as initBlurhash
} from '../_utils/blurhash.js'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask.js'
import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText.js'
import { computeHashtagBarForStatus } from '../_utils/hashtagBar.js'
import { renderMfm } from '../_utils/renderMfm.js'
import { renderPostHTML } from '../_utils/renderPostHTML.js'
import { store } from '../_store/store.js'

function getActualStatus (statusOrNotification) {
  return (
    get(statusOrNotification, ['status']) ||
    get(statusOrNotification, ['notification', 'status'])
  )
}

export function prepareToRehydrate () {
  // start the blurhash worker a bit early to save time
  try {
    initBlurhash()
  } catch (err) {
    console.error('could not start blurhash worker', err)
  }
}

async function decodeAllBlurhashes (status) {
  const mediaWithBlurhashes = get(status, ['media_attachments'], [])
    .filter(_ => _.blurhash)
  if (mediaWithBlurhashes.length) {
    mark(`decodeBlurhash-${status.id}`)
    await Promise.all(
      mediaWithBlurhashes.map(async media => {
        try {
          media.decodedBlurhash = await decodeBlurhash(media.blurhash)
          console.log('decoded blurhash for', media)
        } catch (err) {
          console.warn('Could not decode blurhash, ignoring', err)
        }
      })
    )
    stop(`decodeBlurhash-${status.id}`)
  }
}

async function calculatePlainTextContent (originalStatus) {
  const content = originalStatus.content || ''
  const mentions = originalStatus.mentions || []
  // Calculating the plaintext from the HTML is a non-trivial operation, so we might
  // as well do it in advance, while blurhash is being decoded on the worker thread.
  await new Promise(resolve => {
    scheduleIdleTask(() => {
      originalStatus.plainTextContent = statusHtmlToPlainText(content, mentions)
      resolve()
    })
  })
}

export const rehydrated = Symbol('rehydrated')
export const rehydrating = Symbol('rehydrating')

function rehydrateQuote (originalStatus) {
  if (originalStatus.quote) {
    return rehydrateStatusOrNotification({ status: originalStatus.quote })
  }
}

function processStatusContent (originalStatus) {
  try {
    const mfmContent = originalStatus.content_type === 'text/x.misskeymarkdown' ? originalStatus.text : (originalStatus.akkoma && originalStatus.akkoma.source && originalStatus.akkoma.source.mediaType === 'text/x.misskeymarkdown') ? originalStatus.akkoma.source.content : null
    let dom, hashtagsInBar
    const { autoplayGifs, disableDecomojiConverter, currentVerifyCredentials } = store.get()
    const userHost = currentVerifyCredentials && currentVerifyCredentials.fqn.split('@')[1]
    const emojis = new Map()
    if (originalStatus.emojis) {
      for (const emoji of originalStatus.emojis) {
        emojis.set(emoji.shortcode, emoji)
      }
    }
    const mentionsByHandle = new Map()
    const mentionsByURL = new Map()
    if (originalStatus.mentions) {
      for (const mention of originalStatus.mentions) {
        mention.included = false
        mentionsByURL.set(mention.url, mention)
        mentionsByHandle.set(mention.acct.includes('@') ? mention.acct : `${mention.acct}@${userHost}`, mention)
        const domainParts = new URL(mention.url).hostname.split('.')
        do {
          mentionsByHandle.set(`${mention.acct.split('@')[0]}@${domainParts.join('.')}`, mention)
        } while (domainParts.shift())
      }
    }
    if (mfmContent) {
      dom = renderMfm({
        mfmContent,
        originalStatus,
        autoplayGifs,
        disableDecomojiConverter,
        emojis,
        mentionsByHandle,
        userHost
      })
    } else {
      dom = renderPostHTML({
        originalStatus,
        autoplayGifs,
        disableDecomojiConverter,
        emojis,
        mentionsByURL,
        userHost
      })
    };
    ({ dom, hashtagsInBar } = computeHashtagBarForStatus(dom, originalStatus))
    if (originalStatus.mentions) {
      const extraMentions = originalStatus.mentions.filter(mention => !mention.included)
      if (extraMentions.length) {
        let firstBlock = dom
        while (firstBlock.firstChild && firstBlock.firstChild && firstBlock.firstChild.nodeType === 1 && ['DIV', 'P'].includes(firstBlock.firstChild.tagName)) {
          firstBlock = firstBlock.firstChild
        }
        while (extraMentions.length) {
          const mention = extraMentions.pop()
          if (mention.id === originalStatus.account.id) {
            continue
          }
          firstBlock.prepend(Object.assign(document.createElement('a'), {
            className: 'mention',
            href: `/accounts/${mention.id}`,
            title: `@${mention.acct}`,
            textContent: `@${mention.username}`
          }), ' ')
        }
      }
    }
    originalStatus.content = dom.innerHTML
    originalStatus.hashtagsInBar = hashtagsInBar
  } catch (e) {
    console.warn('failed to processStatusContent', originalStatus, e)
  }
}

// Do stuff that we need to do when the status or notification is fetched from the database,
// like calculating the blurhash or calculating the plain text content
export async function rehydrateStatusOrNotification (statusOrNotification) {
  const status = getActualStatus(statusOrNotification)
  if (!status) return
  const originalStatus = status.reblog ? status.reblog : status
  if (originalStatus[rehydrated] || originalStatus[rehydrating]) return
  originalStatus[rehydrating] = true
  processStatusContent(originalStatus)
  await Promise.all([
    decodeAllBlurhashes(originalStatus),
    calculatePlainTextContent(originalStatus),
    rehydrateQuote(originalStatus)
  ])
  delete originalStatus[rehydrating]
  originalStatus[rehydrated] = true
}

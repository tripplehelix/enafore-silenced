import { reactStatus, unreactStatus } from '../_api/react.js'
import { store } from '../_store/store.js'
import { toast } from '../_components/toast/toast.js'
import { formatIntl } from '../_utils/formatIntl.js'
import { importShowEmojiDialog } from '../_components/dialog/asyncDialogs/importShowEmojiDialog.js'
import { updateCustomEmojiForInstance } from './emoji.js'
import { updateStatus } from './timeline.js'

export async function setReacted (statusId, reacting, reaction, apiVersion) {
  if (reaction.extern && !apiVersion.externReactions) {
    /* no await */ toast.say('Your instance doesn\'t allow reacting with remote custom emojis')
    return false
  }
  const { online } = store.get()
  if (!online) {
    /* no await */ toast.say(reacting ? 'intl.cannotFavoriteOffline' : 'intl.cannotUnfavoriteOffline')
    return false
  }
  const { currentInstance, accessToken } = store.get()
  const networkPromise = reacting
    ? reactStatus(currentInstance, accessToken, statusId, reaction.name, apiVersion)
    : unreactStatus(currentInstance, accessToken, statusId, reaction.name, apiVersion)
  try {
    await networkPromise
    return true
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(reacting
      ? formatIntl('intl.unableToFavorite', { error: (e.message || '') })
      : formatIntl('intl.unableToUnfavorite', { error: (e.message || '') })
    )
    return false
  }
}

export async function pickEmojiReaction (status) {
  const { currentInstance, accessToken, currentPleromaFeatures } = store.get()
  const reactionApiVersion = {
    customEmojiReactions: currentPleromaFeatures ? currentPleromaFeatures.includes('custom_emoji_reactions') : true,
    externReactions: true,
    isPleroma: !!currentPleromaFeatures
  }
  const [showEmojiDialog] = await Promise.all([
    importShowEmojiDialog(),
    updateCustomEmojiForInstance(currentInstance)
  ])
  showEmojiDialog(async pickedEmoji => {
    const didReact = await setReacted(status.id, true, { name: pickedEmoji.name || pickedEmoji.unicode }, reactionApiVersion)
    if (didReact) {
      updateStatus(currentInstance, accessToken, status.id)
    }
  })
}

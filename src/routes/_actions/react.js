import { reactStatus, unreactStatus } from '../_api/react.js'
import { store } from '../_store/store.js'
import { toast } from '../_components/toast/toast.js'
import { database } from '../_database/database.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setReacted (statusId, reacting, reaction, apiVersion) {
  if(reaction.extern && !externReactions) {
    /* no await */ toast.say('Your instance doesn\'t allow reacting with remote custom emojis')
    return
  }
  const { online } = store.get()
  if (!online) {
    /* no await */ toast.say(reacting ? 'intl.cannotFavoriteOffline' : 'intl.cannotUnfavoriteOffline')
    return
  }
  const { currentInstance, accessToken } = store.get()
  const networkPromise = reacting
    ? reactStatus(currentInstance, accessToken, statusId, reaction.name, apiVersion)
    : unreactStatus(currentInstance, accessToken, statusId, reaction.name, apiVersion)
  try {
    await networkPromise
  } catch (e) {
    console.error(e)
    /* no await */ toast.say(reacting
      ? formatIntl('intl.unableToFavorite', { error: (e.message || '') })
      : formatIntl('intl.unableToUnfavorite', { error: (e.message || '') })
    )
  }
}

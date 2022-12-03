import { reactStatus, unreactStatus } from '../_api/react.js'
import { store } from '../_store/store.js'
import { toast } from '../_components/toast/toast.js'
import { database } from '../_database/database.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setReacted (statusId, reacting, reactionName, apiVersion) {
  const { online } = store.get()
  if (!online) {
    /* no await */ toast.say(reacting ? 'intl.cannotFavoriteOffline' : 'intl.cannotUnfavoriteOffline')
    return
  }
  const { currentInstance, accessToken } = store.get()
  const networkPromise = reacting
    ? reactStatus(currentInstance, accessToken, statusId, reactionName, apiVersion)
    : unreactStatus(currentInstance, accessToken, statusId, reactionName, apiVersion)
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

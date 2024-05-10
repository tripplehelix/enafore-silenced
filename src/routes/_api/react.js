import { get, post, put, del, WRITE_TIMEOUT, DEFAULT_TIMEOUT } from '../_utils/ajax.js'
import { basename, auth } from './utils.js'
import { getStatus } from './statuses.js'
import { getAccount } from './user.js'

export async function reactStatus (instanceName, accessToken, statusId, reactionName, apiVersion) {
  if (apiVersion.isPleroma) {
    const url = `${basename(instanceName)}/api/v1/pleroma/statuses/${statusId}/reactions/${encodeURIComponent(reactionName)}`
    return put(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
  } else {
    const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/react/${encodeURIComponent(reactionName)}`
    return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
  }
}

export async function unreactStatus (instanceName, accessToken, statusId, reactionName, apiVersion) {
  if (apiVersion.isPleroma) {
    const url = `${basename(instanceName)}/api/v1/pleroma/statuses/${statusId}/reactions/${encodeURIComponent(reactionName)}`
    return del(url, auth(accessToken), { timeout: WRITE_TIMEOUT })
  } else {
    const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unreact/${encodeURIComponent(reactionName)}`
    return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
  }
}

export async function getReactions (instanceName, accessToken, statusId, apiVersion) {
  if (apiVersion.isPleroma) {
    const url = `${basename(instanceName)}/api/v1/pleroma/statuses/${statusId}/reactions`
    return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
  } else if (apiVersion.isFedibird) {
    const { emoji_reactions: emojiReactions } = await getStatus(instanceName, accessToken, statusId)
    const accountIds = Array.from(new Set(emojiReactions.map((reaction) => reaction.account_ids).flat()))
    const accounts = (await Promise.allSettled(accountIds.map(async (accountId) => [
      accountId,
      await getAccount(instanceName, accessToken, accountId)
    ]))).filter((result) => result.status === 'fulfilled').map(({ value }) => value)
    const idToAccount = Object.fromEntries(accounts)
    return emojiReactions.map((reaction) => {
      reaction.accounts = reaction.account_ids.map((accountId) => idToAccount[accountId]).filter(Boolean)
      delete reaction.account_ids
      return reaction
    })
  } else {
    throw new Error('Information about who reacted to a post is not available on this instance.')
  }
}

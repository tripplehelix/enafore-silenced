import { post, put, del, WRITE_TIMEOUT } from '../_utils/ajax.js'
import { basename, auth } from './utils.js'

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

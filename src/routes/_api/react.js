import { post, WRITE_TIMEOUT } from '../_utils/ajax.js'
import { basename, auth } from './utils.js'

export async function reactStatus (instanceName, accessToken, statusId, reactionName, apiVersion) {
  if (apiVersion.isPleroma) {} else {
    const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/react/${encodeURIComponent(reactionName)}`
    return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
  }
}

export async function unreactStatus (instanceName, accessToken, statusId, apiVersion) {
  if (apiVersion.isPleroma) {} else {
    const url = `${basename(instanceName)}/api/v1/statuses/${statusId}/unreact/${encodeURIComponent(reactionName)}`
    return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
  }
}

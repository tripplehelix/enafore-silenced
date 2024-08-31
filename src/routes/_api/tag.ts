import { get, post, WRITE_TIMEOUT, DEFAULT_TIMEOUT } from '../_utils/ajax.js'
import { auth, basename } from './utils.js'

export async function getTag(
  instanceName: string,
  accessToken: string,
  tag: string,
) {
  const url = `${basename(instanceName)}/api/v1/tags/${encodeURIComponent(tag)}`
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}

export async function followTag(
  instanceName: string,
  accessToken: string,
  tag: string,
) {
  const url = `${basename(instanceName)}/api/v1/tags/${encodeURIComponent(tag)}/follow`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

export async function unfollowTag(
  instanceName: string,
  accessToken: string,
  tag: string,
) {
  const url = `${basename(instanceName)}/api/v1/tags/${encodeURIComponent(tag)}/unfollow`
  return post(url, null, auth(accessToken), { timeout: WRITE_TIMEOUT })
}

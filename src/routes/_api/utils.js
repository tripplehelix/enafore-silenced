// @ts-check

/**
 * @param {string} instanceName
 */
function targetIsLocalhost (instanceName) {
  return instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:')
}

/**
 * @param {string} instanceName
 */
export function basename (instanceName) {
  if (targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}

/**
 * @param {string} accessToken
 */
export function auth (accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`
  }
}

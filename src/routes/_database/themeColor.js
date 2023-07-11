import { get, set } from '../_thirdparty/idb-keyval/idb-keyval.js'

export function setLastThemeColor (data) {
  return set('theme-color', data)
}

export function getLastThemeColor () {
  return get('theme-color')
}

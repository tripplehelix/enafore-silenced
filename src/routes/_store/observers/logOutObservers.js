import { onUserIsLoggedOut } from '../../_actions/onUserIsLoggedOut.js'

export function logOutObservers (store) {
  if (!process.env.BROWSER) {
    return
  }
  store.observe('isUserLoggedIn', isUserLoggedIn => {
    if (!isUserLoggedIn) {
      onUserIsLoggedOut()
    }
  })
}

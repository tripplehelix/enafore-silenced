const style = process.env.BROWSER && document.getElementById('theBottomNavStyle')

export function bottomNavObservers (store) {
  if (!process.env.BROWSER) {
    return
  }

  store.observe('bottomNav', bottomNav => {
    // disables or enables the style
    style.setAttribute('media', bottomNav ? 'all' : 'only x') // disable or enable the style
  }, { init: false }) // init: false because the inline script takes care of it
}

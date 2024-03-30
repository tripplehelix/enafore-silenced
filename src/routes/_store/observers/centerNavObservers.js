import { store } from '../store.js'

const centerNavStyle = process.env.BROWSER && document.getElementById('theCenterNavStyle')

export function centerNavObservers () {
  store.observe('centerNav', centerNav => {
    if (!process.env.BROWSER) {
      return
    }

    // disables or enables the style
    centerNavStyle.setAttribute('media', centerNav ? 'all' : 'only x')
  }, { init: false }) // init:false because the inline script takes care of it
}

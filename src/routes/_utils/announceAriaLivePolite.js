const ariaLiveElement = process.env.BROWSER && document.getElementById('theAriaLive')

export function announceAriaLivePolite (text) {
  ariaLiveElement.textContent = text
}

const growBigThenSmall = {
  properties: [
    { transform: 'scale(1)' },
    { transform: 'scale(2)' },
    { transform: 'scale(1)' }
  ],
  options: {
    duration: 333,
    easing: 'ease-in-out'
  }
}

const fadeColorToPressedState = {
  properties: [
    { fill: 'var(--action-button-fill-color)' },
    { fill: 'var(--action-button-fill-color-pressed)' }
  ],
  options: {
    duration: 333,
    easing: 'linear'
  }
}

export const FAVORITE_ANIMATION = [
  {
    properties: [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(180deg)' },
      { transform: 'rotate(360deg)' }
    ],
    options: {
      duration: 666,
      easing: 'ease-in-out'
    }
  },
  fadeColorToPressedState
]

export const FOLLOW_BUTTON_ANIMATION = [
  growBigThenSmall
]

export const CHECKMARK_ANIMATION = [
  fadeColorToPressedState
]


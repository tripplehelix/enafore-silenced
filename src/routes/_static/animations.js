export const FAVORITE_ANIMATION = [
  {
    properties: [
      { transform: 'scale(1) rotate(0deg)' },
      { transform: 'scale(0.75) rotate(80deg)' },
      { transform: 'scale(2) rotate(180deg)' },
      { transform: 'scale(0.75) rotate(280deg)' },
      { transform: 'scale(1) rotate(360deg)' }
    ],
    options: {
      duration: 666,
      easing: 'ease-in-out'
    }
  },
  {
    properties: [
      { fill: 'var(--action-button-fill-color)' },
      { fill: 'var(--action-button-fill-color-pressed)' }
    ],
    options: {
      duration: 333,
      easing: 'linear'
    }
  }
]

export const REBLOG_ANIMATION = [
  {
    properties: [
      { transform: 'scale(1)' },
      { transform: 'scale(2)' },
      { transform: 'scale(1)' }
    ],
    options: {
      duration: 333,
      easing: 'ease-in-out'
    }
  },
  {
    properties: [
      { fill: 'var(--action-button-fill-color)' },
      { fill: 'var(--action-button-fill-color-pressed)' }
    ],
    options: {
      duration: 333,
      easing: 'linear'
    }
  }
]

export const FOLLOW_BUTTON_ANIMATION = [
  {
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
]

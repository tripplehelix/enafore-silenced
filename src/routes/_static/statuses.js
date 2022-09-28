export const POST_PRIVACY_OPTIONS = [
  {
    label: 'intl.public',
    key: 'public',
    icon: '#fa-globe'
  },
  {
    label: 'intl.unlisted',
    key: 'unlisted',
    icon: '#fa-unlock'
  },
  {
    label: 'intl.followersOnly',
    key: 'private',
    icon: '#fa-lock'
  },
  {
    label: 'intl.direct',
    key: 'direct',
    icon: '#fa-envelope'
  }
]

export const KNOWN_CONTENT_TYPES = {
  default: {
    label: 'Default',
    icon: '#fa-file'
  },
  "text/plain": {
    label: 'Text',
    icon: '#fa-file-text'
  },
  "text/html": {
    label: 'HTML',
    icon: '#fa-code'
  },
  "text/markdown": {
    label: 'Markdown',
    icon: '#fa-arrow-circle-down'
  },
  "text/x.misskeymarkdown": {
    label: 'Markdown',
    icon: '#misskey-logo'
  }
}

export const LONG_POST_LENGTH = 1024
export const LONG_POST_TEXT = 'intl.longPost'

const INPUT_TAGS = new Set(['a', 'button', 'input', 'textarea', 'label', 'select'])
export const isUserInputElement = node => INPUT_TAGS.has(node.localName)

import { emit } from '../../../_utils/eventBus.ts'

export function close () {
  const { id } = this.get()
  emit('closeDialog', id)
}

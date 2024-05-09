import { emit } from '../../../_utils/eventBus.ts'

export function show () {
  const { id } = this.get()
  emit('showDialog', id)
}

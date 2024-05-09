import { createDialogElement } from '../helpers/createDialogElement.js'
import { createDialogId } from '../helpers/createDialogId.js'
import { on } from '../../../_utils/eventBus.ts'

export function showDialog (Dialog, data) {
  const id = createDialogId()
  const target = createDialogElement()
  data.id = id
  const dialog = new Dialog({
    target,
    data
  })
  on('destroyDialog', dialog, function (thisId) {
    if (id !== thisId) {
      return
    }
    target.remove()
    this.destroy()
  })
  dialog.show()
  return dialog
}

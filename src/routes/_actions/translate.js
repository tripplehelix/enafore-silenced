import { importGoogleTranslate } from '../_utils/asyncModules/importGoogleTranslate.js'
import { store } from '../_store/store.js'
async function translate(html, to, from) {
  return await (
    await importGoogleTranslate()
  )(html, to, from);
}
export function translateStatus(status, currentInstance) {
  const id = currentInstance + "-" + status.id;
  const { statusTranslations } = store.get();
  statusTranslations[id] = statusTranslations[id] || {}
  statusTranslations[id].show = true;
  if(!(statusTranslations[id].loading || statusTranslations[id].content)) {
    statusTranslations[id].loading = true
    translate(status.content, "en", "auto").then(content => {
      const { statusTranslations } = store.get();
      statusTranslations[id].loading = false
      statusTranslations[id].content = content
      this.store.set({ statusTranslations })
    }).catch(console.error)
  }
  this.store.set({ statusTranslations })
}
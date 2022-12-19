import { importGoogleTranslate } from '../_utils/asyncModules/importGoogleTranslate.js'
import { store } from '../_store/store.js'
import { massageUserText } from '../_utils/massageUserText.js'
async function translate(html, to, from) {
  return await (
    await importGoogleTranslate()
  )(html, to, from);
}
export function translateStatus(status, currentInstance) {
  const id = currentInstance + "-" + status.id;
  const { statusTranslations, statusTranslationContents, autoplayGifs } = store.get();
  statusTranslations[id] = statusTranslations[id] || {}
  statusTranslations[id].show = true;
  if(!(statusTranslations[id].loading || statusTranslationContents[id])) {
    statusTranslations[id].loading = true
    translate(massageUserText(status.content, status.emojis || [], autoplayGifs), "en", "auto").then(content => {
      const { statusTranslations, statusTranslationContents } = store.get();
      statusTranslations[id].loading = false
      statusTranslationContents[id] = content
      store.set({ statusTranslations, statusTranslationContents })
    }).catch((err) => {
      const { statusTranslations, statusTranslationContents } = store.get();
      statusTranslations[id].loading = false
      statusTranslations[id].error = true
      delete statusTranslationContents[id]
      store.set({ statusTranslations, statusTranslationContents })
    })
  }
  store.set({ statusTranslations })
}
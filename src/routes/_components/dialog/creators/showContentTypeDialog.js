import ContentTypeDialog from '../components/ContentTypeDialog.html'
import { showDialog } from './showDialog.js'

export default function showContentTypeDialog (realm) {
  return showDialog(ContentTypeDialog, {
    label: 'intl.contentType',
    title: 'intl.contentType',
    realm
  })
}

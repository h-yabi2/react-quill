import { Quill } from 'react-quill'
import { buildEmojiCpmonent } from './blots/custom-emoji-blot'
import './consts/picker-styles.scss'
import './consts/emoji-styles.scss'
// import { Picker } from 'emoji-mart'
// import EmojMartOptions from './consts/picker-options'

const Module = Quill.import('core/module')

class CustomEmoji extends Module {
  constructor(quill, options) {
    super(quill, options)

    this.quill = quill
    this.options = options

    // quillのblotは単純なものしか入れられないので、ここで再描画する
    // MEMO:文字装飾の中に絵文字を入れると、Deltaから再現表示する時に消えるので、ここで中身を入れ直しています
    quill.on('text-change', () => {
      const editorEl = quill.root
      const ems = editorEl.getElementsByTagName('em-emoji')
      for (let i = 0; i < ems.length; i++) {
        const em = ems[i]
        // em-emojiの中身が消えている場合、入れ直す
        if (em.innerHTML === '') {
          const parentElement = em.parentElement
          const dataSet = em.closest('.nodo-emoji').dataset
          if (parentElement !== null) {
            const emojiComponent = buildEmojiCpmonent({ ...dataSet })
            parentElement.removeChild(em)
            parentElement.appendChild(emojiComponent)
          }
        }
      }
    })
  }
}

Quill.register('modules/custom-emoji', CustomEmoji)

export default CustomEmoji

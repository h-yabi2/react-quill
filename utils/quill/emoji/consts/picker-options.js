
import data from '@emoji-mart/data/sets/14/google.json'

export const i18n = {
  search: '絵文字を検索する',
  search_no_results_1: '残念！',
  search_no_results_2: '絵文字は見つかりませんでした',
  pick: '絵文字を選択...',
  add_custom: '絵文字を追加する',
  categories: {
    activity: 'アクティビティ',
    custom: 'カスタム',
    flags: '旗',
    foods: 'フード＆ドリンク',
    frequent: 'よく使う絵文字',
    nature: '動物＆自然',
    objects: 'オブジェクト',
    people: 'スマイリー＆人',
    places: 'トラベル＆場所',
    search: '検索結果',
    symbols: '記号'
  },
  skins: {
    choose: 'デフォルトの肌の色を選択する',
    1: '標準',
    2: '明るい肌色',
    3: 'やや明るい肌色',
    4: '肌色',
    5: 'やや濃い肌色',
    6: '濃い肌色'
  }
}

const EmojMartOptions = {
  data,
  emojiVersion: 14,
  set: 'google',
  autoFocus: true,
  locale: 'ja',
  i18n,
  emojiButtonColors: [
    'rgba(155,223,88,.7)',
    'rgba(149,211,254,.7)',
    'rgba(247,233,34,.7)',
    'rgba(238,166,252,.7)',
    'rgba(255,213,143,.7)',
    'rgba(211,209,255,.7)'
  ],
  emojiButtonRadius: '12%',
  emojiButtonSize: 37
}

export default EmojMartOptions

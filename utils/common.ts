import { format, differenceInHours, differenceInMinutes } from 'date-fns'
import { useRouter } from 'next/router'

export const errorNavigate = (error?: any): void => {
  console.log(error)
  const router = useRouter()
  router.push('/error')
}

/**
 * ユニークなidを生成する.
 * @param strongLebel
 * @returns
 */
export const getUniqueStr = (strongLebel?: number): string => {
  let strong = 10
  if (strongLebel !== undefined) strong = strongLebel
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  )
}

/**
 * 現在時刻を返す.
 * @returns stirng
 */
export const getNowTime = (): string => {
  return dateFormat(new Date(), 'H時m分')
}

/**
 * 日付の成形.
 * @param d
 * @returns
 */
export const dateFormat = (d: Date, fmt: string = 'yyyy.MM.dd'): string => {
  return format(d, fmt)
}

/**
 * 現在時刻と比較して「n時間前」の文字列を生成.
 * @param d
 * @returns
 */
export const calcBeforeTime = (d: Date | number): string => {
  const dateTo = new Date()
  const dateFrom = d
  const dateDiff = differenceInHours(dateTo, dateFrom)
  const dateDiffMin = differenceInMinutes(dateTo, dateFrom)
  if (dateDiffMin < 0) {
    return '??分前'
  }
  // 1時間未満の時,m分前と表示
  if (dateDiffMin < 60) {
    return `${Math.floor(dateDiffMin)}分前`
  }
  // 24時間未満の時,HH時間前と表示
  if (dateDiff < 24) {
    return `${Math.floor(dateDiff)}時間前`
  }
  // 1週間以内の時,d日前と表示
  if (dateDiff < 24 * 8) {
    return `${Math.floor(dateDiff / 24)}日前`
  }
  // 8日以降の時,日付を表示
  return dateFormat(new Date(d))
}

export const isEmptyValue = (
  val: string | number | unknown[] | object | undefined | null
): boolean => {
  if (typeof val === 'undefined' || val === undefined || val === null) {
    return true
  }
  // 文字列に何も入ってない場合(空白文字は判定外)
  if (typeof val === 'string' && val === '') {
    return true
  }
  // 配列に何も入ってない場合
  if (Array.isArray(val) && val.length === 0) {
    return true
  }
  if (typeof val === 'object' && Object.keys(val).length === 0) {
    return true
  }
  return false
}

/**
 * 条件を満たさない場合または空(undefinedやnull)の場合、空文字を返す
 * @param text 条件を満たす場合に入れるテキスト
 * @param conditional 条件
 * @returns 空文字または第一引数に入ったテキスト
 */
export const empTxt = (
  text: string | undefined | null,
  conditional?: boolean
): string => {
  // textが未定義の場合空文字を返す
  if (text === undefined || text === null) {
    return ''
  }
  // 条件を満たさない場合は空文字を、そうでない場合はセットされた文字を返す
  return conditional === undefined || conditional ? text : ''
}

/**
 * ハッシュリンクの値を抽出する
 * @param hash urlに記載されたハッシュ
 * @returns ハッシュがない場合はundefined/ある場合は「#」を削った値
 */
export const getHashText = (hash: string): string | undefined => {
  // hashが未定義の場合undefined
  if (hash === '') {
    return undefined
  }
  if (hash.indexOf('#') === 0) {
    return hash.slice(1)
  }
  return hash
}

/**
 * 画像がundefinedの時はデフォルトユーザー画像を返す
 * @param img 画像パス
 * @returns imgがundefinedの時デフォルト画像を返す
 */
export const userImage = (img: string | undefined): string => {
  if (img === '' || img === undefined) {
    return `${process.env.REACT_APP_FRONTEND_URL ?? ''}/img/no-user-image.png`
  }
  return img
}

/**
 * フロントエンドでuuidを作成するロジックを作成
 */
export const generateRandomStringWithTimestamp = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let randomString = ''
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:T.]/g, '')
  return randomString + timestamp.slice(0, -1)
}

/**
 * フロントエンドでuuidを作成するロジックを作成
 */
export const getCurrentFormattedDate = (dateFormat = '/'): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${year}${dateFormat}${month}${dateFormat}${day} ${hours}:${minutes}:${seconds}`
}

/**
 * カタカナをひらがなに変換する関数
 * @param text
 */
export const katakanaToHiragana = (text: string): string => {
  return text.replace(/[\u30a1-\u30f6]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) - 0x60)
  })
}

/**
 * ひらがなをカタカナに変換する関数
 * @param text
 */
export const hiraganaToKatakana = (text: string): string => {
  return text.replace(/[\u3041-\u3096]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) + 0x60)
  })
}

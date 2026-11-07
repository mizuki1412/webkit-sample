/**
 * 汉字转拼音（基于 ./pinyin-map 映射表），供本地搜索的拼音匹配使用。
 * 自 service/search.js 下沉至此：utils 是最底层，不得反向依赖 service。
 */
import {mapToPinyin} from "./pinyin-map"

export function toPinyin(str) {
  const pinyinArr = []
  for (const letter of str) {
    pinyinArr.push(mapToPinyin(letter) || letter)
  }
  return pinyinArr.join("")
}

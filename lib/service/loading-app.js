import {Toast} from "vant"

export function useAppLoading(fn = function () {}) {
  return async function (...rest) {
    let t = Toast.loading({
      message: "加载中...",
      forbidClick: true,
    })
    try {
      await fn.apply(this, rest)
    } catch (e) {
      throw e
    } finally {
      t.clear()
    }
  }
}

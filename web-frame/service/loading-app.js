import {showLoadingToast, closeToast} from "vant"

export function useAppLoading(fn) {
  return async function (...rest) {
    showLoadingToast({
      message: "加载中...",
      forbidClick: true,
    })
    try {
      await fn.apply(this, rest)
    } catch (e) {
      throw e
    } finally {
      closeToast()
    }
  }
}

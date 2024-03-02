import {nextTick} from "vue";

export function useLoading(loadingValue, fn) {
  return async function (...rest) {
    loadingValue.value = true
    try {
      // 存在渲染慢导致loading效果没出来的情况
      await nextTick(async ()=>await fn.apply(this, rest))
    } catch (e) {
      throw e
    } finally {
      loadingValue.value = false
    }
  }
}

// modal.value.loading需要存在
export function useLoadingModal(modalValue, fn) {
  return async function (...rest) {
    modalValue.value.loading = true
    try {
      await fn.apply(this, rest)
    } catch (e) {
      throw e
    } finally {
      modalValue.value.loading = false
    }
  }
}

// object.loading
export function useLoadingObject(object, fn) {
  return async function (...rest) {
    object.loading = true
    try {
      await fn.apply(this, rest)
    } catch (e) {
      throw e
    } finally {
      object.loading = false
    }
  }
}

import {nextTick} from "vue";

export function useLoading(loadingValue, fn) {
  return async function (...rest) {
    loadingValue.value = true
    try {
      await nextTick()
      await fn.apply(this, rest)
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
    } finally {
      object.loading = false
    }
  }
}

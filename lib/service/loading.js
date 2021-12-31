
export function useLoading(loadingValue, fn) {
  // 环境变量不同
  // return useLoadingDirect(loadingValue.value, fn);
  return async function(...rest) {
    loadingValue.value = true;
    try {
      await fn.apply(this, rest);
    } catch (e) {
      throw e;
    } finally {
      loadingValue.value = false;
    }
  }
}

// modal.loading需要存在
export function useLoadingModal(modalValue, fn) {
  return async function(...rest) {
    modalValue.value.loading = true;
    try {
      await fn.apply(this, rest);
    } catch (e) {
      throw e;
    } finally {
      modalValue.value.loading = false;
    }
  }
}

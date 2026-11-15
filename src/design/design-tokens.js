/**
 * 运行时读取当前设计语言的 token 值（CSS 变量 → JS）。
 *
 * 供 echarts / 动态 style / 测试断言使用。单语言（Lumen）无切换，首次调用后缓存。
 */
const cache = {design: "", values: {}}

function readVars() {
  const style = getComputedStyle(document.documentElement)
  const values = {}
  for (const name of style) {
    if (name.startsWith("--color-") || name.startsWith("--chart-")) {
      values[name] = style.getPropertyValue(name).trim()
    }
  }
  return values
}

/**
 * 返回当前设计的 token 值表（--color-* / --chart-*）。
 * @param {string} [forDesign] 兼容参数：单语言下可传空，仅用于调用方建立缓存键。
 * @returns {Record<string, string>} 如 {'--color-accent': '#3A78F2', ...}
 */
export function designTokens(forDesign) {
  const design = forDesign || document.documentElement.dataset.design || ""
  if (cache.design !== design) {
    cache.design = design
    cache.values = readVars()
  }
  return cache.values
}

/** 便捷取色：designToken('--color-accent')。 */
export function designToken(name) {
  return designTokens()[name]
}

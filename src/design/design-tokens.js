/**
 * 运行时读取当前设计语言的 token 值（CSS 变量 → JS）。
 *
 * 供 echarts / 动态 style / 测试断言使用。值随 <html data-design> 即时变化，
 * 在 computed 里调用即可实现图表跟随设计切换。
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
 * 内部按 data-design 缓存，切换设计后自动重读。
 * @param {string} [forDesign] 显式传入设计 id（如 designId.value）可同时建立响应式依赖；
 *   传入时若与 DOM 上的 data-design 不一致（时序差），按传入 id 重读。
 * @returns {Record<string, string>} 如 {'--color-accent': '#005EFD', ...}
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

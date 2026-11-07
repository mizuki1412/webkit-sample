/**
 * 后端适配器注册表：核心层组件（如 user-center、kit-rich-text）经此取用
 * 登录/文件等后端能力，而不直接 import 具体适配器——依赖方向保持 核心 ← 适配器。
 *
 * 适配器在 setupWebkit({backend}) 装配时调 setBackend 注入；未装配即取用时
 * fail-loud 报错，提示装配入口。
 */

let currentBackend = null

/// setBackend: 注册当前后端适配器（setupWebkit 内部调用，业务代码无需手动调）
export function setBackend(backend) {
  currentBackend = backend
}

/// getBackend: 取当前后端适配器（未装配时抛错并指路）
export function getBackend() {
  if (!currentBackend) {
    throw new Error("[webkit] 后端适配器未装配：请先 setupWebkit(app, {backend}) （见web-frame/AGENTS.md）")
  }
  return currentBackend
}

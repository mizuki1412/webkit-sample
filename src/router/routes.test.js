import {readFileSync, existsSync} from "node:fs"
import path from "node:path"
import {describe, expect, it} from "vitest"
import {RouteName} from "/web-frame/router"

// keep-alive 约定回归测试：入签页面（带 menuTitle 的 component 路由）的组件名必须等于路由名，
// 否则 layout-admin 的 keep-alive include 匹配不上、标签页缓存静默失效（无任何报错，只能靠测试兜住）。
// 组件名来源：SFC 内 defineOptions({ name }) 声明，未声明时 vue 以文件名（去扩展名）推断。
const routerDir = path.resolve(process.cwd(), "src/router") // vitest 以工程根为 cwd
const routeSrc = readFileSync(path.join(routerDir, "index.js"), "utf8")

// 逐段解析路由对象：以 path: 开头分段，段内取 name（RouteName.xxx 或字面量）与 component import 路径
const segments = routeSrc.split(/(?=path:\s*")/)
const tabRoutes = []
for (const seg of segments) {
  const nameM = seg.match(/name:\s*(?:RouteName\.(\w+)|"([^"]+)")/)
  if (!nameM) continue
  const name = nameM[1] ? RouteName[nameM[1]] : nameM[2]
  const compM = seg.match(/import\("([^"]+)"\)/)
  const menuTitle = seg.match(/menuTitle:\s*"([^"]+)"/)
  if (!name || !compM || !menuTitle) continue
  tabRoutes.push({name, file: path.resolve(routerDir, compM[1])})
}

function componentName(file) {
  const src = readFileSync(file, "utf8")
  const declared = src.match(/defineOptions\(\{\s*name:\s*['"]([^'"]+)['"]/)
  if (declared) return declared[1]
  return path.basename(file, ".vue") // vue 对 script setup 的文件名推断
}

describe("路由约定：入签页面组件名 = 路由名（keep-alive include 匹配）", () => {
  it("路由表解析到入签页面（解析失败会静默漏检，先自证）", () => {
    expect(tabRoutes.length).toBeGreaterThanOrEqual(5)
  })

  it.each(tabRoutes.map(r => [r.name, r.file]))("%s", (name, file) => {
    expect(existsSync(file), `组件文件存在: ${file}`).toBe(true)
    expect(componentName(file)).toBe(name)
  })
})

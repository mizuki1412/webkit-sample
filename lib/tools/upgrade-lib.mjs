#!/usr/bin/env node
/**
 * webkit lib 升级脚本（随 lib 分发，老项目自带）。
 *
 * 用法（在老项目根目录执行）：
 *   node lib/tools/upgrade-lib.mjs                     # 从默认源（DEFAULT_SOURCE）拉最新 lib 覆盖
 *   node lib/tools/upgrade-lib.mjs --from <本地路径>    # 从本机 webkit-sample 检出目录升级（取其 lib/）
 *   node lib/tools/upgrade-lib.mjs --check             # 只对比版本与差异概览，不写入
 *   node lib/tools/upgrade-lib.mjs --yes               # 跳过"lib 有未提交改动"的确认
 *
 * 行为：镜像覆盖项目 lib/（新增/修改/删除全部对齐上游），VERSION 一并更新；
 * 覆盖后用 git diff lib/ 审查上游改了什么。业务项目不应改动 lib（要改请反哺
 * 上游仓库），否则覆盖会踩掉本地改动——脚本会在有未提交改动时要求确认。
 */
import {execFileSync} from "node:child_process"
import {existsSync, mkdirSync, readFileSync, rmSync} from "node:fs"
import {join, resolve} from "node:path"
import {tmpdir} from "node:os"

// lib 权威源：webkit-sample 仓库（lib/ 的上游）。若 lib 未来拆独立仓库，改这里即可。
const DEFAULT_SOURCE = "https://gitee.com/yingchaojie/webkit-sample.git"

const args = process.argv.slice(2)
const opt = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const hasFlag = (name) => args.includes(name)

const checkOnly = hasFlag("--check")
const assumeYes = hasFlag("--yes")
let from = opt("--from") || DEFAULT_SOURCE

const projectRoot = process.cwd()
const dstLib = join(projectRoot, "lib")
if (!existsSync(join(dstLib, "VERSION"))) {
  console.error("[upgrade-lib] 未找到 ./lib/VERSION——请在项目根目录执行本脚本")
  process.exit(1)
}

const readVersion = (dir) => {
  try {
    return readFileSync(join(dir, "VERSION"), "utf8").trim()
  } catch {
    return "(无 VERSION)"
  }
}

// —— 解析源：本地路径 or git url（sparse clone 只取 lib/） ——
let srcLib
let tmpClean
const isLocal = !/^[a-z]+:\/\//i.test(from) && !from.startsWith("git@")
if (isLocal) {
  srcLib = resolve(from, "lib")
  if (!existsSync(join(srcLib, "VERSION"))) {
    console.error(`[upgrade-lib] 源路径无效：${srcLib} 下没有 lib/VERSION`)
    process.exit(1)
  }
} else {
  const tmp = join(tmpdir(), `upgrade-lib-${Date.now()}`)
  mkdirSync(tmp, {recursive: true})
  tmpClean = tmp
  console.log(`[upgrade-lib] sparse clone ${from} ...`)
  const git = (a) => execFileSync("git", a, {cwd: tmp, stdio: ["ignore", "pipe", "inherit"], timeout: 120000})
  git(["clone", "--depth", "1", "--filter=blob:none", "--sparse", from, "."])
  git(["sparse-checkout", "set", "lib"])
  srcLib = join(tmp, "lib")
  if (!existsSync(join(srcLib, "VERSION"))) {
    console.error("[upgrade-lib] 源仓库里没有 lib/ 目录")
    process.exit(1)
  }
}

const srcVersion = readVersion(srcLib)
const dstVersion = readVersion(dstLib)
console.log(`[upgrade-lib] 版本：${dstVersion} → ${srcVersion}`)

// —— 保护：源版本比当前旧（多为上游未推送新提交），防误降级 ——
if (!checkOnly && srcVersion < dstVersion && !assumeYes) {
  console.warn(`[upgrade-lib] 警告：源版本（${srcVersion}）比当前（${dstVersion}）旧——上游仓库可能没有推送最新 lib。`)
  console.warn("[upgrade-lib] 确认降级请加 --yes；否则请先在上游仓库提交并推送 lib/ 的新版本。")
  if (tmpClean) rmSync(tmpClean, {recursive: true, force: true})
  process.exit(2)
}

if (srcVersion === dstVersion && checkOnly) {
  console.log("[upgrade-lib] 已是最新，无需升级")
} else if (checkOnly) {
  console.log("[upgrade-lib] 有新版本可用（--check 模式未写入）。去掉 --check 执行升级。")
}

// —— 保护：lib 有未提交改动时要求确认（避免踩掉本地修改） ——
let dirtyFiles = []
try {
  dirtyFiles = execFileSync("git", ["status", "--porcelain", "lib"], {cwd: projectRoot})
    .toString().split("\n").filter(Boolean)
} catch { /* 非 git 环境跳过保护 */ }
if (dirtyFiles.length > 0 && !checkOnly && !assumeYes) {
  console.warn(`[upgrade-lib] 警告：lib/ 下有 ${dirtyFiles.length} 个未提交改动，镜像覆盖将丢弃它们：`)
  for (const f of dirtyFiles.slice(0, 10)) console.warn("  " + f)
  console.warn("[upgrade-lib] 若这是你的本地定制，应先反哺上游仓库。确认覆盖请加 --yes")
  if (tmpClean) rmSync(tmpClean, {recursive: true, force: true})
  process.exit(2)
}

if (checkOnly) {
  if (tmpClean) rmSync(tmpClean, {recursive: true, force: true})
  process.exit(0)
}

// —— 镜像覆盖：Windows robocopy /MIR（能同步删除上游已移除的文件）；其他平台 rsync --delete ——
console.log("[upgrade-lib] 覆盖 lib/ ...")
if (process.platform === "win32") {
  try {
    execFileSync("robocopy", [srcLib, dstLib, "/MIR", "/NFL", "/NDL", "/NJH", "/NJS", "/NP"],
      {stdio: "ignore"})
  } catch (e) {
    // robocopy 退出码 0-7 均为成功（1=复制了文件，3=复制+删除等），>=8 才是失败；
    // execFileSync 对任何非零码都抛异常，须按 e.status 判别
    if (typeof e.status !== "number" || e.status >= 8) {
      console.error(`[upgrade-lib] robocopy 失败，退出码 ${e.status}`)
      process.exit(1)
    }
  }
} else {
  execFileSync("rsync", ["-a", "--delete", srcLib + "/", dstLib + "/"], {stdio: "inherit"})
}
if (tmpClean) rmSync(tmpClean, {recursive: true, force: true})

console.log(`[upgrade-lib] 完成：${dstVersion} → ${srcVersion}`)
console.log("[upgrade-lib] 下一步（人工/AI 审查上游变更并验证）：")
console.log("  git diff lib/           # 审查改了什么")
console.log("  npm run build && npm run test   # 若配置了质量命令则运行验证")

// help for vite.config.mjs

import {loadEnv} from "vite"

const envResolve = (mode) => {
  return loadEnv(mode, process.cwd())
}

// 获取env变量，todo 只能获取VITE_?
export const getEnv = function (env) {
  const argv = process.argv
  return envResolve(argv[argv.length - 1])[env]
}

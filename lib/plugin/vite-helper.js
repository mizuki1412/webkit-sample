// help for vite.config.mjs

import _ from "lodash"
import {loadEnv} from "vite"

const envResolve = (mode) => {
  return loadEnv(mode, process.cwd())
}

// 获取env变量，todo 只能获取VITE_?
export const getEnv = function (env) {
  return envResolve(_.last(process.argv))[env]
}

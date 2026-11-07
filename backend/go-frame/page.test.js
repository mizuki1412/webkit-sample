import {describe, expect, it} from "vitest"
import {parsePage} from "./page"

describe("parsePage（RestRet {data,total} → kit-pagination-page 约定）", () => {
  it("分页响应：total 来自后端，totalPage 按页大小推算", () => {
    const ret = {data: [1, 2, 3], total: 42}
    expect(parsePage(ret, 2, 10)).toEqual({
      data: [1, 2, 3],
      currentPage: 2,
      total: 42,
      totalPage: 5,
    })
  })

  it("整除时 totalPage 不多出一页", () => {
    expect(parsePage({data: Array.from({length: 20}), total: 20}, 1, 10).totalPage).toBe(2)
  })

  it("total 缺省（不分页接口）回退 data.length", () => {
    const r = parsePage({data: [1, 2, 3]}, 1)
    expect(r.total).toBe(3)
    expect(r.totalPage).toBe(1)
  })

  it("空响应防御：data/total 均缺省", () => {
    expect(parsePage(undefined, 1, 10)).toEqual({
      data: [],
      currentPage: 1,
      total: 0,
      totalPage: 1,
    })
  })

  it("currentPage 缺省回退 1", () => {
    expect(parsePage({data: [], total: 0}).currentPage).toBe(1)
  })
})

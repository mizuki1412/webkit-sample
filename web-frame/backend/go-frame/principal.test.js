import {describe, expect, it} from "vitest"
import {matchPrivilege, userHasPrivilege} from "./principal"

describe("matchPrivilege（与后端 tokenkit matchPrivilege 对齐）", () => {
  it("完全相等命中", () => {
    expect(matchPrivilege("user:admin", "user:admin")).toBe(true)
  })

  it("* 覆盖一切", () => {
    expect(matchPrivilege("*", "user:admin")).toBe(true)
    expect(matchPrivilege("*", "anything:at:all")).toBe(true)
  })

  it("末段通配命中任意深度", () => {
    expect(matchPrivilege("user:*", "user:add")).toBe(true)
    expect(matchPrivilege("user:*", "user:admin:list")).toBe(true)
  })

  it("末段通配不命中其他前缀", () => {
    expect(matchPrivilege("user:*", "role:manage")).toBe(false)
  })

  it("中间段通配要求总段数相同", () => {
    expect(matchPrivilege("*:add", "user:add")).toBe(true)
    expect(matchPrivilege("*:add", "a:b:add")).toBe(false)
  })

  it("普通权限码不命中其他码", () => {
    expect(matchPrivilege("user:admin", "user:session")).toBe(false)
    expect(matchPrivilege("user:admin", "user")).toBe(false)
  })
})

describe("userHasPrivilege（多角色并集 − exclude）", () => {
  const user = {
    roles: [
      {id: 1, privileges: ["user:admin", "role:*"]},
      {id: 2, privileges: ["department:manage"]},
    ],
    extend: {},
  }

  it("任一角色命中即通过（OR）", () => {
    expect(userHasPrivilege(user, "user:admin")).toBe(true)
    expect(userHasPrivilege(user, "department:manage")).toBe(true)
  })

  it("角色通配权限生效", () => {
    expect(userHasPrivilege(user, "role:manage")).toBe(true)
  })

  it("未授予则拒绝", () => {
    expect(userHasPrivilege(user, "common:file")).toBe(false)
  })

  it("extend.privilegeExclude 剔除优先", () => {
    const excluded = {...user, extend: {privilegeExclude: ["user:admin"]}}
    expect(userHasPrivilege(excluded, "user:admin")).toBe(false)
    // 其余权限不受影响
    expect(userHasPrivilege(excluded, "role:manage")).toBe(true)
  })

  it("exclude * 剔除全部", () => {
    const all = {...user, extend: {privilegeExclude: ["*"]}}
    expect(userHasPrivilege(all, "user:admin")).toBe(false)
    expect(userHasPrivilege(all, "department:manage")).toBe(false)
  })

  it("防御：无 user / 无 roles / 空 perm 恒 false", () => {
    expect(userHasPrivilege(null, "user:admin")).toBe(false)
    expect(userHasPrivilege({}, "user:admin")).toBe(false)
    expect(userHasPrivilege(user, "")).toBe(false)
  })
})

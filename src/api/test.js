import {request, upload} from "/web-frame/request"

// 业务 api 示范层（实体 CRUD 模式 + 每端点具名函数）：
//   1. 与 go-frame 生成端点一一对应：/xxx/list|get|create|update|del；
//   2. 查询类 GET + showMsg:false（查询失败不弹错，页面自行兜底），写操作 POST 默认 showMsg；
//   3. request 返回 axios response，信封在 `.data`：const ret = (await apiX()).data 再读 ret.data/ret.total；
//   4. ⚠️ 数组参数：go-frame 适配器已配置 arrayFormat:"repeat"（重复键可被 []string 绑定），
//      复杂结构/保险起见仍可显式 JSON——{headers: {"Content-Type": "application/json"}}。

// ---------- 实体 CRUD 五件套（按实体名套用，避免每个实体复制一遍） ----------

export function apiList(entity, params) {
  return request(`/${entity}/list`, params, {method: "get", showMsg: false})
}

export function apiGet(entity, id) {
  return request(`/${entity}/get`, {id}, {method: "get", showMsg: false})
}

export function apiCreate(entity, obj) {
  return request(`/${entity}/create`, obj)
}

export function apiUpdate(entity, obj) {
  return request(`/${entity}/update`, obj)
}

// ids 传数组或单个 id；保险写法仍显式 JSON（form 数组经适配器 repeat 后亦可被 go-frame 绑定）
export function apiDel(entity, ids) {
  return request(`/${entity}/del`, {ids: Array.isArray(ids) ? ids : [ids]},
      {headers: {"Content-Type": "application/json"}})
}

// ---------- 示例端点 ----------

// 附件上传（multipart 走 upload 包装）
export function apiUploadFile(file, title) {
  return upload("/common/upload", {file, title: title || "", public: true})
}

// 用户简表（下拉数据源；登录即可用）
export function apiUserSimpleList(params) {
  return request("/user/simpleList", params, {method: "get", showMsg: false})
}

// 多选 id 全量提交（示范数组参数的 JSON 写法，与后端 []string 对应）
export function apiSetMembers(id, userIds) {
  return request("/member/setUsers", {id, user_ids: userIds || []},
      {showMsg: false, headers: {"Content-Type": "application/json"}})
}

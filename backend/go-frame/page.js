/// 分页响应解析：把后端 RestRet（{data, total}）映射为
/// kit-pagination-page 的 pageServerHandle 约定返回值
/// （{data, currentPage, total, totalPage}）。
///
/// 用法（服务端分页页面）：
///   const pageHandle = async (page, pageSize) => {
///     return parsePage(await postUserAdminList({pageNum: page, pageSize}), page)
///   }
///
/// @param ret 后端响应 RestRet（result 已判 0）
/// @param currentPage 当前页码（后端不回传，用请求时的值）
/// @param pageSize 每页条数，用于推算 totalPage；不传则按 total===data.length 视为不分页
export function parsePage(ret, currentPage, pageSize) {
  const data = ret?.data ?? []
  const total = Number(ret?.total ?? data.length)
  let totalPage = 1
  if (pageSize && pageSize > 0) {
    totalPage = Math.max(1, Math.ceil(total / pageSize))
  } else {
    totalPage = 1
  }
  return {data, currentPage: currentPage ?? 1, total, totalPage}
}

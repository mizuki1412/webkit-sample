/**
 * 返回一个延迟给定时间resolve的Promise对象，用于使当前异步函数休眠
 * @param duration 持续时间（毫秒）
 */
export function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

// 获取url query中的值，无则返回''
export function getUrlQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substring(1).match(reg); // 获取url中"?"符后的字符串并正则匹配
  let context = "";
  if (r != null)
    context = decodeURIComponent(r[2]);
  reg = null;
  r = null;
  return context == null || context === "" || context === "undefined" ? "" : context;
}

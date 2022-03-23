/**
 * 返回一个延迟给定时间resolve的Promise对象，用于使当前异步函数休眠
 * @param duration 持续时间（毫秒）
 */
export function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

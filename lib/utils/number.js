/**
 * 截取给定位数的数字, 不足则左补0
 * @param num 需要截取的数字
 * @param n 截取的长度
 */
export function leftFill0(num, n = 2) {
  return (new Array(n).join('0') + num).slice(-n);
}

/** m进制的num 转为n进制的  */
export function hexTransfer(num, m, n) {
  return parseInt(num, m).toString(n);
}

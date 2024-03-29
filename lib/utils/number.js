
/** m进制的num 转为n进制的  */
export function hexTransfer(num, m, n) {
  return parseInt(num, m).toString(n)
}

export function rand(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min, 10)
}

// 倒计时 val.value
export function countDown(val, initValue, time) {
  val.value = initValue
  let fun = () =>
    setTimeout(function () {
      if (val.value > 0) {
        val.value--
        fun()
      }
    }, time)
  fun()
}

// 用于规范percent的值
export function percent(a,b){
  if(b===0) return 0
  if(a/b>1) return 100
  return parseFloat(((a / b) * 100).toFixed(2))
}

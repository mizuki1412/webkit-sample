// time.value, finish:async function
export function clockStart(time, finish) {
  let f = function () {
    setTimeout(async function () {
      if (time.value <= 0 || isNaN(time.value)) {
        await finish()
      } else {
        time.value--
        f()
      }
    }, 1000)
  }
  f()
}

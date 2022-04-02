/**
 * 生成随机的长度为35的字符串id
 */
export function generateID() {
  let ID = ""
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      const random = Math.random()
      const char = charset[floor(random * charset.length)]
      ID += char
    }
    if (i !== 3) {
      ID += "-"
    }
  }
  return ID
}

export function generateUUID() {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now() // use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

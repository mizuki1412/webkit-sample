import dayjs from "dayjs"

export function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (dayjs.isDayjs(obj)) return obj.clone()
  if (obj instanceof Array) return obj.map(item => cloneDeep(item))
  if (obj instanceof Object) {
    const clonedObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = cloneDeep(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}
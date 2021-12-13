
export function isUndefined(v) {
  return typeof v === 'undefined';
}
export function isNull(v) {
  return typeof v === 'object' && !v;
}
export function isString(v) {
  return typeof v === 'string';
}
export function isNumber(v) {
  return typeof v === 'number';
}
export function isFunction(v) {
  return typeof v === 'function';
}
export function isPlainObject(v) {
  return typeof v === 'object' && v;
}
export const isArray = Array.isArray;

/** 判断这个值没有  */
export function isNil(v) {
  return v === undefined || v === null || v === '';
}

export function isDate(v) {
  return v instanceof Date && !isNaN(v.getTime());
}

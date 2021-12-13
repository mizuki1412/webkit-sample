/**
 * 深拷贝一个普通的js对象，采用非递归形式避免栈溢出
 * @param obj 源对象
 */
import {isArray, isPlainObject, isUndefined} from "./is";

export function deepClone(obj) {
  const copy = isArray(obj) ? [] : {};
  const stack = [{
    copy,
    target: obj,
  }];
  const copiedRefs = [];
  const { set, ownKeys, getOwnPropertyDescriptor } = Reflect;
  while (stack.length) {
    const { target, copy } = stack.pop();
    const keys = ownKeys(target);
    for (const key of keys) {
      const desc = getOwnPropertyDescriptor(target, key);
      if (desc && !desc.enumerable) {
        continue;
      }
      const val = target[key];
      if (val && typeof val === 'object') {
        const copied = copiedRefs.find(copied => copied.target === val);
        if (copied) {
          set(copy, key, copied.copy);
          continue;
        }
        const copyVal = isArray(val) ? [] : {};
        set(copy, key, copyVal);
        stack.push({
          target: val,
          copy: copyVal,
        });
      } else {
        set(copy, key, val);
      }
    }
    copiedRefs.push({
      target,
      copy,
    });
  }
  return copy;
}

/**
 * 将两个对象合并，嵌套对象会被展开合并
 * @param source target 会被合并到 source
 * @param target
 */
export const deepMerge = (source, target) => {
  for (const [key, val] of Object.entries(target)) {
    source[key] = isPlainObject(source[key]) && isPlainObject(val) ? deepMerge(source[key], target[key]) : target[key];
  }
  return source;
};

/**
 * 返回一个延迟给定时间resolve的Promise对象，用于使当前异步函数休眠
 * @param duration 持续时间（毫秒）
 */
export function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}


import {
  isObject,
  isArray,
  isInteger,
  hasOwn,
  hasChanged
} from './../shared/index'
import { reactive } from './reactive'
function createGetter() {
  return function get(target, key, receiver) {
    const ret = Reflect.get(target, key, receiver)

    if (isObject(ret)) {
      return reactive(ret)
    }

    return ret
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const oldValue = target[key]
    // 数组新增、对象新增
    const hadKey =
      isArray(target) && isInteger(key)
        ? Number(key) < target.length
        : hasOwn(target, key)

    const ret = Reflect.set(target, key, value, receiver)

    if (!hadKey) {
      console.log('新增')
    } else if (hasChanged(value, oldValue)) {
      console.log('修改属性')
    }

    return ret
  }
}

const get = createGetter()
const set = createSetter()

export const mutableHandlers = {
  get,
  set
}

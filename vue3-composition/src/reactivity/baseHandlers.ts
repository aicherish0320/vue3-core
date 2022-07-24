import {
  isObject,
  isArray,
  isInteger,
  hasOwn,
  hasChanged
} from './../shared/index'
import { track, trigger } from './effect'
import { reactive } from './reactive'
function createGetter() {
  return function get(target, key, receiver) {
    console.log('key >>> ', key)

    const ret = Reflect.get(target, key, receiver)
    track(target, key)

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
      trigger(target, 'add', key, value)
    } else if (hasChanged(value, oldValue)) {
      trigger(target, 'set', key, value, oldValue)
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

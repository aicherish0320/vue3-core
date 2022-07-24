import { mutableHandlers } from './baseHandlers'
import { isObject } from './../shared/index'

export function reactive(target: object) {
  // 核心的操作就是当读取数据时进行依赖收集，修改数据的时候让effect重新执行
  return createReactiveObject(target, mutableHandlers)
}

const proxyMap = new WeakMap()
function createReactiveObject(target: object, baseHandlers) {
  if (!isObject(target)) return target

  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  return proxy
}

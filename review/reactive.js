const baseHandlers = {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const ret = Reflect.set(target, key, value, receiver)
    trigger(target, key, value)
    return ret
  }
}

const reactive = (target) => {
  return new Proxy(target, baseHandlers)
}

let activeEffect = null
const effect = (fn) => {
  const effect = createReactiveEffect(fn)
  effect()
}

const createReactiveEffect = (fn) => {
  const effect = () => {
    activeEffect = effect
    return fn()
  }

  return effect
}

const targetMap = new WeakMap()

const track = (target, key) => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect)
  }
}
const trigger = (target, key, value) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  if (effects) {
    effects.forEach((effect) => effect())
  }
}

export const isObject = (val) => typeof val === 'object' && val !== null
export const isSymbol = (val) => typeof val === 'symbol'
export const isArray = (val) => Array.isArray(val)
export const isInteger = (key) => parseInt(key, 10) + '' === key
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val, key) => hasOwnProperty.call(val, key)
export const hasChanged = (value, oldValue) => value !== oldValue
export const isString = (val) => typeof val === 'string'
export const isFunction = (val) => typeof val === 'function'

export * from './shapeFlags'

/*
  ts 基本数据类型
*/

let str: string = 'Hello'
let num: number = 123
let bool: boolean = true
let nul: null = null
let und: undefined = undefined
let sym: symbol = Symbol()

enum USER_ROLE {
  USER,
  MANAGER
}

// console.log(str, num, bool, nul, und, sym)
console.log(USER_ROLE.USER)

export {}

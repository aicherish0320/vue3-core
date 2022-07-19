// 泛型，用来在代码执行时传入的类型，来确定结果

const swap = <T, K>(tup: [T, K]): [K, T] => {
  return [tup[1], tup[0]]
}

swap([1, 'hello'])

export {}

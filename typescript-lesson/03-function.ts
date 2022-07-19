function add(a: number, b: number): number {
  return a + b
}

type SumType = (a: number, b: number) => number

interface ISum {
  (a: number, b: number): number
}

const sum: SumType = (a: number, b: number) => a + b
const sum1: ISum = (a: number, b: number) => a + b

export {}

interface ISchool {
  name: string
  age: number
}

const school: ISchool = {
  name: '毛家小学',
  age: 20
}

interface ISc extends ISchool {
  type: string
  [key: string]: any
}

const sc: ISc = {
  name: 'sc',
  age: 21,
  type: '前端'
}

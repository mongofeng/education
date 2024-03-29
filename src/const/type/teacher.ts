import * as enums from '../enum'
export interface ITeacher {
  readonly _id?: string
  name: string
  birthday: string
  sex: enums.ESEX
  age: number
  phone: string
  province: string
  city: string
  region: string
  address: string
  status: enums.TEACHER_STATUS
  openId: string
  id: string
  desc: string
  createDate?: string
  updateDate?: string
}

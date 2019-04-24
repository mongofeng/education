import * as enums from '../enum'
export interface IStudent {
  _id: string
  name: string
  birthday: string
  sex: enums.ESEX
  age: number
  contacts: string
  phone: string
  province: string
  city: string
  region: string
  address: string
  openId?: string
  teacherId?: string
  status: enums.STUDENT_STATUS
  desc: string
  createDate?: string
  updateDate?: string
}


export interface IStudentStatics {
  readonly _id: string
  students: Array<{
    teacherId: string;
    name: string,
    id: string
  }>
  count: number
}


export interface IStudentStaticsStatus {
  readonly _id: string
  count: number
}

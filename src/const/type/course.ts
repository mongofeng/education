import * as enums from '../enum'
export interface ICourse {
  readonly _id?: string
  name: string
  teacherId: string
  studentIds: string[]
  status: enums.COURSE_STATUS
  desc: string
  day: enums.WEEK[] // 一周
  time: enums.DAY
  startDate: number
  endDate: number
  createDate?: string
  updateDate?: string
  endTime?: string
  startTime?: string
}

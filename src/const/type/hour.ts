import * as enums from '../enum'

export interface IHour {
  readonly _id?: string
  num: number
  name?: string
  courseId?: string
  studentId: string
  teacherId?: string
  amount: number
  type: enums.COURSE_HOUR_ACTION_TYPE // 添加减少
  classTypes?: enums.COURSE_HOUR_TYPE // 购买
  status?: enums.COURSE_HOUR_STATUS // 通过，拒绝
  desc?: string
  createDate?: string
  updateDate?: string
}

import * as enums from '../enum'
import  {ICourse} from  './student-operation'

export interface IHour {
  readonly _id?: string
  num: number  // 课时的数量
  course: ICourse[] // 课程,补签或者签到时候存在[{courseId, count}]
  packageId?: string // 课程包id
  studentPackageId?: string // 学员课程包id
  studentId: string // 学员的id
  type: enums.COURSE_HOUR_ACTION_TYPE // 类型：添加/补签/签到 1/2/3
  desc?: string
  createDate?: string
  updateDate?: string
}

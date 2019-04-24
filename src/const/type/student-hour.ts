
export interface IStudentHour {
  readonly _id?: string
  num: number // 课时的数量
  used: number // 已用的课时
  amount: number // 学费
  studentId: string // 学员的id
  createDate?: string
  updateDate?: string
}

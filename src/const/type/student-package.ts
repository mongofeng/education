export interface IStudentPackage {
  readonly _id?: string
  studentIds: string[] // 学生
  packageId: string // 课程包id
  activeTime: string // 激活时间
  endTime: string // 结束时间
  amount: number // 价格
  count: number // 总数量
  surplus: number // 剩余课时
  used: number // 使用课时
  isActive: boolean // 是否激活
  beOverdue: boolean // // 是否过时
  isPush: boolean // 是否推送过期的通知
}

export interface IPackage {
  readonly _id?: string
  name: string  // 名字
  count: number // 数量
  desc: string // 描述
  amount: number // 价格
  period: number // 有效期
  status: number
  createDate?: string
  updateDate?: string
}
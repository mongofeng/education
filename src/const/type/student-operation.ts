export interface IBuy {
  packageId: string
  studentId: string
  desc?: string
}

export interface ICourse {
  id: string
  count: number
  name: string
}

export interface ISign {
  studentId: string
  course: ICourse[]
  num: number
  desc?: string
  courseName: string
}

export type ISupplement = Omit<ISign, 'courseName'>


export interface ISharePackage {
  packId: string
  studentId: string
}


export interface IActivatePackage {
  activeTime: string
  endTime: string
  packageId: string
  studentId: string
  wechat: boolean
  id: string
}

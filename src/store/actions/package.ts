import {IPackage} from '../../const/type/package'
/**
 * 课程
 */
export const FETCH_PACKAGE_REQUSET_ING: string = 'FETCH_PACKAGE_REQUSET_ING' // 请求数据中
export const FETCH_PACKAGE_STATUS: string = 'FETCH_PACKAGE_STATUS'
export const FETCH_PACKAGE_END: string = 'FETCH_PACKAGE_END' // 请求数据中


// 请求中
export const Loading = (loading: boolean) => ({
  type: FETCH_PACKAGE_STATUS,
  loading
})


// 课程请求
export const FetchList = (params: QueryCondition<IPackage>) => ({
  type: FETCH_PACKAGE_REQUSET_ING,
  params
})


// 课程成功还是失败
export const listResult = (data: IPackage[], count: number) => ({
  type: FETCH_PACKAGE_END,
  data,
  count
})

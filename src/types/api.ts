import { AxiosPromise } from 'axios'

export interface IResponse<T = any> {
  data: T
  code: string	// 	String	成功、错误码
  msg: string	// 	String	对于返回值的详细说明
  status: string	// 	String	状态码
  responseTime: string	// 	String	响应时间
}

/**
 * 通用的API返回头
 */
export type ApiResponse<T = any> = AxiosPromise<IResponse<T>>

/**
 * 通用列表数据接口
 */
export type ApiListData<T> = ApiResponse<{
  list: T[]; // 列表
  count: number; // 数量
}>

/**
 * 获取列表的函数
 */
export type IApiList<T> = (params: any) => ApiListData<T>

// The parameters `x` and `y` have the type number
// const myAdd: (baseValue: number, increment: number) => number 
// = (x, y) => x + y;

/**
 * 更新表单的函数
 */
export type UpdateFunc<P> = 
(id: string, params: P) => ApiResponse<any>

export type AddFunc<P> = 
(params: P) => ApiResponse<any>

export type FormFun<P> = UpdateFunc<P> | AddFunc<P>


/**
 * 获取详情
 */
export type DetailFun<P> = (id: string) => ApiResponse<P>
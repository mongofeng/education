import {IUser} from '../../const/type/user'
export const FETCH_USER: string = 'FETCH_USER'
export const FETCH_USER_EDN: string = 'FETCH_USER_EDN'
/**
 * 请求
 */
export const FetchUser = () => ({
    type: FETCH_USER,
})

/**
 * 请求结束
 * @param data 用户数据
 */
export const FetchUserEnd = (data: IUser) => ({
    type: FETCH_USER_EDN,
    data
})

export type IFetchUsertype = ReturnType<typeof FetchUserEnd>
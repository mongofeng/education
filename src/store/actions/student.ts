/**
 * 登录
 */
export const FETCH_STUDENT_REQUSET_ING: string = 'FETCH_STUDENT_REQUSET_ING' // 请求数据中
export const FETCH_STUDENT_STATUS: string = 'FETCH_STUDENT_STATUS'
export const FETCH_STUDENT_END: string = 'FETCH_STUDENT_END' // 请求数据中


// 请求中
export const Loading = (loading: boolean) => ({
    type: FETCH_STUDENT_STATUS,
    loading
})


// 登录请求
export const FetchList = (params: any) => ({
    type: FETCH_STUDENT_REQUSET_ING,
    params
})


// 登录成功还是失败
export const listResult = (data: any[], count: number) => ({
    type: FETCH_STUDENT_END,
    data,
    count
})
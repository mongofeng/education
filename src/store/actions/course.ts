import {ICourse} from '../../const/type/course'
/**
 * 课程
 */
export const FETCH_COURSE_REQUSET_ING: string = 'FETCH_COURSE_REQUSET_ING' // 请求数据中
export const FETCH_COURSE_STATUS: string = 'FETCH_COURSE_STATUS'
export const FETCH_COURSE_END: string = 'FETCH_COURSE_END' // 请求数据中


// 请求中
export const Loading = (loading: boolean) => ({
    type: FETCH_COURSE_STATUS,
    loading
})


// 课程请求
export const FetchList = (params: QueryCondition<ICourse>) => ({
    type: FETCH_COURSE_REQUSET_ING,
    params
})


// 课程成功还是失败
export const listResult = (data: ICourse[], count: number) => ({
    type: FETCH_COURSE_END,
    data,
    count
})
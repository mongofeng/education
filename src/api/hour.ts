import {IHour} from '../const/type/hour'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'

interface IResult {
    templateMsg: {
        errcode: number
    }
    student_hour: {
        n: number
        nModified: number
        ok: number
    }
}


/**
 * 添加课程
 * @param {*} params
 */
export function addHour(params: IHour): ApiResponse<IResult> {
    return http.post('course-hour-flow', params)
}

/**
 *
 * @param params 查询参数
 */
export function getHourrList(params: QueryCondition<IHour>): ApiListData<IHour> {
    return http.post('course-hour-flow/list', params)
}

/**
 *
 * @param id 课程的id
 */
export function getHour(id: string): ApiResponse<IHour> {
    return http.get(`course-hour-flow/${id}`)
}

import {IHour} from '../const/type/hour'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'




/**
 * 添加课程
 * @param {*} params
 */
export function addHour(params: IHour) {
    return http.post('class-hour', params)
}

/**
 * 
 * @param params 查询参数
 */
export function getHourrList(params: QueryCondition<IHour>): ApiListData<IHour> {
    return http.post('class-hour/list', params)
}

/**
 * 
 * @param id 课程的id
 */
export function getHour(id: string): ApiResponse<IHour> {
    return http.get(`class-hour/${id}`)
}

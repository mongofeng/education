import {IStudentHour} from '../const/type/student-hour'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'


/**
 * 
 * @param params 查询参数
 */
export function getStudentHourrList(params: QueryCondition<IStudentHour>): ApiListData<IStudentHour> {
    return http.post('student-hour/list', params)
}

/**
 * 
 * @param id 课时的id
 */
export function getStudentHour(id: string): ApiResponse<IStudentHour> {
    return http.get(`student-hour/${id}`)
}

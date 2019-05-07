import { IStudentStatics, IStudentStaticsStatus} from '../const/type/student'
import {  ApiResponse } from '../types/api'
import http from '../utils/http'
/**
 * 获取每月学生的增长
 * @param params 
 */
export function stuCountByTime (params: QueryCondition<IStudentStatics>): ApiResponse<IStudentStatics[]> {
  return http.post(`statistics/stuCountByTime`, params)
}

/**
 * 学生毕业和在读的统计
 * @param params 
 */
export function stuCountByStatus (params?: QueryCondition<IStudentStatics>): ApiResponse<IStudentStaticsStatus[]> {
  return http.post(`statistics/stuCountByStatus`, params)
}
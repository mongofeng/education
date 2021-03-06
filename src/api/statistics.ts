import { IStuCountByStatus, IStuCountByTime} from '../const/type/student'

import { ICaculatePackage, IStudentPackage } from '../const/type/student-package';
import {  ApiResponse } from '../types/api'
import http from '../utils/http'
/**
 * 获取每月学生的增长
 * @param params 
 */
export function stuCountByTime (params: QueryCondition<IStuCountByTime>): ApiResponse<IStuCountByTime[]> {
  return http.post(`statistics/stuCountByTime`, params)
}

/**
 * 学生毕业和在读的统计
 * @param params 
 */
export function stuCountByStatus (params?: QueryCondition<IStuCountByTime>): ApiResponse<IStuCountByStatus[]> {
  return http.post(`statistics/stuCountByStatus`, params)
}

/**
 * 学生毕业和在读的统计
 * @param params 
 */
export function caculatePackage (params?: QueryCondition<IStudentPackage>): ApiResponse<ICaculatePackage[]> {
  return http.post(`statistics/caculatePackage`, params)
}
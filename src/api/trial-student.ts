import {TrialStudent} from '@/const/type/trial-student'
import { ApiListData, ApiResponse } from '@/types/api'
import http from '@/utils/http'
/**
 * 添加课程包
 * @param {*} params
 */
export function addTrialStudent(params: TrialStudent) {
  return http.post('trial-student', params)
}

/**
*
* @param params 查询参数
*/
export function gettrialCclassRecordList(params: TrialStudent): ApiListData<TrialStudent> {
  return http.post('trial-student/list', params)
}

/**
*
* @param id 课程包的id
*/
export function getTrialStudent(id: string): ApiResponse<TrialStudent> {
  return http.get(`trial-student/${id}`)
}
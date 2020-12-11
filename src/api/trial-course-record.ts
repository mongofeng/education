import {TrialCourseRecord} from '@/const/type/trial-course-record'
import { ApiListData, ApiResponse } from '@/types/api'
import http from '@/utils/http'
/**
 * 添加课程包
 * @param {*} params
 */
export function addTrialCourseRecord(params: TrialCourseRecord) {
  return http.post('trial-course-record', params)
}

/**
*
* @param params 查询参数
*/
export function gettrialCclassRecordList(params: TrialCourseRecord): ApiListData<TrialCourseRecord> {
  return http.post('trial-course-record/list', params)
}

/**
*
* @param id 课程包的id
*/
export function getTrialCourseRecord(id: string): ApiResponse<TrialCourseRecord> {
  return http.get(`trial-course-record/${id}`)
}
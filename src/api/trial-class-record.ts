import {TrialClassRecord} from '@/const/type/trial-class-record'
import { ApiListData, ApiResponse } from '@/types/api'
import http from '@/utils/http'
/**
 * 添加课程包
 * @param {*} params
 */
export function addtrialClassRecord(params: TrialClassRecord) {
  return http.post('trial-class-record', params)
}

/**
*
* @param params 查询参数
*/
export function gettrialCclassRecordList(params: TrialClassRecord): ApiListData<TrialClassRecord> {
  return http.post('trial-class-record/list', params)
}

/**
*
* @param id 课程包的id
*/
export function gettrialClassRecord(id: string): ApiResponse<TrialClassRecord> {
  return http.get(`trial-class-record/${id}`)
}
import {TrialStudentPackage} from '@/const/type/trial-student-package'
import { ApiListData, ApiResponse } from '@/types/api'
import http from '@/utils/http'
/**
 * 添加课程包
 * @param {*} params
 */
export function addTrialStudentPackage(params: TrialStudentPackage) {
  return http.post('trial-student-package', params)
}

/**
*
* @param params 查询参数
*/
export function getTrialStudentPackageList(params:QueryCondition< TrialStudentPackage>): ApiListData<TrialStudentPackage> {
  return http.post('trial-student-package/list', params)
}

/**
*
* @param id 课程包的id
*/
export function getTrialStudentPackage(id: string): ApiResponse<TrialStudentPackage> {
  return http.get(`trial-student-package/${id}`)
}
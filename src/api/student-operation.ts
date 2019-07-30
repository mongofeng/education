import * as type from '../const/type/student-operation'
import http from '../utils/http'




/**
 * 购买学员课程包
 * @param {*} params
 */
export function buyStudentPackage (params: type.IBuy) {
    return http.post('student-operation/buy', params)
}

/**
 * 签到
 * @param params 查询参数
 */
export function sign(params: type.ISign) {
    return http.post('student-operation/sign', params)
}


/**
 * 补签到
 * @param params 查询参数
 */
export function supplement(params: type.ISupplement) {
  return http.post('student-operation/supplement', params)
}


/**
 * 关联另一学员的课程包
 * @param params 查询参数
 */
export function iSharePackage(params: type.ISharePackage) {
  return http.post('student-operation/share-package', params)
}


/**
 * 激活课程包
 * @param params 查询参数
 */
export function activatePackage(params: type.IActivatePackage) {
  return http.post('student-operation/activate-package', params)
}



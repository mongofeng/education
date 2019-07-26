import {IStudentPackage} from '../const/type/student-package'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'




/**
 * 添加学员课程包
 * @param {*} params
 */
export function addStudentPackage(params: IStudentPackage) {
    return http.post('student-package', params)
}

/**
 *
 * @param params 查询参数
 */
export function getStudentPackageList(params: any): ApiListData<IStudentPackage> {
    return http.post('student-package/list', params)
}

/**
 *
 * @param id 学员课程包的id
 */
export function getPackage(id: string): ApiResponse<IStudentPackage> {
    return http.get(`student-package/${id}`)
}

/**
 *
 * @param id 学员课程包id
 * @param params
 */
export function updateStudentPackage(id: string, params: Partial<IStudentPackage>): ApiResponse<IStudentPackage> {
    return http.put(`student-package/${id}`, params)
}


export function delStudentPackage(id: string): ApiResponse<IStudentPackage> {
    return http.delete(`student-package/${id}`)
}

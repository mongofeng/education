import {IPackage} from '../const/type/package'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'




/**
 * 添加课程包
 * @param {*} params
 */
export function addPackage(params: IPackage) {
    return http.post('package', params)
}

/**
 *
 * @param params 查询参数
 */
export function getPackageList(params: IPackage): ApiListData<IPackage> {
    return http.post('package/list', params)
}

/**
 *
 * @param id 课程包的id
 */
export function getPackage(id: string): ApiResponse<IPackage> {
    return http.get(`package/${id}`)
}

/**
 *
 * @param id 课程包id
 * @param params
 */
export function updatePackage(id: string, params: Partial<IPackage>): ApiResponse<IPackage> {
    return http.put(`package/${id}`, params)
}


export function delPackage(id: string): ApiResponse<IPackage> {
    return http.delete(`package/${id}`)
}

import { IAdminWechat } from "@/const/type/admin-wechat"
import { ApiListData, ApiResponse } from "@/types/api"
import http from "@/utils/http"

/**
 * 添加学生
 * @param {*} params
 */
export function addAdminWechat(params: IAdminWechat) {
  return http.post('admin-wechat', params)
}

/**
*
* @param params 查询参数
*/
export function getAdminWechatList(params: any): ApiListData<IAdminWechat> {
  return http.post('admin-wechat/list', params)
}

/**
*
* @param id 学生的id
*/
export function getAdminWechat(id: string): ApiResponse<IAdminWechat> {
  return http.get(`admin-wechat/${id}`)
}

/**
*
* @param id 学生id
* @param params
*/
export function updateAdminWechat(id: string, params: Partial<IAdminWechat>): ApiResponse<IAdminWechat> {
  return http.put(`admin-wechat/${id}`, params)
}


export function delAdminWechat(id: string): ApiResponse<IAdminWechat> {
  return http.delete(`admin-wechat/${id}`)
}
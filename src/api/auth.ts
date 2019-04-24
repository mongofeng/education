import { IUser } from '../const/type/user'
import { ApiResponse } from '../types/api'
import http from '../utils/http'

export function login (params: any) {
  return http({
    url: 'auth/login',
    method: 'post',
    data: params
  })
}

/**
 * 注册
 * @param {*} params
 */
export function register (params: any) {
  return http.post('auth/register', params)
}


/**
 * 获取用户的信息
 */
export function getUserInfo (): ApiResponse<IUser> {
  return http.get('user/userInfo')
}

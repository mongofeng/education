import { AxiosPromise } from 'axios';
import * as type from '../const/type/wechat';
import {wechat as http} from '../utils/http'

/**
 * 获取openId
 * @param params
 */
export function fetchOpenId(params: type.ICode): AxiosPromise<type.IOpenId> {
  return http.post('openid', params);
}

export function fetchUserInfo(params: type.IInfo): AxiosPromise<type.IUserInfo> {
  return http.post('userInfo', params);
}

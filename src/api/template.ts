import {AxiosPromise} from 'axios'
import * as type from '../const/type/template'
import http from '../utils/http'


const baseUrl = process.env.REACT_APP_API_WECHAT

/**
 * 发送微信的推送
 * @param {*} params
 */
export function sendTemplate (params: any){
    return http.post(`${baseUrl}template`, params)
}

/**
 * 
 */
export function getTemplateList(): AxiosPromise<{
  template_list: type.ITemplate[]
}>  {
    return http.get(`${baseUrl}template/list`)
}
import {AxiosPromise} from 'axios'
import * as type from '../const/type/template'
import {wechat as http} from '../utils/http'



/**
 * 发送微信的推送
 * @param {*} params
 */
export function sendTemplate (params: any){
    return http.post(`template`, params)
}

/**
 * 
 */
export function getTemplateList(): AxiosPromise<{
  template_list: type.ITemplate[]
}>  {
    return http.get(`template/list`)
}
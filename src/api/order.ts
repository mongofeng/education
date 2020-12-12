import {Order} from '@/const/type/order'
import { ApiListData, ApiResponse } from '@/types/api'
import http from '@/utils/http'
/**
 * 添加课程包
 * @param {*} params
 */
export function addOrder(params: Order) {
  return http.post('order', params)
}

/**
*
* @param params 查询参数
*/
export function getOrderList(params: Order): ApiListData<Order> {
  return http.post('order/list', params)
}

/**
*
* @param id 课程包的id
*/
export function getOrder(id: string): ApiResponse<Order> {
  return http.get(`order/${id}`)
}
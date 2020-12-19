import {ITeacher} from '../const/type/teacher'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'




/**
 * 添加学生
 * @param {*} params
 */
export function addteacher(params: ITeacher) {
    return http.post('teacher', params)
}

/**
 * 
 * @param params 查询参数
 */
export function getteacherList(params: QueryCondition<ITeacher>): ApiListData<Required<ITeacher>> {
    return http.post('teacher/list', params)
}

/**
 * 
 * @param params 查询参数
 */
export function bindWechat (params: Partial<ITeacher>) {
    return http.post('teacher/bind-wechat', params)
}



/**
 * 
 * @param id 学生的id
 */
export function getteacher(id: string): ApiResponse<ITeacher> {
    return http.get(`teacher/${id}`)
}

/**
 * 
 * @param id 学生id
 * @param params 
 */
export function updateteacher(id: string, params: ITeacher): ApiResponse<ITeacher> {
    return http.put(`teacher/${id}`, params)
}


export function delteacher(id: string): ApiResponse<ITeacher> {
    return http.delete(`teacher/${id}`)
}

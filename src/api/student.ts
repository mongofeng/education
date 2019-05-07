import {IStudent} from '../const/type/student'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'




/**
 * 添加学生
 * @param {*} params
 */
export function addStudent(params: IStudent) {
    return http.post('student/add', params)
}

/**
 * 
 * @param params 查询参数
 */
export function getStudentList(params: IStudent): ApiListData<IStudent> {
    return http.post('student/list', params)
}

/**
 * 
 * @param id 学生的id
 */
export function getStudent(id: string): ApiResponse<IStudent> {
    return http.get(`student/${id}`)
}

/**
 * 
 * @param id 学生id
 * @param params 
 */
export function updateStudent(id: string, params: IStudent): ApiResponse<IStudent> {
    return http.put(`student/${id}`, params)
}


export function delStudent(id: string): ApiResponse<IStudent> {
    return http.delete(`student/${id}`)
}

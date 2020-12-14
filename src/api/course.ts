import {ICourse} from '../const/type/course'
import { ApiListData, ApiResponse } from '../types/api'
import http from '../utils/http'




/**
 * 添加课程
 * @param {*} params
 */
export function addCourse(params: ICourse) {
    return http.post('course', params)
}

/**
 * 
 * @param params 查询参数
 */
export function getCourserList(params: QueryCondition<ICourse>): ApiListData<ICourse> {
    return http.post('course/list', params)
}

/**
 * 
 * @param id 课程的id
 */
export function getCourse(id: string): ApiResponse<ICourse> {
    return http.get(`course/${id}`)
}

/**
 * 
 * @param id 课程id
 * @param params 
 */
export function updateCourse(id: string, params: ICourse): ApiResponse<ICourse> {
    return http.put(`course/${id}`, params)
}


export function delCourse(id: string): ApiResponse<ICourse> {
    return http.delete(`course/${id}`)
}


/**
 * 
 * @param params id: 学生的id， courseIds： 课程的id
 */
export function delCourseByStudent (params: {
    id: string,
    courseIds: string[]
}) {
    return http.post(`course/deleteStudent`, params)
}


/**
 * 
 * @param params id: 学生的id， courseIds： 课程的id
 */
export function batchCourse (params: {
    id: string,
    courseIds: string[]
}) {
    return http.post(`course/batchCourse`, params)
}




/**
 * 批量添加学生到课程
 * @param params ids: 学生的id集合， id： 课程的id
 */
export function batchCourseByStudent (id, params: {
    ids: string[]
}) {
    return http.post(`/course/batchCourse/${id}`, params)
}




/**
 * 批量添加试课学生到课程
 * @param params ids: 学生的id集合， id： 课程的id
 */
export function batchTrialStudentToCourse (id, params: {
    ids: string[]
}) {
    return http.post(`/course/batch-trail-student-to-course/${id}`, params)
}


/**
 * 批量删除课程下的学生
 * @param params ids: 学生的id集合， id： 课程的id
 */
export function delAllCourseStudent (id, params: {
    ids: string[]
}) {
    return http.post(`/course/delAllCourseStudent/${id}`, params)
}



/**
 * 批量删除课程下的学生
 * @param params ids: 学生的id集合， id： 课程的id
 */
export function delTrailStudentFromCourse (id, params: {
    ids: string[]
}) {
    return http.post(`/course/del-trail-student/${id}`, params)
}


/**
 * 批量更改状态
 * @param params ids: 学生的id集合
 */
export function batchStatusByCourse (params: {
    status: number
    ids: string[]
}) {
    return http.post(`/course/batchStatusByCourse`, params)
}






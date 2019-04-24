
import * as courseAction from '../actions/course'

const courseStatus = {
  loading: false,
  data: [],
  total: 0
}

/**
 * 课程
 * @param state 
 * @param action 
 */
function courseModel (state = courseStatus, action: any) {
  switch (action.type) {
    case courseAction.FETCH_COURSE_STATUS:
      return {
        ...state,
        loading: action.loading
      }
    case courseAction.FETCH_COURSE_END:
      return {
        ...state,
        data: action.data,
        total: action.count
      }
    default:
      return state
  }
}


export default courseModel
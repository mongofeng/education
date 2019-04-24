
import * as studentAction from '../actions/student'

const studentStatus = {
  loading: false,
  data: [],
  total: 0
}

/**
 * 登录
 * @param state 
 * @param action 
 */
function studentModel (state = studentStatus, action: any) {
  switch (action.type) {
    case studentAction.FETCH_STUDENT_STATUS:
      return {
        ...state,
        loading: action.loading
      }
    case studentAction.FETCH_STUDENT_END:
      return {
        ...state,
        data: action.data,
        total: action.count
      }
    default:
      return state
  }
}


export default studentModel
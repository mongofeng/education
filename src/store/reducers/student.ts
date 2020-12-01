
import { IStudent } from '../../const/type/student'
import * as studentAction from '../actions/student'

const studentStatus = {
  loading: false,
  data: [],
  total: 0,
  labels: {},
  openIds: new Map<string, string[]>()
}

/**
 * 登录
 * @param state
 * @param action
 */
function studentModel (state = studentStatus, action: {
  type: string;
  data: IStudent[];
  loading: boolean;
  count: number;
}) {
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
        total: action.count,
        openIds: new Map(action.data.map(item => {
          return [item._id, item.openId]
        })),
        labels: action.data.reduce((initVal, item) => {
          return {
            ...initVal,
            [item._id]: item.name
          }
        }, {})
      }
    default:
      return state
  }
}


export default studentModel

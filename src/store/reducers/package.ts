
import * as actions from '../actions/package'

const initState = {
  loading: false,
  data: [],
  total: 0,
  labels: {}
}

/**
 * 课程
 * @param state
 * @param action
 */
export default function reducer (state = initState, action: any) {
  switch (action.type) {
    case actions.FETCH_PACKAGE_STATUS:
      return {
        ...state,
        loading: action.loading
      }
    case actions.FETCH_PACKAGE_END:
      return {
        ...state,
        data: action.data,
        total: action.count,
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


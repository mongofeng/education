import { combineReducers } from 'redux'
import * as authAction from '../actions/auth'
const loginStatus = {
  loading: false,
  isSuccess: false
}

/**
 * 登录
 * @param state 
 * @param action 
 */
function loginModel (state = loginStatus, action: any) {
  switch (action.type) {
    case authAction.LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case authAction.LOGIN_STATUS:
      return {
        ...state,
        isSuccess: action.isSuccess
      }
    default:
      return state
  }
}

/**
 * 注册state
 * @param state 
 */

const registerStatus = {
  loading: false,
  data: {},
  isSuccess: false
}

function registerModel (state = registerStatus, action: any) {
  switch (action.type) {
    case authAction.LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case authAction.REGISTER_STATUS:
      return {
        ...state,
        isSuccess: action.params.isSuccess,
        data: action.params.data
      }
    default:
      return state
  }
}

export default combineReducers({
  loginModel,
  registerModel
})
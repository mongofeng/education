
import {IUser} from '../../const/type/user'
import * as userAction from '../actions/user'



const user: IUser | null = null

/**
 * 登录
 * @param state 
 * @param action 
 */
function userStateModel (state = user, action: userAction.IFetchUsertype) {
  switch (action.type) {
    case userAction.FETCH_USER_EDN:
      return action.data
    default:
      return state
  }
}


export default userStateModel
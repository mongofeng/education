
import * as locationAction from '../actions/lbs'



const location: any[] = []

/**
 * 登录
 * @param state 
 * @param action 
 */
function locationStateModel (state = location, action: locationAction.IfetchListtype) {
  switch (action.type) {
    case locationAction.FETCH_LOCATION_EDN:
      return action.data
    default:
      return state
  }
}


export default locationStateModel
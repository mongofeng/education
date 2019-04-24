import { combineReducers } from 'redux'
import auth from './auth'
import course from './course'
import lbs from './lbs'
import student from './student'
import user from './user'

export default combineReducers({
  auth,
  student,
  lbs,
  user,
  course
})



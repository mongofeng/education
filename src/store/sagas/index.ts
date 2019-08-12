import { all, fork } from 'redux-saga/effects'
// import * as authSaga from './auth'
// export default function* root() {
//   yield all([fork(authSaga.watchLoginAction), fork(authSaga.watchRegisterAction)])
// }
import authSaga from './auth'
import courseSaga from './course'
import lbsSaga from './lbs'
import studentSaga from './student'
import userSaga from './user'
import  packageSaga from './package'
export default function* root() {
  yield all([
    fork(authSaga),
    fork(studentSaga),
    fork(lbsSaga),
    fork(courseSaga),
    fork(userSaga),
    fork(packageSaga)
  ])
}

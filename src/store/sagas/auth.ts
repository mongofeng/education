import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import * as api from '../../api/auth'
import history from '../../utils/histroy'
import * as AuthAction from '../actions/auth'


export function* Login (action: any) {
  try {
    yield put(AuthAction.Loading(true)) // 登录中
    const {data: {data: {token}}} = yield call(api.login, action.params)
    window.localStorage.setItem('Authorization', token)
    yield put(AuthAction.LoginStatus(true))
    history.push('/base')
  } catch (error) {
    yield put(AuthAction.LoginStatus(false))
  }
  yield put(AuthAction.Loading(false)) // 登录中
}

export function* watchLoginAction() {
  /*
    监听登录的action，触发login事件
  */
  yield takeLatest(AuthAction.LOGIN_REQUSET_ING, Login)
}


export function* Register (action: any) {
  try {
    yield put(AuthAction.Loading(true)) // 登录中
    const {data: {data}} = yield call(api.register, action.params)
    yield put(AuthAction.RegisterStatus(data, true))
  } catch (error) {
    yield put(AuthAction.RegisterStatus({}, false))
  }
  yield put(AuthAction.Loading(false)) // 登录中
}

export function* watchRegisterAction() {
  /*
    监听登录的action，触发login事件
  */
  yield takeLatest(AuthAction.REGISTER_REQUSET_ING, Register)
}



export default function* rootSaga() {
  // action的名字和参数
  yield all([fork(watchLoginAction), fork(watchRegisterAction)])
}

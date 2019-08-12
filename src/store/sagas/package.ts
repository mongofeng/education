
import { call, put, takeLatest } from 'redux-saga/effects'
import * as api from '../../api/package'
import * as actions from '../actions/package'
export function* getList(action: any) {
  try {
    yield put(actions.Loading(true)) // 请求中
    const {data: {data: {list, count}}} = yield call(api.getPackageList, action.params)
    yield put(actions.listResult(list, count))
  } finally  {
    yield put(actions.Loading(false)) // 请求中
  }

}

export function* watchListAction() {
  /*
    监听请求的action，触发getList事件
  */
  yield takeLatest(actions.FETCH_PACKAGE_REQUSET_ING, getList)
}


export default watchListAction

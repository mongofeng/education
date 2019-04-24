
import { call, put, select, takeLatest } from 'redux-saga/effects'
import * as api from '../../api/auth'
import * as actions from '../actions/user'

export function* getUser() {
    try {
        const state = yield select()
        if (state.user) { return }
        const {data: {data}} = yield call(api.getUserInfo)
        yield put(actions.FetchUserEnd(data))
    } catch (error) {
        console.log(error)
    }
}

export function* watchAction() {
    /*
      监听请求的action，触发getUser事件
    */
    yield takeLatest(actions.FETCH_USER, getUser)
}


export default watchAction

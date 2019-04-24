
import { call, put, select, takeLatest } from 'redux-saga/effects'
import * as api from '../../api/lbs'
import * as actions from '../actions/lbs'

export function* getList() {
    try {
        const state = yield select()
        if (state.lbs.length) { return }
        const data = yield call(api.fetchLocalDistricts)
        yield put(actions.FetchListEnd(data))
    } catch (error) {
        console.log(error)
    }
}

export function* watchListAction() {
    /*
      监听请求的action，触发getList事件
    */
    yield takeLatest(actions.FETCH_LOCATION, getList)
}


export default watchListAction

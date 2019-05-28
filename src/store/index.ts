import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers';
import rootSaga from './sagas'

// 1、创建 store
const sagaMiddleware = createSagaMiddleware()
let store: any = null
if (process.env.NODE_ENV === 'development') {
  store = createStore(reducer, composeWithDevTools(
    applyMiddleware(
      sagaMiddleware
    )
  ));
} else {
  store = createStore(reducer, applyMiddleware(sagaMiddleware))
}


sagaMiddleware.run(rootSaga)

export default store
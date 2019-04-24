import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers';
import rootSaga from './sagas'

// 1、创建 store
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(
    sagaMiddleware
  )
));
sagaMiddleware.run(rootSaga)

export default store
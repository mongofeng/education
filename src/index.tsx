
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store'

ReactDOM.render(
  // 2、然后使用react-redux的Provider将props与容器连通起来
  <Provider store={ store }>
      <App />
  </Provider> ,
  document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// ttps://juejin.im/post/5c81d10b5188257ee7275222
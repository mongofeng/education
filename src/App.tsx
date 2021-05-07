
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import './asset/scss/main.scss';
import routes from './router';
import store from './store'

import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
const moment = require('moment');
moment.locale('zh-cn');


class App extends React.PureComponent {
  public render() {
    return (
      // 2、然后使用react-redux的Provider将props与容器连通起来
    <Provider store={store}>
      <ConfigProvider locale={zh_CN}>
        <HashRouter basename="app-common">
          <div className="primary-layout">
            {renderRoutes(routes)}
          </div>

        </HashRouter>
      </ConfigProvider>
      </Provider>
    );
  }
}


export default App

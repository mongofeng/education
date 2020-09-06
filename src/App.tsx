
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import * as React from 'react';
import './asset/scss/main.scss';
import { renderRoutes } from 'react-router-config';
import routes from './router';


import { HashRouter } from "react-router-dom";
const moment = require('moment');
moment.locale('zh-cn');





class App extends React.PureComponent {
  public render() {
    return (
      <ConfigProvider locale={zh_CN}>
        <HashRouter>
          <div className="primary-layout">
            {renderRoutes(routes)}
          </div>

        </HashRouter>
      </ConfigProvider>

    );
  }
}


export default App

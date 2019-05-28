
import { LocaleProvider, Spin } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import * as React from 'react';
import './asset/scss/main.scss';
const BaseLayout = React.lazy(() => import(/* webpackChunkName: 'BaseLayout'*/ './layout/BaseLayout'));
const User = React.lazy(() => import(/* webpackChunkName: 'User'*/ './layout/UserLayout'));
const moment = require('moment');




import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

moment.locale('zh-cn');

const PrimaryLayout = () => (
  <LocaleProvider locale={zh_CN}>
    <div className="primary-layout">
    <React.Suspense
      fallback={<Spin />}>
        <Switch>
          <Route path="/auth" component={User} />
          <Route path="/base" component={BaseLayout} />
          <Redirect to="/auth" />
        </Switch>
      </React.Suspense>
    </div>
  </LocaleProvider>
)



class App extends React.PureComponent {
  public render() {
    return (
      <HashRouter>
        <PrimaryLayout />
      </HashRouter>
    );
  }
}


export default App

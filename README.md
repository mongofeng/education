# education

## 路由

### react-router-dom方式
```tsx

import * as React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import Detail from './Detail'
import Form from './Form'
import List from './List'
import Comment from './page/comment/comment'


class Student extends React.PureComponent<RouteComponentProps> {
    render () {
        return (<Switch>
        <Route path={`${this.props.match.path}/list`}  component={List} />
        <Route path={`${this.props.match.path}/add`}  component={Form} />
        <Route path={`${this.props.match.path}/detail/:id`}  component={Detail} />
        <Route path={`${this.props.match.path}/edit/:id`}  component={Form} />
        <Route path={`${this.props.match.path}/comment/:id/:courseId`}  component={Comment} />
        <Redirect to={`${this.props.match.path}/list`} />
      </Switch>)
    }
}

export default Student
```


### react-router-config对路由进行配置

```tsx
// 为了使路由生效，必须在App中导入路由配置
const routes = [{
  path: '/',
  exact: true,
  render: () => < Redirect to={"/auth/login"} />,
},
{
  path: '/auth',
  component: SuspenseComponent(User),
  routes: [
    {
      path: "/auth/register",
      component: SuspenseComponent(Register),
    },
    {
      path: "/auth/login",
      component: SuspenseComponent(LoginPage),
    }
  ]
},]


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


// 由于renderRoutes 方法只会渲染第一层路由，现在的App是第一层，要想在Main组件中也生效，那么只需要在Main等其他的子组件中再次调用renderRoutes。
// renderRoutes 接受的是数组

const Layout = ({ route }) => (<> {renderRoutes(route.routes)} </>)
```

### 路由懒加载
使用React.lazy和Suspense组合实现路由懒加载进行优化，以提高首屏加载速度，当我们使用某个组件时，需要一个Suspense来包裹。而React.lazy接受一个函数作为参数，表明我们是动态引入了某个组件

```tsx
const SuspenseComponent = (Component: React.FC | any) => props => {
  return (
    <Suspense fallback={<Spin></Spin>}>
      <Component {...props} > </Component>
    </Suspense>
  )
}
```

### Compiles and minifies for production
```
npm run build
```


### docker
```
# 安装docker和docker-compose
cd docker

docker-compose up -d

```
### 关于环境变量
```
除了一些内置变量（NODE_ENV和PUBLIC_URL）之外，变量名必须从REACT_APP_工作开始
```
## 参考文档
- [5858快到家 React+hooks+redux项目实战](https://juejin.im/post/6865495375382806535)
- [react + typescript 集成mobx和设置别名alias最新解决方案](https://blog.csdn.net/chrislincp/article/details/97312235)
- [一次react-router + react-transition-group实现转场动画的探索](https://juejin.im/post/6844903818073899022)

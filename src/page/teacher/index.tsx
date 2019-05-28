import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Detail from './Detail'
import Form from './Form'
import List from "./List";

interface IRoutes {
  path: string;
  component: any;
  routes?: IRoutes[];
}

const routes: IRoutes[] = [
  {
    path: "/list",
    component: List
  },
  {
    path: "/add",
    component: Form
  },
  {
    path: "/detail/:id",
    component: Detail
  },
  {
    path: "/edit/:id",
    component: Form
  }
];

export default function(rootProps: RouteComponentProps) {
  return (
    <TransitionGroup>
      <CSSTransition
        key={rootProps.location.pathname}
        classNames="page"
        exit={false}
        unmountOnExit={true}
        timeout={300}>
          <Switch>
            {routes.map(route => (
              <Route
                path={`${rootProps.match.path}${route.path}`}
                key={route.path}
                render={(props: RouteComponentProps) => <route.component {...props} />}
              />
            ))}

            {/* 不匹配的时候，默认跳转第一个路由 */}
            <Redirect to={`${rootProps.match.path}${routes[0].path}`} />
          </Switch>
      </CSSTransition>
    </TransitionGroup>
    
  );
}

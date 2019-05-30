import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {IRoutes} from '../../const/type/view'
import List from "./List";

const routes: IRoutes[] = [
  {
    path: "/list",
    component: List
  }
];

export default function(rootProps: RouteComponentProps) {
  return (
    <TransitionGroup>
      <CSSTransition key={rootProps.match.url} classNames="page" timeout={300}>
        <Switch>
          {routes.map(route => (
            <Route
              path={`${rootProps.match.path}${route.path}`}
              key={route.path}
              component={route.component}
            />
          ))}

          {/* 不匹配的时候，默认跳转第一个路由 */}
          <Redirect to={`${rootProps.match.path}${routes[0].path}`} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}

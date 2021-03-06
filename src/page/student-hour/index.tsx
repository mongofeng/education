import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
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

];

export default function(rootProps: RouteComponentProps) {
  return (
    <Switch>
      {routes.map(route => (
        <Route
          path={`${rootProps.match.path}${route.path}`}
          key={route.path}
          render={(props: RouteComponentProps) => {
            return (
              <CSSTransition
                in={true}
                timeout={30000}
                classNames="page"
                appear={true}
                onEnter={() => {
                  console.log("enter中");
                }}
                unmountOnExit={true}
              >
                {/* 把子路由的props都传过去 */}
                <route.component {...props} />
              </CSSTransition>
            );
          }}
        />
      ))}

      {/* 不匹配的时候，默认跳转第一个路由 */}
      <Redirect to={`${rootProps.match.path}${routes[0].path}`} />
    </Switch>
  );
}

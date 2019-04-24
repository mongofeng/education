import * as React from "react";
import { Link, Route, RouteComponentProps } from "react-router-dom";

interface IRoutes {
  path: string;
  name: string;
  component: (props: IComponentProps) => JSX.Element;
  routes?: IRoutes[];
}

interface IComponentProps extends RouteComponentProps {
  routes?: IRoutes[];
}

// route的配置
const routes: IRoutes[] = [
  {
    path: "/sandwiches",
    name: "sandwiches",
    component: () => <h2>Sandwiches</h2>
  },
  {
    path: "/tacos",
    name: "tacos",
    component: Tacos,
    routes: [
      {
        path: "/bus",
        name: "Bus",
        component: () => <h3>Bus</h3>
      },
      {
        path: "/cart",
        name: "Cart",
        component: () => <h3>Cart</h3>
      }
    ]
  }
];

function Tacos(props: IComponentProps) {
  return (
    <div>
      <h2>Tacos</h2>
      <ul>
        {props.routes &&
          props.routes.map((route, i) => {
            return (
              <Link key={i} to={`${props.match.url}${route.path}`}>
                {route.name}
              </Link>
            );
          })}
      </ul>

      {props.routes &&
        props.routes.map((route, i) => {
          const { path, ...reset } = route;
          return (
            <RouteWithSubRoutes
              key={i}
              {...reset}
              path={`${props.match.url}${path}`}
            />
          );
        })}
    </div>
  );
}

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
function RouteWithSubRoutes(route: IRoutes) {
  return (
    <Route
      path={route.path}
      render={(props: RouteComponentProps) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

function RouteConfig(props: RouteComponentProps) {
  return (
    <div>
      <ul>
        {routes &&
          routes.map((route, i) => {
            return (
              <li key={i}>
                <Link to={`${props.match.url}${route.path}`}>{route.name}</Link>
              </li>
            );
          })}
      </ul>

      {routes.map((route, i) => {
        const { path, ...reset } = route;
        return (
          <RouteWithSubRoutes
            key={i}
            {...reset}
            path={`${props.match.url}${path}`}
          />
        );
      })}
    </div>
  );
}

export default RouteConfig;

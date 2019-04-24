import * as React from "react";
import { NavLink, Route, RouteComponentProps } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquet,
        purus vitae eleifend tristique, lorem magna volutpat orci, et vehicula
        erat erat nec elit. Aenean posuere nunc ac cursus facilisis. Aenean vel
        porta turpis, ut iaculis justo.
      </p>
    </div>
  )
}

function Contact() {
  return (
    <div>
      <h1>Contact</h1>
      <p>
        Aliquam iaculis a nisi sed ornare. Sed venenatis tellus vel consequat
        congue. In bibendum vestibulum orci et feugiat.
      </p>
    </div>
  )
}

function About() {
  return (
    <div>
      <h1>About</h1>
      <p>
        Donec sit amet augue at enim sollicitudin porta. Praesent finibus ex
        velit, quis faucibus libero congue et. Quisque convallis eu nisl et
        congue. Vivamus eget augue quis ante malesuada ullamcorper. Sed orci
        nulla, eleifend eget dui faucibus, facilisis aliquet ante. Suspendisse
        sollicitudin nibh lacus, ut bibendum risus elementum a.
      </p>
    </div>
  )
}


const routes = [
  { path: '', name: 'Home', Component: Home },
  { path: '/about', name: 'About', Component: About },
  { path: '/contact', name: 'Contact', Component: Contact },
]


class Detail extends React.PureComponent<RouteComponentProps> {

  render() {
    return (
      <div>
        {routes.map(route => (
          <NavLink
            key={route.path}
            to={`${this.props.match.path}${route.path}`}
            activeClassName="active"
            exact={true}>
            {route.name}
          </NavLink>
        ))}
        <div className="container">
          {routes.map(({ path, Component }) => (
            <Route key={path} exact={true} path={`${this.props.match.path}${path}`}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="page"
                  unmountOnExit={true}
                >
                  <div className="page">
                    {/* page防止两个页面同时过度的时候破坏布局 */}
                    <Component />
                  </div>
                </CSSTransition>
              )}
            </Route>
          ))}
        </div>
      </div>
    );
  }
}

export default Detail;

import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LoginPage from "../page/user/Login";
import Register from "../page/user/Register";
import "./UserLayout.css";

// 单单的CSSTransition，不能检测到动画的，只有放到挂载的才可以组件才可以
class UserLayout extends React.PureComponent<RouteComponentProps> {
  render() {
    console.log(this.props.location.key);
    return (
      <div className="user-layout-container">
        <div className="user-layout-logo" />
        <div className="user-layout-content">
          <TransitionGroup>
            <CSSTransition
              key={this.props.location.pathname}
              classNames="page"
              exit={false}
              unmountOnExit={true}
              timeout={300}>
              <Switch>
                <Route
                  path={`${this.props.match.path}/login`}
                  component={LoginPage}
                />
                <Route
                  path={`${this.props.match.path}/register`}
                  component={Register}
                />
                <Redirect to={`${this.props.match.path}/login`} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

export default UserLayout;

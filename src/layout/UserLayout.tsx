import CanvasNest from 'canvas-nest.js';
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LoginPage from "../page/user/Login";
import Register from "../page/user/Register";
import "./UserLayout.scss";

const {useEffect, useRef} = React;

// 单单的CSSTransition，不能检测到动画的，只有放到挂载的才可以组件才可以
const UserLayout: React.FC<RouteComponentProps> = (props) => {

  const element = useRef(null);

  useEffect(() => {
    const config = {
      color: '255,0,0',
      count: 88,
      zIndex: 1,
    };
    
    // 在 element 地方使用 config 渲染效果
    const cn = new CanvasNest(element.current, config);
    
    // destroy
    return () => {
      cn.destroy();
    }
  }, [])
  return (
    <div className="user-layout-container" ref={element}>
      <div className="user-layout-logo" />
      <div className="user-layout-content">
        <TransitionGroup>
          <CSSTransition
            key={props.location.pathname}
            classNames="page"
            exit={false}
            unmountOnExit={true}
            timeout={300}>
            <Switch>
              <Route
                path={`${props.match.path}/login`}
                component={LoginPage}
              />
              <Route
                path={`${props.match.path}/register`}
                component={Register}
              />
              <Redirect to={`${props.match.path}/login`} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  ); 
}

export default UserLayout;

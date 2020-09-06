import CanvasNest from 'canvas-nest.js';
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import "./UserLayout.scss";
const {useEffect, useRef} = React;

interface IProps extends RouteComponentProps {
  route : any
}

// 单单的CSSTransition，不能检测到动画的，只有放到挂载的才可以组件才可以
const UserLayout: React.FC<IProps> = (props) => {
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

  const  {route} = props  
  console.log(route)
  
  return (
    <div className="user-layout-container" ref={element}>
      <div className="user-layout-logo" />
      <div className="user-layout-content">
      {renderRoutes(route.routes)}
      </div>
    </div>
  ); 
}

export default UserLayout;

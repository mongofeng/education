import * as React from "react";

// 引入react-transition-group动画组件
// react 官网动画库（react-transition-group）的新写法https://segmentfault.com/a/1190000015487495

// unmountOnExit={false} // 为true 代表退出的时候移除dom
// appear={true} // 为true  渲染的时候就直接执行动画，默认false，
// in 是否在进入

import { CSSTransition, TransitionGroup } from "react-transition-group";
class AppTra extends React.Component<any> {
  state: any = {
    list: []
  };

  handleAddItem = () => {
    this.setState((prevState: any) => {
      return {
        list: [...prevState.list, "666"]
      };
    });
  };

  handleRemoveItem = () => {
    const list = this.state.list.slice(0, -1)
    this.setState({
      list: [...list]}
    );
  };

  render() {
    return (
      // Fragment是占位符
      <React.Fragment>
        <TransitionGroup>
          {this.state.list.map((item: any, index:any) => {
            return (
              <CSSTransition
                in={true}
                // 动画时间
                timeout={1000}
                // 前缀名注意S
                classNames="fade"
                unmountOnExit={true}
                onEntered={el => {
                  el.style.color = "blue";
                }}
                // 入场第一帧
                appear={true}
                key={index}
              >
                <div>{item}</div>
              </CSSTransition>
            );
          })}
         
        </TransitionGroup>
        <button onClick={this.handleAddItem}>toggle</button>
        <button onClick={this.handleRemoveItem}>remove</button>
      </React.Fragment>
    );
  }
}

export default AppTra;

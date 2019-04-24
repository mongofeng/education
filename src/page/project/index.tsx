
import * as React from 'react';
import {  Route, Switch } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition } from "react-transition-group";
import CSSTransitionCom from './CSSTransition'
import DefaultProps from './DefaultProps'
import Hoc from './Hoc'
import RouterConfig from './RouterConfig'

import TransitionGroupCom from './TransitionGroup'


interface IRoutes {
  path: string
  component: React.ComponentType<RouteComponentProps & any>
  routes?: IRoutes[]
}

const routes: IRoutes[] = [
  {
    path: "/transition-group",
    component: TransitionGroupCom
  },
  {
    path: "/css-transition",
    component: CSSTransitionCom,
  },
  {
    path: "/router-config",
    component: RouterConfig
  },
  {
    path: '/hoc',
    component: Hoc
  },
  {
    path: '/DefaultProps',
    component: DefaultProps
  }
];
class Student extends React.PureComponent<RouteComponentProps> {
    render () {
        return (<Switch>
        {/* <Route path={`${this.props.match.path}/list`}  component={TransitionGroup} />
        <Route path={`${this.props.match.path}/add`}  component={CSSTransition} />
        <Route path={`${this.props.match.path}/detail`}  component={RouterConfig} />
        <Route path={`${this.props.match.path}/edit/:id`}  component={CSSTransition} /> */}


        {/* {routes.map(route => (
          <Route path={`${this.props.match.path}${route.path}`}  component={route.component} key={route.path} />
        ))} */}


        {routes.map(route => (
            <Route 
              path={`${this.props.match.path}${route.path}`}  
              key={route.path}
              render = {(props: RouteComponentProps) => {
                // console.log(props)
                // console.log(this.props)
                // 只有in的true 和 false才能出现动画的
                return (
                  <CSSTransition
                  in={true}
                  timeout={30000}
                  classNames="page"
                  appear={true}
                  onEnter={() => {console.log('enter中')}}
                  unmountOnExit={true}
                >
                  <route.component {...props}/>
                </CSSTransition>
                )
              }} />
        ))}
        {/* <Redirect to={`${this.props.match.path}${routes[0].path}`} /> */}
      </Switch>)
    }
}

export default Student

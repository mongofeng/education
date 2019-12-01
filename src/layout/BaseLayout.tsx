import Form, { Avatar, Dropdown, Icon, Layout, Menu, Spin } from "antd";
import { useEffect, useState } from 'react'
import * as React from "react";
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
// import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Dispatch } from "redux";
import SiderMenu from '../components/Sider-Menu'
import { Navs} from '../config/nav'
import {IUser} from '../const/type/user'
import * as packageAction from '../store/actions/package'
import * as studentAction from '../store/actions/student'
import * as action from "../store/actions/user";
import "./BaseLayout.scss";

const { Header, Content, Sider } = Layout;


const Analysis = React.lazy(() => import(/* webpackChunkName: 'analysis'*/ '../page/analysis'));
const Course = React.lazy(() => import(/* webpackChunkName: 'course'*/ '../page/course'));

const Hour = React.lazy(() => import(/* webpackChunkName: 'hour'*/ '../page/hour'));

const Student = React.lazy(() => import(/* webpackChunkName: 'student'*/ '../page/student'));
const Teacher = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher'));

const StudentHour = React.lazy(() => import(/* webpackChunkName: 'student-hour'*/ '../page/student-hour'));

const Package = React.lazy(() => import(/* webpackChunkName: 'package'*/ '../page/package'));


const CourseList = React.lazy(() => import(/* webpackChunkName: 'course-list'*/ '../page/course-list'));
interface IProps extends RouteComponentProps {
  dispatch: Dispatch
  user: IUser
}

interface IRoutes {
  path: string;
  component: any;
  routes?: IRoutes[];
}

const routes: IRoutes[] = [
  {
    path: "student",
    component: Student
  },
  {
    path: "teacher",
    component: Teacher
  },
  {
    path: "course",
    component: Course
  },
  {
    path: "analysis",
    component: Analysis
  },
  {
    path: "hour",
    component: Hour
  },
  {
    path: "course-list",
    component: CourseList
  },
  {
    path: "package",
    component: Package
  },
  {
    path: 'student-hour',
    component: StudentHour,
  }
];

const menu = (
  <Menu className="menu">
    <Menu.Item key="0">
      <Icon type="user" />
      <span>
        个人中心
      </span>
    </Menu.Item>
    <Menu.Item key="1">
      <Icon type="setting" />
      <span>
        个人设置
      </span>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
    <NavLink to='/'>
      <Icon type="logout" />
      <span>退出登录</span>
    </NavLink>

    </Menu.Item>
  </Menu>
);


function BaseLayout (props: IProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false)

  const fetchAllStudent  = () => {
    props.dispatch(studentAction.FetchList({
      limit: 10000,
      page: 1,
      sort: { createDate: -1 }
    }))
  }

  const fetchAllPackage = () => {
    props.dispatch(packageAction.FetchList({
      limit: 10000,
      page: 1,
      sort: { createDate: -1 }
    }))
  }

  useEffect(() => {
    // 获取用户的数据
    props.dispatch(action.FetchUser())

    fetchAllStudent()

    fetchAllPackage()
  }, [])
  return (
    <Layout className="base-layout">
      <Sider
        style={{height: '100vh'}}
        trigger={null}
        collapsible={true}
        collapsed={collapsed}>
        <div className="logo" />
        <SiderMenu
          history={props.history}
          nav={Navs}
          matchUrl={props.match.url}
          path={props.location.pathname} />
      </Sider>

      <Layout>
        <Header className="base-layout-header">
          <Icon
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={() => setCollapsed(!collapsed)}
          />

          {/* 个人中心 */}
          <div className="header-index-right">
            <Dropdown overlay={menu}>
              <div className="layout-dropdown-link">
                <Avatar
                  src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                  className="mr10" />
                <span style={{ verticalAlign: "middle" }}>
                  {props.user && props.user.name}
                </span>
              </div>
            </Dropdown>
          </div>

        </Header>
        <Content
          style={{
            overflow: "auto"
          }}>


          <React.Suspense
            fallback={<Spin />}>
            <Switch>
              {routes && routes.map(item => {
                return (
                  <Route
                    path={`${props.match.path}/${item.path}`}
                    component={item.component}
                    key={`${props.match.path}/${item.path}`}/>
                )
              })}
              <Redirect from={props.match.path} to={`${props.match.path}/${routes[0].path}`} />
            </Switch>
          </React.Suspense>



        </Content>

        {/* <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer> */}
      </Layout>
    </Layout>
  );
}

export default connect(({user}: {user: IUser}) => ({user}))(BaseLayout);


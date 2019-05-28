import { Avatar, Dropdown, Icon, Layout, Menu, Spin } from "antd";
import * as React from "react";
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
// import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Dispatch } from "redux";
import SiderMenu from '../components/Sider-Menu'
import { Navs} from '../config/nav'
import {IUser} from '../const/type/user'
import * as action from "../store/actions/user";
import "./BaseLayout.css";
const { Header, Content, Sider } = Layout;


const Analysis = React.lazy(() => import(/* webpackChunkName: 'analysis'*/ '../page/analysis'));
const Course = React.lazy(() => import(/* webpackChunkName: 'course'*/ '../page/course'));

const Hour = React.lazy(() => import(/* webpackChunkName: 'hour'*/ '../page/hour'));

const Student = React.lazy(() => import(/* webpackChunkName: 'student'*/ '../page/student'));
const Teacher = React.lazy(() => import(/* webpackChunkName: 'teacher'*/ '../page/teacher'));
interface IProps extends RouteComponentProps {
  dispatch: Dispatch
  user: IUser
}

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

interface IState {
  collapsed: boolean
}

class BaseLayout extends React.PureComponent<IProps, IState> {
  state: IState = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };



  componentWillMount () {
    // 获取用户的数据
    this.props.dispatch(action.FetchUser())
  }

  render() {
    return (
      <Layout className="base-layout">
        <Sider
          style={{height: '100vh'}}
          trigger={null}
          collapsible={true}
          collapsed={this.state.collapsed}>
          <div className="logo" />
          <SiderMenu
            history={this.props.history} 
            nav={Navs} 
            matchUrl={this.props.match.url} 
            path={this.props.location.pathname} />
        </Sider>

        <Layout>
          <Header className="base-layout-header">
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />

            {/* 个人中心 */}
            <div className="header-index-right">
              <Dropdown overlay={menu}>
                <div className="layout-dropdown-link">
                  <Avatar src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" className="mr10" />
                  <span style={{ verticalAlign: "middle" }}>{this.props.user && this.props.user.name}</span>
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
              <Route path={`${this.props.match.path}/student`}  component={Student} />
              <Route path={`${this.props.match.path}/teacher`}  component={Teacher} />
              <Route path={`${this.props.match.path}/course`}  component={Course} />
              <Route path={`${this.props.match.path}/hour`}  component={Hour} />
              <Route path={`${this.props.match.path}/analysis`}  component={Analysis} />
              <Redirect from={this.props.match.path} to={`${this.props.match.path}/analysis`} />
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
}

export default connect(({user}: {user: IUser}) => ({user}))(BaseLayout);


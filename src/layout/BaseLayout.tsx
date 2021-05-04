import { Avatar, Dropdown, Icon, Layout, Menu } from "antd";
import { useCallback, useEffect, useState } from 'react'
import * as React from "react";
import { connect } from 'react-redux';
import { renderRoutes } from "react-router-config";
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from "redux";
import SiderMenu from '../components/Sider-Menu'
import { Navs } from '../config/nav'
import { IUser } from '../const/type/user'
import * as packageAction from '../store/actions/package'
import * as studentAction from '../store/actions/student'
import * as action from "../store/actions/user";
// import {CSSTransition , TransitionGroup} from 'react-transition-group'
import "./BaseLayout.scss";

const { Header, Content, Sider } = Layout;


interface IProps extends RouteComponentProps {
  dispatch: Dispatch
  route: any
  user: IUser
}

interface IRoutes {
  path: string;
  component: any;
  routes?: IRoutes[];
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


function BaseLayout(props: IProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false)


  const [prefix, setPrefix] = useState('')
  const [current, setCurrent] = useState('')

  useEffect(() => {
    const { origin, pathname, hash } = location
    let src = pathname.replace(/^(?!\/)|(\/{2,})/g, '/');
    if (!(window as any).__POWERED_BY_QIANKUN__) {
      src = '/yangjin-pro/'
    }
    console.log(src)
    setPrefix(origin + src)
    const key = hash.includes('app-common') ? 'app-common' : 'app-pro'
    setCurrent(key)
  }, [])


  const handleClick = useCallback(
    e => {
      console.log('click ', e);
      setCurrent(e.key)
    },
    []
  );

  const fetchAllStudent = () => {
    props.dispatch(studentAction.FetchList({
      limit: 10000,
      size: 10000,
      page: 1,
      sort: { createDate: -1 }
    }))
  }

  const fetchAllPackage = () => {
    props.dispatch(packageAction.FetchList({
      limit: 10000,
      size: 10000,
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


  const { route } = props
  console.log(route)


  return (
    <Layout className="base-layout">
      <Sider
        style={{ height: '100vh' }}
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
            <Menu mode="horizontal" onClick={handleClick} className="mr20" selectedKeys={[current]} style={{display: 'inline-block', border: 'none'}}>
              <Menu.Item key="app-common" >
                  课程中心
              </Menu.Item>


              <Menu.Item key="app-pro">
                <a href={prefix + '#/app-pro'} >
                  资料中心
          </a>
              </Menu.Item>
            </Menu>

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


          {/* <TransitionGroup className={'router-wrapper'}>
          <CSSTransition
            timeout={500}
            classNames={'fade'}
            key={props.location.pathname}
          >
            {renderRoutes(route.routes)}
          </CSSTransition>
        </TransitionGroup> */}



          {renderRoutes(route.routes)}




        </Content>

        {/* <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer> */}
      </Layout>
    </Layout>
  );
}

export default connect(({ user }: { user: IUser }) => ({ user }))(BaseLayout);


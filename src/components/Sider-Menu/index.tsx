import { Icon, Menu } from "antd";
import * as React from "react";
import { NavLink } from "react-router-dom";
import {hasChildren} from '../../config/nav'
import { INavs } from '../../types/common'
const SubMenu = Menu.SubMenu;

interface IProps {
    nav: INavs[]
    matchUrl: string
    path: string
}
const SiderMenu: React.FC<IProps> = (props) => {

    const { nav, matchUrl, path: pathname } = props

     /**
      * 
      * @param path 当前的完整地址
      * @param baseUrl 当前匹配的基本地址
      */
    const heightLightMenu = (path: string, baseUrl: string) => {
        // !!!!!!两个\\当做一个\
        const regx = new RegExp(`\\${baseUrl}\\/(\\w+)\\/?([\\w-]*)\\/?`)
        regx.exec(path)
        const val: string = RegExp.$1

        // 是否含有childern
        const current = hasChildren(nav, val) ? [RegExp.$2, val] : [val]

        return {
            initOpenKeys: [val],
            initSelectedKeys: current
        }

    }

    const { initSelectedKeys, initOpenKeys } = heightLightMenu(pathname, matchUrl )

    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={initSelectedKeys}
            defaultOpenKeys={initOpenKeys}>

            {nav.map(item => {
                if (item.children) {
                    return (
                        <SubMenu
                            key={item.value}
                            title={<span>
                                <Icon type={item.icon || "mail"} />
                                <span>{item.label}</span></span>}>
                            {item.children.map((child) => {
                                return <Menu.Item key={child.value}>
                                    <NavLink to={`${matchUrl}/${item.value}/${child.value}`}>{child.label}</NavLink>
                                </Menu.Item>
                            })}
                        </SubMenu>
                    )
                }

                return (
                    <Menu.Item key={item.value}>
                        <NavLink to={`${matchUrl}/${item.value}`}>
                            <Icon type={item.icon || "pie-chart"} />
                            {item.label}
                        </NavLink>
                    </Menu.Item>
                )
            })}
        </Menu>
    )
}

export default SiderMenu
import { Icon, Menu } from "antd";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { hasChildren } from '../../config/nav';
import { INavs } from '../../types/common';
import style from './index.module.scss'
const SubMenu = Menu.SubMenu;

interface IProps {
    nav: INavs[]
    matchUrl: string
    path: string
    history: any
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

    const { initSelectedKeys, initOpenKeys } = heightLightMenu(pathname, matchUrl)

    return (
        <Menu
            className={style.nav}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={initSelectedKeys}
            defaultOpenKeys={initOpenKeys}
            onClick={(e: any) => {
                console.error('点击事件');
                const urls = [...e.keyPath]
                urls.reverse()
                urls.unshift(matchUrl)
                console.log(urls)
 

                const url = urls.join('/')
                // console.log(url, pathname, props)
                if (!pathname.includes(url)) {
                    props.history.push(url);
                } else {
                    console.log('同一url下面, 不跳转')
                }
            }}>

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
                                    {child.label}
                                </Menu.Item>
                            })}
                        </SubMenu>
                    )
                }

                return (
                    <Menu.Item key={item.value}>
                        <Icon type={item.icon || "pie-chart"} />
                        <span >
                            {item.label}

                        </span>

                    </Menu.Item>
                )
            })}
        </Menu>
    )
}

export default SiderMenu
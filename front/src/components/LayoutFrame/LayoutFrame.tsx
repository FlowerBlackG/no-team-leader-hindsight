// SPDX-License-Identifier: MulanPSL-2.0

/* 上财果团团 */

import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FreeKeyObject } from '../../utils/FreeKeyObject';
import styles from './LayoutFrame.module.css'
import { globalData, globalHooks, globalHooksRegistry, resetGlobalData } from '../../common/GlobalData';
import URLNavigate from '../../utils/URLNavigate';
import { request } from '../../utils/request';
import MacroDefines from '../../common/MacroDefines';
import PageRouteManager from '../../common/PageRoutes/PageRouteManager';
import { useConstructor } from '../../utils/react-functional-helpers';
import { Button, Flex, FloatButton, Menu, Spin, Tooltip, Typography, message } from 'antd';
import { ArrowLeftOutlined, FullscreenExitOutlined, FullscreenOutlined, LogoutOutlined } from '@ant-design/icons';
import { PageRouteCategory, PageRouteData } from '../../common/PageRoutes/TypeDef';
import { later } from '../../utils/later';
import { Permission } from '../../api/Permissions';


const { Text, Title, Paragraph } = Typography


export interface LayoutFrameProps {
    child: PageRouteData
}


export default function LayoutFrame(
    props: LayoutFrameProps
) {


    /* states */

    const [showBackBtn, setShowBackBtn] = useState(false)
    const [pageTitle, setPageTitle] = useState('')
    const [pageDataLoading, setPageDataLoading] = useState(false)
    const [pageEntity, setPageEntity] = useState<PageRouteData | null>(null)
    const [username, setUsername] = useState('')

    const [fullpage, setFullpage] = useState(false)

    /* constructor */

    if (pageEntity !== props.child) {
        setPageEntity(props.child)
        setFullpage(false)
        constructor()
    }

    function constructor() {
        const hooks = globalHooksRegistry.layoutFrame
        hooks.setDataLoading = setDataLoading
        hooks.setTitle = setTitle
        hooks.forceUpdate = update
        hooks.setUsername = setUsername
        hooks.setFullpage = setFullpage

        setCurrentPageEntity(props.child)
    }


    /**
     * 强制刷新组件。
     */
    function update() {
        
    }

    function setTitle(title: string) {
        setPageTitle(title)
    }

    function setCurrentPageEntity(entity: PageRouteData) {

        setTitle(entity.title!)

        setPageDataLoading(false)

        document.title = entity.title!.concat(' - 落霞前厅')

        setShowBackBtn(entity.showBackButton!)
        
    }

    function setDataLoading(loading: boolean) {
        setPageDataLoading(loading)
    }


    /* render */

    if (props.child.inFrame === false) {
        return <>{ props.child.element }</>
    }


    return <Flex style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }}>

        { /* 侧边栏区域。 */ }

        {
            !fullpage &&

            <FrameSidebar 
                pageEntity={pageEntity} 
                username={"阿飘"} 
            />
        }

        

        { /* 右区域。 */ }

        <div style={{ 
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        }}>
            { /* 标题区域。 */ }
            {
                !fullpage &&

                <FrameToolbar 
                    pageTitle={pageTitle} 
                    pageDataLoading={pageDataLoading} 
                    showBackBtn={showBackBtn} 
                />
            }
            

            { /* 页面主元素区域。 */ }

            <div 
                style={{
                    flex: 1,
                    position: 'relative',
                    marginTop: 2,
                    marginLeft: 2,
                    borderTopLeftRadius: 8,
                    border: 'solid 1px #aaa2',
                }} 
                className={styles.MainElementShadow}
            >
                { props.child.element }
            </div>

            {
                fullpage &&
                <FloatButton
                    shape='circle'
                    icon={<FullscreenExitOutlined />}
                    onClick={() => setFullpage(false)}
                />
            }

            {
                pageEntity?.allowFullpage && !fullpage && 
                <FloatButton
                    shape='circle'
                    icon={<FullscreenOutlined />}
                    onClick={() => setFullpage(true)}
                />
            }
            
        </div>

    </Flex>

}  // export default function LayoutFrame


/* ------------ Frame Sidebar ------------ */

interface FrameSidebarProps {
    pageEntity: PageRouteData | null
    username: string
}



function FrameSidebar(props: FrameSidebarProps) {


    const [menuItems, setMenuItems] = useState<any[]>([])
    const [pageIcon, setPageIcon] = useState('')

    const [frameSidebarLoaded, setFrameSidebarLoaded] = useState(false)

    let icon = props.pageEntity?.icon
    if (icon === undefined) {
        icon = ''
    }

    if (pageIcon !== icon)
        setPageIcon(icon)

    
    useConstructor(constructor)
    function constructor() {

    }


    if (!frameSidebarLoaded) {
        setFrameSidebarLoaded(true)
        loadMenu()
    }


    function loadMenu() {
        let items = new Array<any>()
        let categoryChildren = new Map<string, Array<any> >()
        let categoryEntityMap = new Map<string, PageRouteCategory>()
        let categoryPushedSet = new Set<string>()

        // 准备子选项列表的 map。
        PageRouteManager.getCategories().forEach(category => {
            categoryChildren.set(category.key, new Array<PageRouteData>())
            categoryEntityMap.set(category.key, category)
        })

        // 遍历处理页面路由。
        PageRouteManager.getRoutes().forEach(route => {

            // 先判断是否要展示在菜单里。
            let shouldShow = route.showInSidebar

            shouldShow &&= route.permissionCheckPassed!()

            if (!shouldShow) {
                return // 跳过该路由项。
            }

            if (route.category == undefined) {
                
                // 直接添加。
                
                
                items.push({
                    key: route.path,
                    label: route.name
                })
                
            } else {
                // 希望添加到分类。
                let childrenList = categoryChildren.get(route.category)

                if (childrenList === undefined) {
                    console.error('undefined route group: ' + route.category)
                    message.error('网页内部错误。请咨询开发人员。')
                }

                childrenList!.push({
                    key: route.path,
                    label: route.name
                })

                if (!categoryPushedSet.has(route.category!)) {
                    categoryPushedSet.add(route.category!)
                    let categoryEntity = categoryEntityMap.get(route.category!)
                    
                    items.push({
                        key: categoryEntity?.key,
                        label: categoryEntity?.label,
                        type: 'group',
                        children: childrenList
                    })
                }

            }
            
        })

        setMenuItems(items)
    }


    if (props.pageEntity === null) {
        return null
    }


    return <div style={{
        width: 120,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flexShrink: 0,
    }}>
        
        { /* 个人信息。 */ }
        <div style={{
            height: 48,
            width: '100%',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
        }}>

            <img
                src={ pageIcon }
                style={{
                    width: '1.2em',
                    flexShrink: '0',
                    marginLeft: '0.4em'
                }}
            />

            <div style={{ 
                width: '0.4em',
                flexShrink: '0'
            }} />

            <Tooltip title={props.username}>
                <div 
                    style={{ 
                        flexShrink: '0',
                        flexGrow: 1,
                        width: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginRight: '0.4em'
                    }}
                >
                    { props.username }
                </div>
            </Tooltip>
        </div>
    
        { /* 导航项。 */ }

        <div 
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                userSelect: 'none',
                overflowX: 'hidden'
            }}

            className='overflow-y-overlay nicer-scrollbar'
        >

            <Menu 
                items={ menuItems }
                style={{
                    borderRight: 'solid 0px #0000'
                }}
                onSelect={(event) => {

                    const entity = PageRouteManager.getRouteEntity(event.key)
                    
                    globalHooks.app.navigate({ pathname: entity.path })
                }}

                mode='inline'
                selectedKeys={[ props.pageEntity.path ]}
            />


        </div>

    </div>
}



/* ------------ Frame Toolbar ------------ */

interface FrameToolbarProps {
    showBackBtn: boolean
    pageTitle: string
    pageDataLoading: boolean
}

function FrameToolbar(props: FrameToolbarProps) {
    return <Flex style={{
        height: 42,
        alignItems: 'center',
        color: '#000b',
        fontSize: 20,
        paddingLeft: 18,
        flexShrink: 0,
    }}>

        { /* 返回按钮 */ }
        {
            props.showBackBtn &&
            <Button
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                }}
                shape='round'
                icon={<ArrowLeftOutlined />}
                onClick={ () => { globalHooks.app.navigate( -1 ) } }
            />
        }

        <div style={{ width: '100%', textAlign: 'center' }}>
            { props.pageTitle }
        </div>

        <Spin 
            spinning={ props.pageDataLoading }
            style={{
                marginLeft: 10,
            }}
            size='small'
        />

        { /* 退出登录。 */ } 
        <Tooltip title='退出登录'><Button 
            style={{
                marginRight: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            shape='round'
            icon={<LogoutOutlined />}
            onClick={() => {
                request({
                    url: 'user/logout'
                }).catch(err => {

                }).finally(() => {
                    resetGlobalData()
                    globalHooks.app.navigate({ pathname: '/login' })
                })
            }}
        /></Tooltip>
         
    </Flex>
}

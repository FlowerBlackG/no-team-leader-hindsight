// SPDX-License-Identifier: MulanPSL-2.0
/*
 *
 * 创建于 2024年3月28日 上海市嘉定区
 */

import { AboutPage } from "../../pages/about/About"
import { IndexPage } from "../../pages/index/Index"
import LoginPageBackgroundGalleryPage from "../../pages/login-page-background-gallery/LoginPageBackgroundGallery"
import LoginPage from "../../pages/login/Login"
import MyProfilePage from "../../pages/my-profile/MyProfile"
import { SearchPage } from "../../pages/search/Search"
import TestPage from "../../pages/test/Test"
import FluentUIEmojiProxy from "../../utils/FluentUIEmojiProxy"
import { PageRouteCategory, PageRouteData } from "./TypeDef"


const categoryKeys = {
    tool: '_vc_tool',
    vesperCenterControlPanel: '_vc_ctrlPanel',
}

export default class PageRoutes {
    private constructor() {}

    static routeCategories: Array<PageRouteCategory> = [
        {
            key: categoryKeys.vesperCenterControlPanel,
            label: '控制台'
        },
        {
            key: categoryKeys.tool,
            label: '工具'
        },
    ]
    
    /**
     * 页面路由表。
     * path: 页面路由。每个页面进入后，需要根据页面路由取到指向自己信息的实体结构。
     *       因此，修改 path 后，必须前往对应页面类修改相应代码。
     */
    static routes: Array<PageRouteData> = [
     
           
        {
            path: '/login',
            name: '登录',
            element: <LoginPage />,
            inFrame: false,
            showInSidebar: false,
            showInHomePage: false,
        },
    
    
        {
            path: '/',
            name: '首页',
            element: <IndexPage />,
            icon: FluentUIEmojiProxy.colorSvg('seedling_color'),
            inFrame: true,
            showInSidebar: true,
            showInHomePage: false,
        },
    
    
        {
            path: '/my-profile',
            name: '我',
            element: <MyProfilePage />,
            icon: FluentUIEmojiProxy.colorSvg('hatching_chick_color'),
            inFrame: true,
            showInSidebar: true,
            category: categoryKeys.vesperCenterControlPanel
        },

        {
            path: '/search',
            name: '搜索',
            icon: FluentUIEmojiProxy.colorSvg('face_with_monocle_color'),
            element: <SearchPage />
        },


        {
            path: '/login-page-background-gallery',
            name: '画廊',
            icon: FluentUIEmojiProxy.colorSvg('camera_color'),
            element: <LoginPageBackgroundGalleryPage />,
            category: categoryKeys.vesperCenterControlPanel,
        },


        {
            path: '/about',
            name: '关于',
            icon: FluentUIEmojiProxy.colorSvg('sparkles_color'),
            element: <AboutPage />,
            category: categoryKeys.vesperCenterControlPanel,
        },
        

        {
            path: '/test',
            name: 'test',
            icon: FluentUIEmojiProxy.colorSvg('desktop_computer_color'),
            element: <TestPage />,
            showInSidebar: false,
            showInHomePage: false,
            showBackButton: false,
        },
    ]
    
    
}

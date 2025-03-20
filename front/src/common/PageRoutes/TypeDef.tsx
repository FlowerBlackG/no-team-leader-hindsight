// SPDX-License-Identifier: MulanPSL-2.0
/*
 *
 * 创建于 2024年3月28日 上海市嘉定区
 */

import { ReactNode } from "react"


/**
 * 页面路由分类结构。
 */
export interface PageRouteCategory {
    key: string
    label: string
    title?: string
}


/**
 * 页面路由结构。
 */
export interface PageRouteData {

    /**
     * 页面路径，同时作为页面识别标记。需要不同。
     * 要求是绝对路径。即，以"/"开头。
     */
    path: string

    /**
     * 在侧边栏中展示的名称。
     */
    name: string

    icon?: string

    /**
     * 在页面标题上展示的名称。默认与 name 一致。
     */
    title?: string
    element: ReactNode

    inFrame?: boolean

    showInSidebar?: boolean

    category?: string

    showBackButton?: boolean

    showInHomePage?: boolean

    allowFullpage?: boolean

    permissionCheckPassed?: () => boolean
}



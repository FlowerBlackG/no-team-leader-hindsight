// SPDX-License-Identifier: MulanPSL-2.0
/* 上财果团团 */

import { ReactNode, useRef } from "react"
import { PageRouteCategory, PageRouteData } from "./TypeDef"
import { FreeKeyObject } from "../../utils/FreeKeyObject"
import LayoutFrame from "../../components/LayoutFrame/LayoutFrame"
import { globalData } from "../GlobalData"
import PageRoutes from "./Routes"


function isNullOrUndefined(e: any): boolean {
    return e === null || e === undefined
}

function preprocessRouteData(route: PageRouteData, pageRouteEntityMap: FreeKeyObject) {
    if (isNullOrUndefined(route.title)) {
        route.title = route.name
    }

    if (isNullOrUndefined(route.inFrame)) {
        route.inFrame = true
    }

    if (isNullOrUndefined(route.showInSidebar)) {
        route.showInSidebar = true
    }

    if (isNullOrUndefined(route.showBackButton)) {
        route.showBackButton = false
    }

    if (isNullOrUndefined(route.permissionCheckPassed)) {
        route.permissionCheckPassed = () => { return true }
    }

    if (isNullOrUndefined(route.icon)) {
        route.icon = ''
    }

    if (isNullOrUndefined(route.showInHomePage)) {
        route.showInHomePage = true
    }

    if (isNullOrUndefined(route.allowFullpage)) {
        route.allowFullpage = false
    }

    pageRouteEntityMap[route.path] = route
}


function preprocess(
    pageRoutes: PageRouteData[], 
    map: FreeKeyObject,
    categories: PageRouteCategory[],
) {

    pageRoutes.forEach((route) => {
        preprocessRouteData(route, map)
    })

    categories.forEach((route) => {
        if (isNullOrUndefined(route.title)) {
            route.title = route.label
        }
    })
}



export default class PageRouteManager {

    protected routeCategories = PageRoutes.routeCategories

    /**
     * 页面路由表。
     */
    protected routes = PageRoutes.routes

    routeEntityMap: FreeKeyObject = {}

    protected constructor() {
        preprocess(this.routes, this.routeEntityMap, this.routeCategories)
    }

    protected static _instance: PageRouteManager

    public static getInstance(): PageRouteManager {
        
        if (!PageRouteManager._instance) {
            PageRouteManager._instance = new PageRouteManager()
        }

        return PageRouteManager._instance
    }

    public static instance(): PageRouteManager {
        return PageRouteManager.getInstance()
    }

    static getRouteEntity(path: string): PageRouteData {
        return this.instance().routeEntityMap[path]
    }

    static getRoutes(): PageRouteData[] {
        return this.instance().routes
    }

    static getCategories(): PageRouteCategory[] {
        return this.instance().routeCategories
    }
}

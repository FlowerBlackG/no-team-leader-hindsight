// SPDX-License-Identifier: MulanPSL-2.0
/* 上财果团团 */

import { UserEntity } from "../api/Entities"
import { NavigateFunction } from "react-router-dom"
import { later } from "../utils/later"
import { PageRouteData } from "./PageRoutes/TypeDef"
import { MessageInstance } from "antd/es/message/interface"

/**
 * 全局变量。
 */

export const globalData = {
    userEntity: null as UserEntity | null
}


export const globalHooksRegistry = {
    app: {
        navigate: null as NavigateFunction | null,
        message: null as MessageInstance | null
    },

    layoutFrame: {
        setDataLoading: null as ((loading: boolean) => void) | null,
        setCurrentPageEntity: null as ((e: PageRouteData) => void) | null,
        setTitle: null as ((s: string) => void) | null,
        forceUpdate: null as (() => void) | null,
        setUsername: null as ((s: string) => void) | null,
        setFullpage: null as ((b: boolean) => void) | null,
    }
}


export const globalHooks = {
    app: {
        // buggy, but fixed in components/GlobalNavigate.tsx
        navigate: globalHooksRegistry.app.navigate as NavigateFunction,
        message: globalHooksRegistry.app.message as MessageInstance
    },

    layoutFrame: {
        setDataLoading: (loading: boolean) => {
            const f = globalHooksRegistry.layoutFrame.setDataLoading
            if (f) {
                f(loading)
            }
        },

        setCurrentPageEntity: (entity: PageRouteData) => {
            const f = globalHooksRegistry.layoutFrame.setCurrentPageEntity
            if (f) {
                f(entity)
            }
        },

        setTitle: (title: string) => {
            const f = globalHooksRegistry.layoutFrame.setTitle
            if (f) {
                f(title)
            }
        },

        forceUpdate: () => {
            const f = globalHooksRegistry.layoutFrame.forceUpdate
            if (f) {
                f()
            }
        },

        setUsername: (s: string) => {
            const f = globalHooksRegistry.layoutFrame.setUsername
            if (f) {
                f(s)
            }
        },

        setFullpage: (b: boolean) => {
            const f = globalHooksRegistry.layoutFrame.setFullpage
            if (f) {
                f(b)
            }
        },
    }
}


export function resetGlobalData() {
    globalData.userEntity = null
}


export interface EnsureGlobalDataParams {
    useDefaultExceptionHandler?: boolean
    dontReject?: boolean
    dontResolve?: boolean
    forceReloadGroupPermissions?: boolean
    forceReloadPermissions?: boolean
    forceReloadUserEntity?: boolean

    resolveLater?: boolean
}

const ensureGlobalDataDefaultParams: EnsureGlobalDataParams = {
    useDefaultExceptionHandler: true,
    dontReject: false,
    dontResolve: false,
    forceReloadGroupPermissions: false,
    forceReloadPermissions: false,
    forceReloadUserEntity: false,

    resolveLater: false,
}


/**
 * 用户浏览器刷新时，globalData 可能会被清空，但 session 仍存在。
 * 此时，需要重新获取用户信息。
 */
export function ensureGlobalData(callParams: EnsureGlobalDataParams = {}) {
    
    // 处理参数。
    
    let params: EnsureGlobalDataParams = { ...ensureGlobalDataDefaultParams }
    Object.keys(params).forEach(key => {
        let callValue = (callParams as any)[key]
        if (callValue !== undefined) {
            (params as any)[key] = callValue
        }
    })

    // 重置状态。

    if (params.forceReloadUserEntity) {
        globalData.userEntity = null
    }


    return new Promise((resolve, reject) => {

        let exceptionOccurreded = false
        let resolved = false
        const tryResolve = () => {
            if (
                params.dontResolve
                || resolved
                || globalData.userEntity === null
            ) {
                return
            }

            resolved = true
            if (params.resolveLater) {
                later(() => resolve(null))
            } else {
                resolve(null)
            }
        }

        const defaultExceptionHandler = () => {
            // do nothing.
        }
        
        tryResolve()

        if (globalData.userEntity === null) {
            loadBasicInfo().then(() => {
                tryResolve()
            }).catch(() => {
                if (!exceptionOccurreded) {
                    exceptionOccurreded = true
                    if (params.useDefaultExceptionHandler) {
                        defaultExceptionHandler()                        
                    }
                    
                    if (!params.dontReject)
                        reject()
                }
            })
        }

        
    }) // return new Promise((resolve, reject) => {
} // export function ensureGlobalData



function loadBasicInfo() {
    return new Promise((resolve, reject) => {
        globalData.userEntity = {
            username: "WXY"
        }

        resolve(null)
    })
    
}


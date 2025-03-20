// SPDX-License-Identifier: MulanPSL-2.0

/*
 * AppMain
 * 创建于2024年2月29日 上海市嘉定区
 */

import axios from 'axios'
import React, { useRef } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import MacroDefines from './common/MacroDefines' 
import PageRouteManager from './common/PageRoutes/PageRouteManager' 
import { globalData, globalHooks } from './common/GlobalData'
import { useConstructor } from './utils/react-functional-helpers'
import { GlobalNavigate } from './components/GlobalNavigate'
import AntdMessageHost from './components/AntdMessageHost'
import { request } from './utils/request'
import { Button } from 'antd'
import Config from './common/Config'
import LayoutFrame from './components/LayoutFrame/LayoutFrame'

export default function AppMain() {

    useConstructor(constructor)
    function constructor() {
        axios.defaults.baseURL = Config.backendRoot
        axios.defaults.withCredentials = false
    }

    
    return <HashRouter basename={
        MacroDefines.WEB_ROOT_PATH
    }>
        <GlobalNavigate />
        <AntdMessageHost />

        <Routes>
            <Route path="/" key={ "appmain-route-root" }>{

                PageRouteManager.getRoutes().map((route) => {
                    return <Route
                        path={ route.path }
                        element={ <LayoutFrame child={route} /> }
                        key={ "appmain-route-".concat(route.path) }
                    />
                })

            }</Route>

            { /* 404 not found. */ }
            <Route path='*' key={ "appmain-route-any" } element={
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        userSelect: 'none'
                    }}
                >

                    <img
                        src={ 
                            'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20231122_183343.webp' // 嘉图
                        }
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
            
                            transitionDuration: '1s',
                            transitionProperty: 'opacity',
                        }}
                    />
                    
                    <div
                        style={{
                            position: 'absolute',

                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                
                            width: '100%',
                            height: '100%',
                
                            backdropFilter: 'blur(6px)',
                            color: '#ffff'
                        }}
                    >
                        <div style={{ 
                            fontFamily: 'JetBrains Mono, Consola, Mono',
                            fontSize: 56,
                            textAlign: 'center',
                         }}>
                            <p>
                                404 not found.
                            </p>    

                            <Button size='large' ghost style={{width: '100%'}}
                                onClick={() => globalHooks.app.navigate(-1)}
                            >
                                回到上一页
                            </Button>                    
                            
                            <Button size='large' ghost style={{width: '100%'}}
                                onClick={() => globalHooks.app.navigate({pathname: '/'})}
                            >
                                回到主页
                            </Button>

                        </div>
                        
                    </div>
                    
                </div>
            }/> { /* end of 404 not found. */ }

        </Routes>
    </HashRouter>
    
}

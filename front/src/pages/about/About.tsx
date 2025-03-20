// SPDX-License-Identifier: MulanPSL-2.0

/* 上财果团团 */

import React, { useState } from 'react';
import { ensureGlobalData, globalData, globalHooks } from '../../common/GlobalData';
import Version from '../../common/Version';
import DateTimeUtils from '../../utils/DateTimeUtils';
import { HttpStatusCode } from '../../utils/HttpStatusCode';
import { IResponse, request } from '../../utils/request';
import styles from './About.module.css'
import PageRouteManager from '../../common/PageRoutes/PageRouteManager';
import { useConstructor } from '../../utils/react-functional-helpers';
import { message } from 'antd';
import FluentUIEmojiProxy from '../../utils/FluentUIEmojiProxy';
import Config from '../../common/Config';

interface AboutPageState {
    [key: string]: any
}

export function AboutPage() {

    const pageEntity = PageRouteManager.getRouteEntity('/about')

    const [state, setState] = useState<AboutPageState>({
        appVersionName: Version.tag,
        appVersionCode: Version.code,
        appBuildtime: DateTimeUtils.iso8601toHumanFriendly(Version.buildTime),

        backendVersionName: '未知',
        backendVersionCode: 0,
        backendBuildtime: '未知',

        dataLoading: true
    })

    const [backendRoot, setBackendRoot] = useState(Config.backendRoot)

    useConstructor(constructor)
    function constructor() {

        ensureGlobalData({dontReject: true, dontResolve: true})

        request({
            url: 'vesperCenter/version'
        }).then(res => {
            res = res as IResponse

            if (res.code === HttpStatusCode.OK) {
                
                state.backendVersionName = res.data.versionName
                state.backendVersionCode = res.data.versionCode
                state.backendBuildtime = DateTimeUtils.iso8601toHumanFriendly(res.data.buildTime)
                state.backendEnvironment = res.data.environment
                setState({...state})
                
            }
        }).catch(err => {

        })

        
    }

    
    return <div className={'overflow-y-overlay ' + styles.container}>
        <img
            src={FluentUIEmojiProxy.colorSvg('camping_color')}
            className={ styles.logo }
        />

        <div className={styles.title}>Vesper Front 落霞前厅</div>
        <div style={{ marginTop: 8 }}>by 罐头鱼</div>

        <div
            style={{
                marginTop: 24
            }}
        >
            <div>
                程序版本：
                { state.appVersionName } ({state.appVersionCode})
            </div>

            <div>
                后台版本：
                { state.backendVersionName } ({state.backendVersionCode})
            </div>

            <div>
                程序构建：
                {
                    state.appBuildtime
                }
            </div>

            

            <div>
                后台构建：
                {
                    state.backendBuildtime
                }
            </div>


            <div>
                后台地址：
                {
                    backendRoot
                }
            </div>


        </div>

        <div
            className={ styles.buttonHighlight }
            style={{
                marginTop: 24
            }}

            onClick={() => {
                const w = window.open('http://license.coscl.org.cn/MulanPSL2')
                
            }}
        >
            开源许可证
        </div>

        <div
            className={ styles.buttonHighlight }
            style={{
                marginTop: 16
            }}

            onClick={() => {
                const w = window.open('https://github.com/FlowerBlackG/vesper-front')
                
            }}
        >
            获取源码
        </div>

        <div style={{ height: 16, flexShrink: 0 }} />
    </div>
    

}

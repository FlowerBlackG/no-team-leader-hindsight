// SPDX-License-Identifier: MulanPSL-2.0

/*

    创建于2024年3月13日 上海市嘉定区
*/

import { useState } from "react";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";
import { useConstructor } from "../../utils/react-functional-helpers";
import FluentUIEmojiProxy from "../../utils/FluentUIEmojiProxy";
import { Link } from "react-router-dom";

import styles from './Index.module.css'
import { ensureGlobalData } from "../../common/GlobalData";
import { Typography, message } from "antd";
import { homePageLyrics } from "./Lyrics";
import Random from "../../utils/Random";

const { Title, Text } = Typography


interface IndexPageState {

}

const data = {
    lyric: homePageLyrics[0]  // will be randomly set by the constructor.
}

export function IndexPage() {

    const pageEntity = PageRouteManager.getRouteEntity('/')

    const [state, setState] = useState<IndexPageState>({


    })

    useConstructor(constructor)
    function constructor() {

        data.lyric = Random.randElement(homePageLyrics)

        ensureGlobalData()
            .then(() => {
                setState({...state}) // force re-render
            })
            .catch(() => {})
    }

    return <div
        style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none'
        }}
    >

        <div style={{
            marginTop: 38,
            display: 'flex',
            alignItems: "center",
            justifyContent: 'center',
            fontSize: 28
        }}>


            <img
                src={FluentUIEmojiProxy.colorSvg('camping_color')}
                style={{
                    width: '1.2em',
                    height: '1.2em'
                }}
            />


            <div style={{ width: '0.4em' }} />

            <div>落霞前厅</div>
            
        </div>

        { /* 功能按钮区。 */ }

        <div 
    
            style={{
                marginTop: 32,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                userSelect: 'none'
            }}

            className='overflow-y-overlay'
            
        > {
        
            PageRouteManager.getRoutes().map((route) => {

                // 不显示本页和登录页。
                if (route.showInHomePage === false) {
                    return ''
                }

                // 权限校验。
                
                if (!route.permissionCheckPassed!()) {
                    // 无权限，不显示。
                    return ''
                }
            

                // 显示卡片。
                return <Link 
                    className={ styles.linkCard }
                    to={ route.path }
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}>

                        <img
                            src={ route.icon }
                            style={{
                                width: '2.6em',
                            }}
                        />
                        <div
                            style={{
                                color: '#111c',
                                marginTop: 18,
                                fontSize: 16
                            }}
                        > { route.name } </div>
                        
                    </div>
                </Link>

            })

        } </div>


        { /* 页脚歌词 */ }
        <div
            style={{
                color: '#0007',
                position: 'absolute',
                bottom: 8,
                fontSize: 'smaller',
                whiteSpace: 'pre-wrap'
            }}
        >
            { `${data.lyric.lyric}    ——《${data.lyric.song}》${data.lyric.artist}` }
        </div>
        
    </div>
}

/* SPDX-License-Identifier: MulanPSL-2.0 */
/*

    创建于2024年4月7日 上海市嘉定区
*/

import { Card, Drawer, Flex, Image, Modal } from "antd"
import PageRouteManager from "../../common/PageRoutes/PageRouteManager"
import { useConstructor } from "../../utils/react-functional-helpers"
import { LoginPageBackgroundManager } from "../login/LoginPageBackgrounds"

import styles from './LoginPageBackgroundGallery.module.css'
import { ensureGlobalData } from "../../common/GlobalData"
import { useState } from "react"


export default function LoginPageBackgroundGalleryPage() {

    const pageEntity = PageRouteManager.getRouteEntity('/login-page-background-gallery')

    const [imageDrawerOpen, setImageDrawerOpen] = useState(false)
    const [imageDrawerData, setImageDrawerData] = useState(LoginPageBackgroundManager.instance.background)


    /* ctor */

    useConstructor(constructor)
    function constructor() {
        ensureGlobalData({dontReject: true, dontResolve: true})
    }


    /* render */

    const colorDot = (color: string) => {
        const size = 32
        return <div
            style={{
                width: size,
                height: size,
                borderRadius: '100%',
                background: color,
                flexShrink: 0
            }}
        />
    }

    return <Flex
        wrap="wrap"
        style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute'
        }}

        className='overflow-y-overlay'
    >
        
        <div style={{
            marginTop: 16,
            marginLeft: 16,
            width: '100%'
        }}>
            登录页背景图展示
        </div>

        { 
            LoginPageBackgroundManager.instance.all.map(it => {
                return <Card
                    hoverable
                    cover={<img src={`${it.url}?x-oss-process=image/resize,m_mfit,w_300`} />}
                    style={{
                        maxWidth: '100%',
                        margin: 16,
                        textAlign: 'center',
                    }}
                    onClick={() => {
                        setImageDrawerData(it)
                        setImageDrawerOpen(true)
                    }}
                >
                    { it.title }
                    <Flex style={{ alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                        {colorDot(it.colors.button.normal)}
                        <div style={{ width: 8, flexShrink: 0 }} />
                        {colorDot(it.colors.button.hover)}
                    </Flex>
                </Card>
            }) 
        }


        <Drawer
            open={ imageDrawerOpen }
            onClose={() => setImageDrawerOpen(false)}
            title={imageDrawerData.title}
            size='large'
        >
            <Image
                src={imageDrawerData.url}
                preview={false}
                style={{
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #7777',
                }}
            />

            <Flex style={{ marginTop: 16 }}>
                <div style={{
                    ...imageDrawerData.styles?.button.normal,
                    width: 36,
                    height: 36,
                    borderRadius: '100%',
                }}/>

                <div style={{
                    ...imageDrawerData.styles?.button.hover,
                    width: 36,
                    height: 36,
                    borderRadius: '100%',
                    marginLeft: 16
                }}/>
            </Flex>

            <p>
                拍摄于 { imageDrawerData.location }
            </p>
            <p>
                由 { imageDrawerData.photographer } 拍摄
            </p>

            <p>
                { imageDrawerData.description }
            </p>
        </Drawer>

    </Flex>
}

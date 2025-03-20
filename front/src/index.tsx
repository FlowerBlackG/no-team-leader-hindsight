// SPDX-License-Identifier: MulanPSL-2.0

/*
 * index.tsx
 * 创建于2024年2月29日 上海市嘉定区
 */

import ReactDOM from "react-dom/client";
import AppMain from './AppMain';

import './index.css'
import PageRouteManager from "./common/PageRoutes/PageRouteManager";
import MacroDefines from "./common/MacroDefines";
import { ConfigProvider, theme } from "antd";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

root.render(
    <ConfigProvider
        theme={{
            token: {
                // 设置主题色。
                colorPrimary: '#1677b3'
            },
        }}
    >
        <AppMain />

    </ConfigProvider>
)

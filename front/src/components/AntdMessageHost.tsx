/* SPDX-License-Identifier: MulanPSL-2.0 */
/*

    创建于2024年4月12日 上海市嘉定区
*/

import { message } from "antd";
import { globalHooks, globalHooksRegistry } from "../common/GlobalData";


export default function AntdMessageHost() {

    const [messageApi, contextHolder] = message.useMessage()

    globalHooksRegistry.app.message = messageApi
    globalHooks.app.message = messageApi

    return contextHolder
}

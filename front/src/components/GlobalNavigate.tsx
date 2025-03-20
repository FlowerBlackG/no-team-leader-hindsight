/* SPDX-License-Identifier: MulanPSL-2.0 */
/*

    创建于2024年3月13日 上海市嘉定区
*/

import { useNavigate } from "react-router-dom"
import { globalHooks, globalHooksRegistry } from "../common/GlobalData"


export const GlobalNavigate = () => {
    globalHooksRegistry.app.navigate = useNavigate()
    // globalHooks 里面的设计是有问题的。这里这样写来弥补 bug
    globalHooks.app.navigate = globalHooksRegistry.app.navigate
    return null
}

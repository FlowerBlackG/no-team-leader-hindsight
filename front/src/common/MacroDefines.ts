// SPDX-License-Identifier: MulanPSL-2.0
/* 上财果团团 */

import Config from "./Config"

/**
 * 全局宏定义。
 * 
 * @deprecated use Config instead.
 */
export default class MacroDefines {
    private constructor() {}

    /* ------------ 网络请求相关 ------------ */

    static get BACKEND_ROOT() {
        return Config.backendRoot
    }

    /** web 根路径。 */
    static WEB_ROOT_PATH = ''

}


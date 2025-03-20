// SPDX-License-Identifier: MulanPSL-2.0

/*
    
    创建于2024年3月19日 上海市嘉定区安亭镇
*/

import Cookies from "universal-cookie"


/**
 * 基于 cookies 的简单 key - value 存储器。
 * 可以用于存储简单数据。
 * 
 * 本设施会自动在 cookie 名之前加入前缀。该过程对使用者透明。
 */
export class CookieBasedDataStore {
    protected constructor() {}

    static cookies = new Cookies(null, { path: '/' })
    static DATA_STORE_KEY_PREFIX = '__dataStore_'

    static makeKey(key: string): string {
        return CookieBasedDataStore.DATA_STORE_KEY_PREFIX.concat(key)
    }

    static put(key: string, value: any) {
        this.cookies.set(this.makeKey(key), value)
    }

    static set = CookieBasedDataStore.put

    static get<T=any>(key: string, defaultValue: T | undefined = undefined): T | undefined {
        let raw = this.cookies.get(this.makeKey(key))
        return raw !== undefined ? raw : defaultValue
    }

    static remove(key: string) {
        this.cookies.remove(this.makeKey(key))
    }
}


// SPDX-License-Identifier: MulanPSL-2.0

import axios from "axios"
import { CookieBasedDataStore as DataStore } from "../utils/CookieBasedDataStore"

/*
 * 
 * 创建于 2024年3月28日 上海市嘉定区
 */


const storageKeys = {
    backendRoot: 'cfg-backendRoot'
}

export default class Config {
    private constructor() {}

    /* public static fields */
    
    static get backendRoot() {
        return this._backendRoot
    } 

    static set backendRoot(url: string) {
        this._backendRoot = url
        axios.defaults.baseURL = url
        DataStore.set(storageKeys.backendRoot, url)
    }


    /* private fields */
    
    private static _backendRoot = DataStore.get<string>(storageKeys.backendRoot, 'http://localhost:9000')!

}

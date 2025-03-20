// SPDX-License-Identifier: MulanPSL-2.0


export default class StringUtils {


    static isEmpty(str: string): boolean {
        return str.length === 0
    }


    static isNotEmpty(str: string): boolean {
        return !this.isEmpty(str)
    }


    static isBlank(str: string): boolean {
        return !this.isNotBlank(str)
    }


    static isNotBlank(str: string): boolean {
        for (let idx = 0; idx < str.length; idx++) {
            const ch = str.charCodeAt(idx)
            if (ch >= 33 && ch <= 126) {
                return true
            }
        }


        return false
    }


    private constructor() {}
}

// SPDX-License-Identifier: MulanPSL-2.0

/* 上财果团团 */

import { WorkBook, write } from 'xlsx';

export default class XlsxUtils {

    static workbook2blob(workbook: WorkBook) {
        let wbout = write(workbook, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        })

        const string2arrayBuffer = (s: string) => {
            let buf = new ArrayBuffer(s.length)
            let view = new Uint8Array(buf)
            for (let i = 0; i !== s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xff
            }

            return buf
        }

        let blob = new Blob([string2arrayBuffer(wbout)], {
            type: 'application/octet-stream'
        })

        return blob

    }

    private constructor() {}
}

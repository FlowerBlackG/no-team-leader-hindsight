// SPDX-License-Identifier: MulanPSL-2.0

/*
    
    创建于2024年3月19日 上海市嘉定区安亭镇
*/


export default class CSVSheet {

    cells = [] as string[][]

    constructor(fileStr: string, delim: string = ',', skipBlankRow: boolean = true) {
        let lines = fileStr.replaceAll("\r", "").split('\n')
        for(let line of lines) {
            let cells = line.split(delim)

            // skip blank line
            if (skipBlankRow) {
                let empty = true
                for (let it of cells) {
                    if (it.length > 0) {
                        empty = false
                        break
                    }
                }

                if (empty) {
                    continue
                }
            }

            // process this line
            this.cells.push(cells)

        }
    }


    getCol(colName: string, skipEmpty: boolean = true): string[] | null {
        let colIdx: number
        for (colIdx = 0; colIdx < this.cells[0].length; colIdx++) {
            if (this.cells[0][colIdx] === colName) {
                break
            }
        }

        if (colIdx === this.cells[0].length) {
            return null
        }

        let res = [] as string[]
        for (let row of this.cells) {

            if (row === this.cells[0]) {
                continue  // skip first row
            }

            let content = row[colIdx]
            if (skipEmpty && content.length === 0) {
                continue
            }

            res.push(content)
        }
        
        return res
    }

}

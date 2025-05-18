import { useState } from "react"
import { globalHooks } from "../../common/GlobalData"
import PageRouteManager from "../../common/PageRoutes/PageRouteManager"
import { later } from "../../utils/later"
import { useConstructor } from "../../utils/react-functional-helpers"
import { Flex, Radio, Select } from "antd"
import { request } from "../../utils/request"
import { SingleStockView } from "./SingleStock"


interface GridConfig {
    nrows: number
    ncols: number
}


const gridConfigs = [
    {
        nrows: 2,
        ncols: 2
    },
    {
        nrows: 3,
        ncols: 3
    },
    {
        nrows: 4,
        ncols: 4
    }
] as GridConfig[]


export function MultipleStockPage() {
    const pageEntity = PageRouteManager.getRouteEntity('/multiple-stock')

    const [stockSearchOptions, setStockSearchOptions] = useState<any>([])
    const [gridConfig, setGridConfig] = useState(gridConfigs[0])


    function loadStockSearchOptions() {
        request({
            url: '/all-security-basic-info',
            method: 'get',
            vfOpts: {
                autoHandleNonOKResults: true,
                rejectNonOKResults: true,
                giveResDataToCaller: true
            }
        }).then(untypedData => {
            console.log(untypedData)
            const options = [] as any[]
            for (const it of untypedData) {
                
                options.push({
                    value: `${it['id']}.${it['inst_type']}`,
                    label: `${it["id"]} : ${it["display_name"]}`
                })
            }

            setStockSearchOptions(options)
        }).catch(err => {

        }).finally(() => {

        })
    }


    useConstructor(constructor)
    function constructor() {
        globalHooks.layoutFrame.setCurrentPageEntity(pageEntity)

        later(loadStockSearchOptions)
    }


    function genGrid(nrows: number, ncols: number) {
        const rows = []
        for (let r = 0; r < nrows; r++) {
            const colViews = []
            for (let c = 0; c < ncols; c++) {
                colViews.push(
                    <div
                        style={{
                            width: `${100 / ncols}%`,
                            height: 300,
                            position: 'relative'
                        }}
                    >
                        <SingleStockView
                            stockSelectOptions={stockSearchOptions}
                        />
                    </div>
                )
            }

            rows.push(
                <Flex>
                    {
                        colViews.map(it => it)
                    }
                </Flex>
            )
        }

        return rows
    }


    return <Flex vertical>
        <Radio.Group 
            style={{ marginLeft: 16, marginTop: 16 }}
            value={gridConfig}
            onChange={value => setGridConfig(value.target.value)}
            buttonStyle="solid"
        >
            {
                gridConfigs.map(it => 
                    <Radio.Button value={it}>
                        {it.ncols * it.nrows}
                    </Radio.Button>
                )
            }
        </Radio.Group>


        <div style={{height: 16}} />
        {
            genGrid(gridConfig.nrows, gridConfig.ncols)
        }

        
    </Flex>
}

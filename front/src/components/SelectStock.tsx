import { Select } from "antd"
import { request } from "../utils/request"
import { useState } from "react"
import { useConstructor } from "../utils/react-functional-helpers"

interface SelectStockProps {
    onChange: (code: string) => void
}


const componentCache = {
    stockSearchOptions: [] as any[]
}


function loadStockSelectOptionsToCache(onSuccess: (() => void) | undefined = undefined) {
    request({
        url: '/all-security-basic-info',
        method: 'get',
        vfOpts: {
            autoHandleNonOKResults: true,
            rejectNonOKResults: true,
            giveResDataToCaller: true
        }
    }).then(untypedData => {
        const options = [] as any[]
        for (const it of untypedData) {
            
            options.push({
                value: `${it['id']}.${it['inst_type']}`,
                label: `${it["id"]} : ${it["display_name"]}`
            })
        }

        componentCache.stockSearchOptions = options
        if (onSuccess)
            onSuccess()
    }).catch(err => {

    }).finally(() => {

    })
}


export function SelectStock(props: SelectStockProps) {
    
    const [stockSelectOptions, setStockSelectOptions] = useState<any>([])

    function loadStockSelectOptions() {
        if (componentCache.stockSearchOptions.length > 0) {
            setStockSelectOptions(componentCache.stockSearchOptions)
        }
        else {
            loadStockSelectOptionsToCache(() => {
                setStockSelectOptions(componentCache.stockSearchOptions)
            })
        }
    }


    useConstructor(loadStockSelectOptions)


    return <Select
        showSearch

        filterOption={(input, option: any) => {
            return option['label'].toLowerCase().includes(input.toLowerCase())
        }}

        style={{
            width: '100%',
            flexShrink: 0
        }}

        placeholder={'下拉选择你的标的'}

        options={stockSelectOptions}
        onChange={props.onChange}
    />
}


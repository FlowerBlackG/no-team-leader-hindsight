/* SPDX-License-Identifier: MulanPSL-2.0 */
// https://blog.csdn.net/GuanJdoJ/article/details/122967629

import { Table, TableProps } from "antd";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import debounce from 'lodash/debounce'
import styles from './AutoGrowAntdTable.module.css'


function useGetResizeHeight(name: string) {
    const [tableHeight, setTableHeight] = useState(0)

    useEffect(() => {
        handleGetTableHeight()

        const debounced = debounce(handleGetTableHeight, 200)
        window.addEventListener('resize', debounced)

        return () => window.removeEventListener('resize', debounced)
    }, [])

    const handleGetTableHeight = () => {
        setTimeout(() => {
            let height = document.getElementById(name)!.clientHeight
            height = height - 55 - 46 - 6  // 55 表头，46 分页组件，6 微调
            setTableHeight(height)
        })
    }

    return [tableHeight]
}


export const AutoGrowAntdTable = <RecordType extends object = any>(props: TableProps<RecordType>) => {
    const tableId = 'vfront-component-auto-grow-table'
    const [tableHeight] = useGetResizeHeight(tableId)

    let tableProps: TableProps<RecordType> = {
        ...props,
        scroll: {
            y: tableHeight
        },
        style: {
            ...props.style,
            height: '100%',
            width: '100%',
            position: 'absolute'
        }
    }

    if (props && props.scroll && props.scroll.x) {
        tableProps.scroll!.x = props.scroll.x
    }


    return <div id={tableId} style={{ height: '100%', position: 'relative' }}>
        <Table<RecordType> {...tableProps} />
    </div>
    
}

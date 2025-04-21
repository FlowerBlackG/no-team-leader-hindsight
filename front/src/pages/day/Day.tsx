import { Flex } from "antd";
import { globalHooks } from "../../common/GlobalData";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";
import { useConstructor } from "../../utils/react-functional-helpers";
import { useSearchParams } from "react-router-dom";
import { later } from "../../utils/later";
import { useEffect, useRef, useState } from "react";
import { request } from "../../utils/request";

import ReactECharts from "echarts-for-react";
import { SecurityBasicInfo } from "../../api/Entities";



interface MinuteMarketDataEntry {
    security_id: string;
    datetime: string;
    pre_close_price: number;
    open_price: number;
    high_price: number;
    low_price: number;
    last_price: number;
    volume: number;
    amount: number;
    iopv: number;
    fp_volume: number;
    fp_amount: number;
    avg_price: number;
    minute_num: number;
    trading_day: string;
}


/*
    search params:
        type: stock, etf, ...
        code: 600000, ...
*/

export function DayPage() {
    const pageEntity = PageRouteManager.getRouteEntity('/day')

    const [instCode, setInstCode] = useState('')
    const [date, setDate] = useState('20240430')
    const [marketData, setMarketData] = useState<MinuteMarketDataEntry[]>([])
    const [instInfo, setInstInfo] = useState<SecurityBasicInfo>()

    const [kInterval, setKInterval] = useState(2)
    
    const [searchParams, setSearchParams] = useSearchParams()



    useConstructor(constructor)
    function constructor() {
        globalHooks.layoutFrame.setCurrentPageEntity(pageEntity)

        later(() => {
            let err = false
            let code = ''
            let type = ''

            if (searchParams.has('code')) 
                code = searchParams.get('code')!
            else
                err = true


            if (!err) {
                setInstCode(code)
                fetchData(code)
            }
            else {
                globalHooks.app.message.error('参数不对。需要 code。')
                globalHooks.app.navigate(-1)
            }
            
        })
    }



    function fetchData(code: string) {
        request({
            url: '/minute-data',
            vfOpts: {
                autoHandleNonOKResults: true,
                giveResDataToCaller: true,
                rejectNonOKResults: true,
            },
            method: 'GET',
            params: {
                date: date,
                instId: code,
            }
        }).then(data => {
            setInstInfo(data.instInfo)
            setMarketData(data.minute)
        }).catch(() => {})
        .finally(() => {

        })
    }


    function getKChartOption(kInterval: number) {
        let xAxis = []
        let data = [] as number[][]

        let n = Math.min(marketData.length, kInterval)
        if (n <= 1)
            n = 2

        let dayLow = 9999999999
        let dayHi = -1

        for (let i = n - 1; i < marketData.length; i += n) {
            xAxis.push(marketData[i].datetime.substring(8, 8 + 4))

            let hiPri = marketData[i].high_price
            let lowPri = marketData[i].low_price

            for (let j = i - n + 1; j < i; j++) {
                hiPri = Math.max(hiPri, marketData[j].high_price)
                lowPri = Math.min(lowPri, marketData[j].low_price)

                dayHi = Math.max(dayHi, marketData[j].high_price)
                dayLow = Math.min(dayLow, marketData[j].low_price)
            }

            let oneCandle = [
                marketData[i-n+1].open_price,
                marketData[i].last_price,
                lowPri,
                hiPri
            ]

            data.push(oneCandle)
        }


        let title = ''
        if (instInfo) {
            title = `${instInfo?.id} ${instInfo?.display_name}`
        }


        return {
            title: {
                text: title
            },
            xAxis: {
                data: xAxis
            },
            yAxis: {
                min: dayLow,
                max: dayHi
            },
            series: [
                {
                    type: 'candlestick',
                    data: data
                    
                }
            ]
        }
    }


    return <Flex vertical
        style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute',
        }}
    >
        <ReactECharts 
            option={ getKChartOption(kInterval) }

            style={{
                margin: 12,
                flexShrink: 0,
                width: '96%',
                height: 600,
            }}
            
        />
    </Flex>


}

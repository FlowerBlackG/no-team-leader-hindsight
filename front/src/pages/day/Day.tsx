import { Flex, Radio, Select, Spin } from "antd";
import { globalHooks } from "../../common/GlobalData";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";
import { useConstructor } from "../../utils/react-functional-helpers";
import { useSearchParams } from "react-router-dom";
import { later } from "../../utils/later";
import { useEffect, useRef, useState } from "react";
import { request } from "../../utils/request";

import ReactECharts from "echarts-for-react";
import { MinuteMarketDataEntry, SecurityBasicInfo } from "../../api/Entities";
import { calculateMA } from "./DayPageUtils";


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

    const [kInterval, setKInterval] = useState(1)
    
    const [searchParams, setSearchParams] = useSearchParams()

    const [loading, setLoading] = useState(false)



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
        setLoading(true)
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
            setLoading(false)
        })
    }




    // Ref: https://echarts.apache.org/examples/en/editor.html?c=candlestick-brush
    function getKChartOption(kInterval: number) {
        let xAxis = []
        let data: any[] = []
        let tradeVolumes = [] as any[]

        let n = Math.min(marketData.length, kInterval)
        if (n < 1)
            n = 1

        let dayLow = 9999999999
        let dayHi = -1

        let counter = 0

        for (let i = n - 1; i < marketData.length; i += n) {
            xAxis.push(marketData[i].datetime.substring(8, 8 + 4))

            if (kInterval === 1) {
                data.push(marketData[i].last_price)
                tradeVolumes.push([counter++, marketData[i].volume, (marketData[i].open_price <= marketData[i].last_price ? 1 : -1)])
                
                dayHi = Math.max(dayHi, marketData[i].high_price)
                dayLow = Math.min(dayLow, marketData[i].low_price)
            }
            else {
                let hiPri = marketData[i].high_price
                let lowPri = marketData[i].low_price
                let tradeVolume = 0

                for (let j = i - n + 1; j < i; j++) {
                    hiPri = Math.max(hiPri, marketData[j].high_price)
                    lowPri = Math.min(lowPri, marketData[j].low_price)

                    dayHi = Math.max(dayHi, marketData[j].high_price)
                    dayLow = Math.min(dayLow, marketData[j].low_price)

                    tradeVolume += marketData[j].volume
                }

                tradeVolumes.push([counter++, tradeVolume, (marketData[i-n+1].open_price <= marketData[i-1].last_price ? 1 : -1)])
                data.push([
                    marketData[i-n+1].open_price,
                    marketData[i].last_price,
                    lowPri,
                    hiPri
                ])
            }
        }


        let title = ''
        if (instInfo) {
            title = `${instInfo?.id} ${instInfo?.display_name}`
        }



        return {
            title: [
                {
                    text: title
                },
            ],

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                position: function (pos: any, params: any, el: any, elRect: any, size: any) {
                    const obj: any = {
                        top: 10
                    };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                }
            },
            axisPointer: {
                link: [
                    {
                    xAxisIndex: 'all'
                    }
                ],
                label: {
                    backgroundColor: '#777'
                }
            },
            brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                    colorAlpha: 0.1
                }
            },
            grid: [
                {
                    left: '10%',
                    right: '8%',
                    height: '50%'
                },
                {
                    left: '10%',
                    right: '8%',
                    top: '63%',
                    height: '16%'
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                },

                {
                    type: 'category',
                    gridIndex: 1,
                    data: xAxis,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    min: 'dataMin',
                    max: 'dataMax'
                }
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: kInterval > 1
                    },
                    min: dayLow,
                    max: dayHi
                },
                {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false }
                }
            ],
            visualMap: {
                show: false,
                seriesIndex: 3,
                dimension: 2,
                pieces: [
                    {
                        value: 1,
                        color: '#ee3f4d'
                    },
                    {
                        value: -1,
                        color: '#43b244'
                    }
                ]
            },
            series: [
                {
                    type: kInterval === 1 ? 'line' : 'candlestick',
                    data: data
                    
                },
                {
                    name: 'MA12',
                    type: 'line',
                    data: calculateMA(12, kInterval, marketData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.2
                    }
                },
                {
                    name: 'MA30',
                    type: 'line',
                    data: calculateMA(30, kInterval, marketData),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.2
                    }
                },
                {
                    name: '成交量',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: tradeVolumes
                }
            ]
        }
    }


    const kIntervalOptions = [
        { value: 1, label: '1分钟' },
        { value: 2, label: '2分钟' },
        { value: 5, label: '5分钟' },
        { value: 15, label: '15分钟' },
        { value: 30, label: '30分钟' },
        { value: 60, label: '60分钟' },
    ];


    return <Flex vertical
        style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute',
        }}
    ><Spin spinning={loading}>


        <Flex style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: '12px 0' }}>

            <span>tick 间隔</span>

            <Radio.Group 
                style={{ marginLeft: 16 }}
                value={kInterval}
                onChange={value => setKInterval(value.target.value)}
                buttonStyle="solid"
            >
                {
                    kIntervalOptions.map(it => 
                        <Radio.Button value={it.value}>
                            {it.label}
                        </Radio.Button>
                    )
                }
            </Radio.Group>

        </Flex>

        <ReactECharts 
            option={ getKChartOption(kInterval) }

            style={{
                margin: 12,
                flexShrink: 0,
                width: '100%',
                height: 600,
            }}
            
        />
    </Spin></Flex>


}

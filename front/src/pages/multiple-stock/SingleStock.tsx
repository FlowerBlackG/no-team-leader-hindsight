import { Flex, Select } from "antd"
import ReactECharts from "echarts-for-react";
import { useState } from "react";
import { MinuteMarketDataEntry } from "../../api/Entities";
import { useConstructor } from "../../utils/react-functional-helpers";
import { later } from "../../utils/later";
import { request } from "../../utils/request";

interface SingleStockViewProps {
    stockSelectOptions: []
}

export function SingleStockView(props: SingleStockViewProps) {

    const [marketData, setMarketData] = useState<MinuteMarketDataEntry[]>([])
    const [loading, setLoading] = useState(true)

    
    function loadMarketData(key: string) {
        // key example: 600000.index
        const instCode = key.split('.')[0]

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
                date: '20240430',
                instId: instCode,
            }
        }).then(data => {
            
            setMarketData(data.minute)
        }).catch(() => {})
        .finally(() => {
            setLoading(false)
        })
    }


    function getKChartOption() {
        let xAxis = []
        let data: any[] = []
        let tradeVolumes = [] as any[]


        let dayLow = 9999999999
        let dayHi = -1

        let counter = 0

        for (let i = 0; i < marketData.length; i ++) {
            xAxis.push(marketData[i].datetime.substring(8, 8 + 4))

            data.push(marketData[i].last_price)
            tradeVolumes.push([counter++, marketData[i].volume, (marketData[i].open_price <= marketData[i].last_price ? 1 : -1)])
            
            dayHi = Math.max(dayHi, marketData[i].high_price)
            dayLow = Math.min(dayLow, marketData[i].low_price)
        }



        return {
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
                },
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
            ],
            yAxis: [
                {
                    scale: true,
                    splitArea: {
                        show: false
                    },
                    min: dayLow,
                    max: dayHi
                }
            ],
            visualMap: {
                show: false,
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
                    type: 'line',
                    data: data
                    
                }
            ]
        }
    }



    return <Flex vertical
        style={{
            height: '100%',
            width: '100%'
        }}
    >
        <Select
            showSearch

            filterOption={(input, option: any) => {
                return option['label'].toLowerCase().includes(input.toLowerCase())
            }}

            style={{
                width: '100%',
                flexShrink: 0
            }}

            placeholder={'下拉选择你的标的'}

            options={props.stockSelectOptions}
            onChange={loadMarketData}
        />

        {
            marketData.length ? 
                
            <ReactECharts 
                option={ getKChartOption() }

                style={{
                    flexShrink: 0,
                    flexGrow: 1,
                    width: '100%',
                    height: 0
                }}
                
            />

            :

            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#7777'
                }}
            >
                暂无数据...
            </div>
        }
    </Flex>
}

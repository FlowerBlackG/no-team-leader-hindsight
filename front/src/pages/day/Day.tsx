import { Flex, Radio, Select, Spin, Button } from "antd";
import { globalHooks } from "../../common/GlobalData";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";
import { useConstructor } from "../../utils/react-functional-helpers";
import { useSearchParams } from "react-router-dom";
import { later } from "../../utils/later";
import { useEffect, useRef, useState, useMemo } from "react";
import { request } from "../../utils/request";

import ReactECharts from "echarts-for-react";
import { MinuteMarketDataEntry, SecurityBasicInfo } from "../../api/Entities";
import { calculateMA } from "./DayPageUtils";

function calculateMACD(data: MinuteMarketDataEntry[], short = 12, long = 26, signal = 9) {
    const closes = data.map(d => d.last_price);
    const x = data.map(d => d.datetime.substring(8, 12));
    let emaShort = 0;
    let emaLong = 0;
    let dea = 0;
    const macd: number[] = [];
    const dif: number[] = [];
    const deaArr: number[] = [];

    closes.forEach((close, i) => {
        if (i === 0) {
            emaShort = close;
            emaLong = close;
        } else {
            emaShort = emaShort * (short - 1) / (short + 1) + close * 2 / (short + 1);
            emaLong = emaLong * (long - 1) / (long + 1) + close * 2 / (long + 1);
        }
        const diff = emaShort - emaLong;
        dif.push(diff);
        dea = dea * (signal - 1) / (signal + 1) + diff * 2 / (signal + 1);
        deaArr.push(dea);
        macd.push((diff - dea) * 2);
    });

    return { x, dif, dea: deaArr, macd };
}

export function DayPage() {
    const pageEntity = PageRouteManager.getRouteEntity('/day');
    const [instCode, setInstCode] = useState('');
    const [date, setDate] = useState('20240430');
    const [marketData, setMarketData] = useState<MinuteMarketDataEntry[]>([]);
    const [instInfo, setInstInfo] = useState<SecurityBasicInfo>();
    const [indexData, setIndexData] = useState<MinuteMarketDataEntry[]>([]);
    const [indexInfo, setIndexInfo] = useState<SecurityBasicInfo>();
    const [kInterval, setKInterval] = useState(1);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showIndex, setShowIndex] = useState(false); //是否显示上证指数
    const [showMACD, setShowMACD] = useState(true); //是否显示MACD
    const [showVolume, setShowVolume] = useState(true); //是否显示每日成交量


   const chartKey = useMemo(() => {
        return `chart-${kInterval}-${showIndex ? 'index' : 'noindex'}-${showMACD ? 'macd' : 'nomacd'}-${showVolume ? 'vol' : 'novol'}`;
   }, [kInterval, showIndex, showMACD, showVolume]);

    useConstructor(() => {
        globalHooks.layoutFrame.setCurrentPageEntity(pageEntity);
        later(() => {
            const code = searchParams.get('code');
            if (!code) {
                globalHooks.app.message.error('参数不对。需要 code。');
                globalHooks.app.navigate(-1);
                return;
            }
            setInstCode(code);
            fetchData(code);
            fetchIndexData();
        });
    });

    function fetchData(code: string) {
        setLoading(true);
        request({
            url: '/minute-data',
            vfOpts: { autoHandleNonOKResults: true, giveResDataToCaller: true, rejectNonOKResults: true },
            method: 'GET',
            params: { date, instId: code }
        }).then(data => {
            setInstInfo(data.instInfo);
            setMarketData(data.minute);
        }).finally(() => setLoading(false));
    }

    function fetchIndexData() {
        request({
            url: '/minute-data',
            vfOpts: { autoHandleNonOKResults: true, giveResDataToCaller: true, rejectNonOKResults: true },
            method: 'GET',
            params: { date, instId: '000001' }
        }).then(data => {
            setIndexInfo(data.instInfo);
            setIndexData(data.minute);
        });
    }


    function getKChartOption(kInterval: number) {
        let data: any[] = [];
        let tradeVolumes: any[] = [];
        let xAxisData: string[] = [];
        let n = Math.max(1, kInterval);
        let dayLow = Number.MAX_SAFE_INTEGER;
        let dayHi = -1;
        let counter = 0;

        for (let i = n - 1; i < marketData.length; i += n) {
            xAxisData.push(marketData[i].datetime.substring(8, 12));
            if (kInterval === 1) {
                data.push(marketData[i].last_price);
                tradeVolumes.push([counter++, marketData[i].volume, marketData[i].open_price <= marketData[i].last_price ? 1 : -1]);
                dayHi = Math.max(dayHi, marketData[i].high_price);
                dayLow = Math.min(dayLow, marketData[i].low_price);
            } else {
                let hiPri = marketData[i].high_price;
                let lowPri = marketData[i].low_price;
                let tradeVolume = 0;
                for (let j = i - n + 1; j <= i; j++) {
                    hiPri = Math.max(hiPri, marketData[j].high_price);
                    lowPri = Math.min(lowPri, marketData[j].low_price);
                    tradeVolume += marketData[j].volume;
                    dayHi = Math.max(dayHi, marketData[j].high_price);
                    dayLow = Math.min(dayLow, marketData[j].low_price);
                }
                tradeVolumes.push([counter++, tradeVolume, marketData[i - n + 1].open_price <= marketData[i].last_price ? 1 : -1]);
                data.push([marketData[i - n + 1].open_price, marketData[i].last_price, lowPri, hiPri]);
            }
        }

        const macd = calculateMACD(marketData);
        const indexSeriesData = indexData.map(d => [d.datetime.substring(8, 12), d.last_price]);

        const grid: any[] = [];
        const xAxis: any[] = [];
        const yAxis: any[] = [];
        const series: any[] = [];
        let currentTop = 8;
        let gridIndex = 0;

        // 主图
        grid.push({ top: `${currentTop}%`, height: '48%', left: '10%', right: '8%' });
        xAxis.push({ type: 'category', boundaryGap: false, data: xAxisData, gridIndex });
        yAxis.push({ scale: true, min: dayLow, max: dayHi, gridIndex });
        series.push({
            type: kInterval === 1 ? 'line' : 'candlestick',
            data,
            xAxisIndex: gridIndex,
            yAxisIndex: gridIndex,
        });
        series.push({
            name: 'MA12',
            type: 'line',
            data: calculateMA(12, kInterval, marketData),
            smooth: true,
            lineStyle: { opacity: 0.2 },
            xAxisIndex: gridIndex,
            yAxisIndex: gridIndex,
        });
        series.push({
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, kInterval, marketData),
            smooth: true,
            lineStyle: { opacity: 0.2 },
            xAxisIndex: gridIndex,
            yAxisIndex: gridIndex,
        });

        gridIndex++;
        currentTop += 50;

        // 成交量
        if (showVolume) {
            grid.push({ top: `${currentTop+3}%`, height: '10%', left: '10%', right: '8%' });
            xAxis.push({ type: 'category', boundaryGap: false, data: xAxisData, gridIndex });
            yAxis.push({ scale: true, gridIndex, splitNumber: 2, show: false });
            series.push({
                name: '成交量',
                type: 'bar',
                data: tradeVolumes,
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex
            });
            gridIndex++;
            currentTop += 12;
        }

        // 指数
        if (showIndex) {
            grid.push({ top: `${currentTop+6}%`, height: '10%', left: '10%', right: '8%' });
            xAxis.push({ type: 'category', boundaryGap: false, data: xAxisData, gridIndex });
            yAxis.push({ scale: true, gridIndex, splitNumber: 2, show: true });
            series.push({
                name: '上证指数',
                type: 'line',
                data: indexSeriesData,
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                lineStyle: { color: 'red' },
                connectNulls: true
            });
            gridIndex++;
            currentTop += 12;
        }

        // MACD

        if (showMACD) {
            grid.push({ top: `${currentTop+8}%`, height: '14%', left: '10%', right: '8%' });
            xAxis.push({ type: 'category', boundaryGap: false, data: macd.x, gridIndex });
            yAxis.push({ scale: true, gridIndex, splitNumber: 2, show: true });
            series.push({
                name: 'MACD',
                type: 'bar',
                data: macd.macd,
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                itemStyle: {
                    color: (params: any) => params.value >= 0 ? '#d13f31' : '#43b244'
                }
            });
            series.push({
                name: 'DIFF',
                type: 'line',
                data: macd.dif,
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                lineStyle: { color: '#ff6f00' }
            });
            series.push({
                name: 'DEA',
                type: 'line',
                data: macd.dea,
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                lineStyle: { color: '#005aff' }
            });
        }

        return {
            title: {
                text: instInfo ? `${instInfo.id} ${instInfo.display_name}` : '',
                left: 12
            },
            tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
            grid,
            xAxis,
            yAxis,
            visualMap: {
                show: false,
                seriesIndex: 3,
                dimension: 2,
                pieces: [
                    { value: 1, color: '#ee3f4d' },
                    { value: -1, color: '#43b244' }
                ]
            },
            series
        };
    }







    const kIntervalOptions = [1, 2, 5, 15, 30, 60].map(v => ({ value: v, label: `${v}分钟` }));

    return (
        <Flex vertical style={{ width: '100%', height: '100%', position: 'absolute'}} className="overflow-y-overlay" >
            <Spin spinning={loading}>
                <Flex style={{ justifyContent: 'center', alignItems: 'center', padding: '12px 0' }}>
                    <span>tick 间隔</span>
                    <Radio.Group
                        style={{ marginLeft: 16 }}
                        value={kInterval}
                        onChange={value => setKInterval(value.target.value)}
                        buttonStyle="solid"
                    >
                        {kIntervalOptions.map(it => (
                            <Radio.Button key={it.value} value={it.value}>{it.label}</Radio.Button>
                        ))}
                    </Radio.Group>
                </Flex>
                <Button onClick={() => setShowIndex(!showIndex)} style={{ marginBottom: 8 }}>
                    {showIndex ? '隐藏' : '显示'} 上证指数
                </Button>
                <Button onClick={() => setShowMACD(!showMACD)} style={{ marginBottom: 12, marginLeft: 12 }}>
                    {showMACD ? '隐藏' : '显示'} MACD
                </Button>
                <Button onClick={() => setShowVolume(!showVolume)} style={{ marginBottom: 12, marginLeft: 12 }}>
                    {showVolume ? '隐藏' : '显示'} 成交量
                </Button>

              <ReactECharts
                    option={getKChartOption(kInterval)}
                    key={chartKey}
                    style={{ width: '100%', height: 900 }}
              />


            </Spin>
        </Flex>
    );
}

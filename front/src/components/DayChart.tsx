import { Button, Flex, Radio } from "antd";
import ReactECharts from "echarts-for-react";
import { useConstructor } from "../utils/react-functional-helpers";
import { later } from "../utils/later";
import { MinuteMarketDataEntry, SecurityBasicInfo } from "../api/Entities";
import { useMemo, useState } from "react";
import { request } from "../utils/request";
import { calculateMA } from "./DayChartUtils";
import { globalHooks } from "../common/GlobalData";


export interface DayChartProps {
    code: string

    // 定义展示多少个 tick 的数据。设为 Number.MAX_SAFE_INTEGER 以显示所有数据
    ticks: number
}



function calculateMACD(
    data: MinuteMarketDataEntry[], 
    ticks = Number.MAX_SAFE_INTEGER, 
    short = 12, 
    long = 26, 
    signal = 9
) {
    const closes = data.map(d => d.last_price);
    const x = data.map(d => d.datetime.substring(8, 12));
    let emaShort = 0;
    let emaLong = 0;
    let dea = 0;
    const macd: number[] = [];
    const dif: number[] = [];
    const deaArr: number[] = [];

    for (let i = 0; i < closes.length; i++) {
        const close = closes[i]

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

        if (macd.length >= ticks)
            break
    }

    return { x, dif, dea: deaArr, macd };
}


export function DayChart(props: DayChartProps) {

    const [marketData, setMarketData] = useState<MinuteMarketDataEntry[]>([]);
    const [instCode, setInstCode] = useState('');
    const [showIndex, setShowIndex] = useState(false); //是否显示上证指数
    const [showMACD, setShowMACD] = useState(true); //是否显示MACD
    const [showVolume, setShowVolume] = useState(true); //是否显示每日成交量
    const [kInterval, setKInterval] = useState(1);
    const [date, setDate] = useState('20240430');
    const [instInfo, setInstInfo] = useState<SecurityBasicInfo>();
    const [indexData, setIndexData] = useState<MinuteMarketDataEntry[]>([]);
    const [indexInfo, setIndexInfo] = useState<SecurityBasicInfo>();

    
    useConstructor(() => {
        later(() => {
            const code = props.code
            setInstCode(code);
            fetchData(code);
            fetchIndexData();
        });
    });

    
    const chartKey = useMemo(() => {
        return `chart-${kInterval}-${showIndex ? 'index' : 'noindex'}-${showMACD ? 'macd' : 'nomacd'}-${showVolume ? 'vol' : 'novol'}`;
    }, [kInterval, showIndex, showMACD, showVolume]);


    function getKChartOption(kInterval: number) {
        let data: any[] = [];
        let tradeVolumes: any[] = [];
        let n = Math.max(1, kInterval);
        let dayLow = Number.MAX_SAFE_INTEGER;
        let dayHi = -1;
        let counter = 0;
        
        const xAxisData = marketData.map(it => it.datetime.substring(8, 12))

        for (let i = n - 1; i < marketData.length && i < props.ticks; i += n) {
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

        const macd = calculateMACD(marketData, props.ticks);

        // ✅ 归一化上证指数
        const baseStockPrice = marketData[0]?.last_price || 1;
        const baseIndexPrice = indexData[0]?.last_price || 1;
        const ratio = baseStockPrice / baseIndexPrice;
        const normalizedIndexSeries = indexData.map(d => [
            d.datetime.substring(8, 12),
            d.last_price * ratio
        ]);

        const grid: any[] = [];
        const xAxis: any[] = [];
        const yAxis: any[] = [];
        const series: any[] = [];
        let currentTop = 8;
        let gridIndex = 0;

        // 主图区域
        grid.push({ top: `${currentTop}%`, height: '40%', left: '10%', right: '8%' });
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
            data: calculateMA(12, kInterval, marketData, props.ticks),
            smooth: true,
            lineStyle: { opacity: 0.2 },
            xAxisIndex: gridIndex,
            yAxisIndex: gridIndex,
        });
        series.push({
            name: 'MA30',
            type: 'line',
            data: calculateMA(30, kInterval, marketData, props.ticks),
            smooth: true,
            lineStyle: { opacity: 0.2 },
            xAxisIndex: gridIndex,
            yAxisIndex: gridIndex,
        });

        // ✅ 将归一化后的上证指数叠加在主图
        if (showIndex) {
            series.push({
                name: '上证指数（归一化）',
                type: 'line',
                data: (
                    props.ticks >= normalizedIndexSeries.length 
                    ? 
                    normalizedIndexSeries 
                    : 
                    normalizedIndexSeries.slice(0, props.ticks)
                ),
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                lineStyle: { color: '#ff9800', width: 1 },
                symbol: 'none',
                connectNulls: true,
                emphasis: { focus: 'series' }
            });
        }

        gridIndex++;
        currentTop += 45;

        // 成交量
        if (showVolume) {
            grid.push({ top: `${currentTop}%`, height: '10%', left: '10%', right: '8%' });
            xAxis.push({ type: 'category', boundaryGap: false, data: xAxisData, gridIndex });
            yAxis.push({ scale: true, gridIndex, splitNumber: 2, show: false });
            series.push({
                name: '成交量',
                type: 'bar',
                data: tradeVolumes,
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                itemStyle: {
                    color: (params: any) => {
                        // 第三个字段是 1 表示上涨，用红色；-1 表示下跌，用绿色
                        return params.data[2] === 1 ? '#ee3f4d' : '#43b244';
                    }
                }
            });
            gridIndex++;
            currentTop += 12;
        }

        // MACD
        if (showMACD) {
            grid.push({ top: `${currentTop + 8}%`, height: '15%', left: '10%', right: '8%' });
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
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' }
            },
            grid,
            xAxis,
            yAxis,
            series
        };
    }

    
    function fetchData(code: string) {
        request({
            url: '/minute-data',
            vfOpts: { autoHandleNonOKResults: true, giveResDataToCaller: true, rejectNonOKResults: true },
            method: 'GET',
            params: { date, instId: code }
        }).then(data => {
            setInstInfo(data.instInfo);
            setMarketData(data.minute);
        })
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


    const kIntervalOptions = [1, 2, 5, 15, 30, 60].map(v => ({ value: v, label: `${v}分钟` }));



    
    if (instCode.length === 0)
        return <div>no code provided.</div>

    return <div style={{ width: '100%', height: '100%', position: 'absolute'}}>
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
            style={{ width: '100%', height: 1000 }}
        />
    </div> 
}

import { useMemo, useState } from "react"
import PageRouteManager from "../../common/PageRoutes/PageRouteManager"
import { OptionsSettings } from "./OptionsSettings"
import { SimpleBackTestEngine, SimpleBackTestEngineOptions } from "../../utils/backtestengine/SimpleBackTestEngine"
import { request } from "../../utils/request"
import { globalHooks } from "../../common/GlobalData"
import { MinuteMarketDataEntry, SecurityBasicInfo } from "../../api/Entities"
import { DayChart } from "../../components/DayChart"
import { Button, Card, InputNumber, Space, Typography } from "antd"
import assert from "assert"
import { PlayCircleOutlined, PlaySquareOutlined, RightOutlined } from "@ant-design/icons"
import { later } from "../../utils/later"




export default function SimpleBacktestPage() {
    const pageEntity = PageRouteManager.getRouteEntity('/simple-backtest')

    const [engineOptions, setEngineOptions] = useState<SimpleBackTestEngineOptions | null>(null)
    const [instInfo, setInstInfo] = useState<SecurityBasicInfo>()
    const [ticks, setTicks] = useState(1)

    const [tradeShares, setTradeShares] = useState<number | null>(null);
    const [tradeLimitPrice, setTradeLimitPrice] = useState<number | null>(null);

    const [availableCapital, setAvailableCapital] = useState(0)
    const [lockedCapital, setLockedCapital] = useState(0)
    const [holdingVolumes, setHoldingVolumes] = useState(0)
    const [shareAssets, setShareAssets] = useState(0)  // 证券市值
    const [avgCost, setAvgCost] = useState(0)
    const [totalAssets, setTotalAssets] = useState(0)

    const [holdingEarn, setHoldingEarn] = useState(0)  // 持仓盈亏

    const [marketData, setMarketData] = useState<MinuteMarketDataEntry[]>([])


    const engine = useMemo(() => {
        if (engineOptions) {
            const engine = new SimpleBackTestEngine(engineOptions)
            loadAllStatisticsFromEngine(engine)
            return engine
        }
        return null
    }, [engineOptions])
    

    if (engineOptions === null || !instInfo || marketData.length === 0) {
        return <OptionsSettings onFinish={(opts) => {
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
                    instId: opts.instCode.substring(0, 6),
                }
            }).then(data => {

                setInstInfo(data['instInfo'])
                setMarketData(data['minute'])
                
                setEngineOptions({
                    initialCapital: opts.capital,
                    marketData: data['minute'],
                    buyFee: opts.buyFee,
                    sellFee: opts.sellFee
                })

                
            }).catch((err) => {
                globalHooks.app.message.error('failed to load data. '.concat(err))
            })
            .finally(() => {
                
            })

        }} />
    }

    
    const assetViewTDStyle = {
        padding: 8,
        textAlign: 'center'
    } as React.CSSProperties


    function loadAllStatisticsFromEngine(eng: SimpleBackTestEngine | null = engine) {
        if (!eng)
            return
        setAvailableCapital(eng.getAvailableCapital())
        setHoldingVolumes(eng.holdingVolume())
        setLockedCapital(eng.getLockedCapital())
        const shareAssets = eng.getCurrentMD().last_price * eng.holdingVolume()
        setShareAssets(shareAssets)
        setTotalAssets(eng.getAvailableCapital() + shareAssets + eng.getLockedCapital())
        setAvgCost(eng.getAvgCost())

        setHoldingEarn((eng.getCurrentMD().last_price - eng.getAvgCost()) * eng.holdingVolume())

        setTradeLimitPrice(eng.getCurrentMD().last_price)
        setTicks(eng.getCurrentMDIndex() + 1)
    }


    return <div
        style={{
            position: 'absolute',
            height: '100%',
            width: '100%'
        }}
        className="overflow-y-overlay"
    >

        { /* K线卡片 */ }
        <Card
            style={{
                position: 'absolute',
                width: 'calc(50% - 16px - 8px)',
                height: 900,
                marginLeft: 16,
                marginTop: 16,
            }}
            hoverable
            className="overflow-y-overlay"
        >
            <DayChart code={instInfo!.id} ticks={ticks} />    
        </Card>

        { /* 交易卡片 */ }
        <Card
            style={{
                position: 'absolute',
                left: 'calc(50% + 8px)',
                width: 'calc(50% - 16px - 8px)',
                height: 600,
                marginTop: 16,
            }}
            hoverable
            className="overflow-y-overlay"
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Instrument Information */}
                <div>
                    <Typography.Title level={3} style={{ marginBottom: '8px' }}>{instInfo.id} {instInfo.display_name}</Typography.Title>
                    
                </div>


                {/* 用户资产 */}
                <div>
                    <Typography.Title level={4} style={{ marginTop: '16px', marginBottom: '8px' }}>资产</Typography.Title>
                    
                    <tr>
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>总资产</Typography.Text>
                            <br />
                            <Typography.Text>{totalAssets.toFixed(2)}</Typography.Text>
                        </td>
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>证券市值</Typography.Text>
                            <br />
                            <Typography.Text>{shareAssets.toFixed(2)}</Typography.Text>
                        </td>
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>锁定资金</Typography.Text>
                            <br />
                            <Typography.Text>{lockedCapital.toFixed(2)}</Typography.Text>
                        </td>
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>可用余额</Typography.Text>
                            <br />
                            <Typography.Text>{availableCapital.toFixed(2)}</Typography.Text>
                        </td>
                    </tr>
                    <tr>
                        
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>持仓盈亏</Typography.Text>
                            <br />
                            <Typography.Text
                                style={{
                                    color: holdingEarn > 0 ? '#ee3f4d' : (holdingEarn === 0 ? '#000' : '#1ba784')
                                }}
                            >
                                {holdingEarn.toFixed(2)}
                            </Typography.Text>
                        </td>
                        
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>持仓数量</Typography.Text>
                            <br />
                            <Typography.Text>{holdingVolumes}</Typography.Text>
                        </td>
                        
                        <td style={assetViewTDStyle}>
                            <Typography.Text strong>成本均价</Typography.Text>
                            <br />
                            <Typography.Text>{avgCost.toFixed(2)}</Typography.Text>
                        </td>
                        
                        <tr>
                            <td style={assetViewTDStyle}>
                                <Typography.Text strong>当前价</Typography.Text>
                                <br />
                                <Typography.Text>{marketData[ticks - 1].last_price.toFixed(2)}</Typography.Text>
                            </td>
                        </tr>
                    </tr>
                    
                </div>

                {/* Order Placement */}
                <div>
                    <Typography.Title level={4} style={{ marginTop: '16px', marginBottom: '8px' }}>交易</Typography.Title>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Typography.Text>数量</Typography.Text>
                        <InputNumber
                            min={100}
                            value={tradeShares}
                            onChange={(value) => setTradeShares(typeof value === 'number' ? value : null)}
                            style={{ width: '100%' }}
                            step={100}
                        />
                        <Typography.Text>限价</Typography.Text>
                        <InputNumber
                            min={marketData.length ? (Math.round(marketData[0].open_price * 0.8 * 100) / 100) : 0.01}
                            max={marketData.length ? Math.round(marketData[0].open_price * 1.2 * 100) / 100 : 0.01}
                            step={0.01}
                            value={tradeLimitPrice}
                            onChange={(value) => setTradeLimitPrice(typeof value === 'number' ? value : null)}
                            style={{ width: '100%' }}
                            formatter={(value) => value ? `${value}` : ''}
                        />
                    </Space>
                </div>

                {/* Action Buttons */}
                <Space style={{ marginTop: '20px', width: '100%' }} >
                    <Button
                        type="primary"
                        
                        onClick={() => {
                            const res = engine!.putOrder({
                                price: tradeLimitPrice!,
                                volume: tradeShares!,
                                orderKind: "buy",
                            })

                            if (res)
                                globalHooks.app.message.success('挂单成功')
                            else
                                globalHooks.app.message.error('挂单失败')

                            loadAllStatisticsFromEngine()
                        }}
                        style={{marginRight: '8px', backgroundColor: '#ee3f4d', borderColor: '#ee3f4d', color: '#fff' }}
                    >
                        买入
                    </Button>
                    <Button
                        onClick={() => {
                            const res = engine!.putOrder({
                                price: tradeLimitPrice!,
                                volume: tradeShares!,
                                orderKind: "sell",
                            })

                            if (res)
                                globalHooks.app.message.success('挂单成功')
                            else
                                globalHooks.app.message.error('挂单失败')

                            loadAllStatisticsFromEngine()
                        }}
                        style={{ 
                            marginRight: '8px', 
                            backgroundColor: '#1ba784', // Green color for Sell
                            borderColor: '#1ba784',
                            color: '#fff',
                        }}
                    >
                        卖出
                    </Button>
                    
                    <Button
                        icon={<RightOutlined />}
                        onClick={() => {
                            if (engine!.tick())
                                setTicks(ticks + 1)

                            loadAllStatisticsFromEngine()
                        }}
                        ghost
                        type="primary"
                        style={{
                            marginRight: '8px', 
                        }}
                    >
                        继续
                    </Button>
                </Space>
            </Space>

        </Card>
    </div>
}
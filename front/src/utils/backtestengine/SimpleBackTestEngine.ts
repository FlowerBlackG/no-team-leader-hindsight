import { number } from "echarts"
import { MinuteMarketDataEntry } from "../../api/Entities"


export interface Fee {
    minimum: number
    rate: number
}

export interface SimpleBackTestEngineOptions {
    // 初始资金
    initialCapital: number

    // 行情数据
    marketData: MinuteMarketDataEntry[]

    buyFee: Fee

    sellFee: Fee
}


export interface Order {
    time: string
    price: number
    volume: number

    /**
     * 锁定资产。
     * 挂买入单，锁定资产为 price * volume + fee
     * 挂卖出单，锁定资产为 0
     */
    capitalLocked: number
    orderKind: 'buy' | 'sell'
    id: number
}


// 持仓
interface Holding {
    // 成交价
    price: number
    // 成本。在成交价基础上，追加手续费
    cost: number
    volume: number
    openTime: string
}


// 清仓记录
interface ClosePositionRecord {
    openTime: string
    openPrice: number
    openCost: number

    volume: number

    closeTime: string
    closePrice: number
    closeCost: number
}


export interface PutOrderOptions {
    price: number;
    volume: number;
    orderKind: 'buy' | 'sell'
}


export class SimpleBackTestEngine {
    protected marketData: MinuteMarketDataEntry[]
    protected buyFee: Fee
    protected sellFee: Fee
    protected nextId = 0

    /**
     * 当前挂单
     */
    protected orders: Order[] = []
    
    /**
     * 已成交记录
     */
    protected traded: Order[] = []
    protected holding: Holding[] = []
    protected closeRecord: ClosePositionRecord[] = []

    protected capital = {
        initial: 0,
        available: 0,
    }

    protected capitalSpentForSecurity = 0  // 用于计算成本均价。

    protected currMDIndex = 0

    protected generateId() {
        return this.nextId++
    }

    constructor(options: SimpleBackTestEngineOptions) {
        this.marketData = [...options.marketData]
        this.buyFee = {...options.buyFee}
        this.sellFee = {...options.sellFee}
        this.capital.initial = options.initialCapital
        this.capital.available = options.initialCapital
    }


    // 撮合
    protected match() {
        let orderIdx = 0
        const md = this.marketData[this.currMDIndex]
        while (orderIdx < this.orders.length) {
            const order = this.orders[orderIdx]

            if (order.orderKind === 'buy' && md.low_price <= order.price) {
                // 买入成交

                const price = Math.min(md.avg_price, order.price)
                const fee = Math.min(this.buyFee.minimum, price * order.volume * this.buyFee.rate)
                const spent = price * order.volume + fee

                const hold = {
                    price: price,
                    cost: spent / order.volume,
                    volume: order.volume,
                    openTime: md.datetime
                }
                this.holding.push(hold)
                this.traded.push(order)

                this.capitalSpentForSecurity += spent

                // refund
                this.capital.available += order.capitalLocked - spent
                
                this.orders.splice(orderIdx, 1)
                orderIdx--
            }
            else if (order.orderKind === 'sell' && md.high_price >= order.price) {
                // 卖出成交

                const price = md.avg_price
            
                let fee = Math.max(this.sellFee.minimum, order.volume * price * this.sellFee.rate)
                let income = Math.max(0, order.volume * price - fee)
                let cost = income / order.volume
                this.capital.available += income
                
                this.capitalSpentForSecurity -= income

                let volumeRemain = order.volume
                let holdingIdx = 0
                while (volumeRemain > 0) {
                    const hold = this.holding[holdingIdx]
                    if (hold.volume <= volumeRemain) {
                        volumeRemain -= hold.volume
                        this.closeRecord.push({
                            openTime: hold.openTime,
                            openPrice: hold.price,
                            openCost: hold.cost,
                            volume: hold.volume,
                            closeTime: md.datetime,
                            closePrice: md.last_price,
                            closeCost: cost
                        })
                        this.holding.splice(holdingIdx, 1)
                    }
                    else {
                        hold.volume -= volumeRemain
                        this.closeRecord.push({
                            openTime: hold.openTime,
                            openPrice: hold.price,
                            openCost: hold.cost,
                            volume: volumeRemain,
                            closeTime: md.datetime,
                            closePrice: md.last_price,
                            closeCost: cost
                        })
                        volumeRemain = 0
                        break
                    }
                }

                this.traded.push(order)
                this.orders.splice(orderIdx, 1)
                orderIdx--
            }

            orderIdx++
        }

        if (this.holding.length === 0)
            this.capitalSpentForSecurity = 0
    }


    holdingVolume(): number {
        let res = 0
        for (const it of this.holding)
            res += it.volume
        return res
    }


    sellableVolume(): number {
        let lockedVolume = 0
        for (const it of this.orders)
            if (it.orderKind === 'sell')
                lockedVolume += it.volume
        return this.holdingVolume() - lockedVolume
    }


    putOrder(options: PutOrderOptions): boolean {
        const orderId = this.generateId();
        let capitalToLock = 0;
        let feeRate = 0;
        let feeMinimum = 0;

        if (options.orderKind === 'buy') {
            feeRate = this.buyFee.rate;
            feeMinimum = this.buyFee.minimum;
            // 预估手续费
            const estimatedFee = Math.max(options.price * options.volume * feeRate, feeMinimum);
            capitalToLock = options.price * options.volume + estimatedFee;

            if (this.capital.available < capitalToLock) {
                return false; // 资金不足
            }
            this.capital.available -= capitalToLock;
        } else {  // sell
            if (this.sellableVolume() < options.volume)
                return false
        }

        const newOrder: Order = {
            id: orderId,
            time: this.marketData[this.currMDIndex].datetime, // Should come from current market data tick
            price: options.price,
            volume: options.volume,
            orderKind: options.orderKind,
            capitalLocked: capitalToLock, // Only relevant for buy orders for capital; for sell, it's asset volume
        };

        this.orders.push(newOrder);
        return true;
    }


    deleteOrder(orderId: number): boolean {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);

        if (orderIndex === -1) {
            return false; // 订单未找到
        }

        const orderToDelete = this.orders[orderIndex];

        // 如果是买单，需要释放锁定的资金
        if (orderToDelete.orderKind === 'buy') {
            this.capital.available += orderToDelete.capitalLocked;
        } else {
            // 卖单撤销，通常不涉及资金的直接返还（因为卖单不锁定资金，而是锁定资产）
            // 如果有更复杂的保证金或资产锁定机制，这里也需要处理
        }

        this.orders.splice(orderIndex, 1); // 从挂单列表中移除
        return true;
    }


    getOrders(): Order[] {
        return this.orders
    }


    getTraded(): Order[] {
        return this.traded
    }


    getClosePositionRecord(): ClosePositionRecord[] {
        return this.closeRecord
    }


    getWinRate(): number {
        let wins = 0
        for (const it of this.closeRecord) {
            if (it.closeCost >= it.openCost)
                wins++
        }

        return wins / this.closeRecord.length
    }


    getTotalAssets(): number {
        let res = this.capital.available
        if (this.currMDIndex < 0)
            return res
        res += this.holdingVolume() * this.marketData[this.currMDIndex].last_price
        return res
    }


    getAvailableCapital(): number {
        return this.capital.available
    }


    getLockedCapital(): number {
        let res = 0
        for (const it of this.orders)
            res += it.capitalLocked
        return res
    }


    getCurrentMD(): MinuteMarketDataEntry {
        return this.marketData[this.currMDIndex]
    }


    getCurrentMDIndex(): number {
        return this.currMDIndex
    }


    getAvgCost(): number {
        if (this.holdingVolume() == 0)
            return 0
        return this.capitalSpentForSecurity / this.holdingVolume()
    }

    tick(): MinuteMarketDataEntry | false {
        // tick to next md
        if (this.currMDIndex + 1 >= this.marketData.length)
            return false
        this.currMDIndex += 1
        
        // 撮合交易
        this.match()

        // return md
        return this.marketData[this.currMDIndex]
    }


}

import { MinuteMarketDataEntry } from "../../api/Entities";




export function calculateMA(dayCount: number, kInterval: number, data: MinuteMarketDataEntry[]) {
    let result = [] as number[]
    for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push(0);
            continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
            sum += data[i - j].last_price;
        }
        result.push(+(sum / dayCount).toFixed(3));
    }


    let intervalResult = [] as number[]
    for (let i = kInterval - 1; i < result.length; i += kInterval) {
        intervalResult.push(result[i])
    }

    return intervalResult
}


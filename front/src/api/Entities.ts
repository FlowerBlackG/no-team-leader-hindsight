// SPDX-License-Identifier: MulanPSL-2.0


/*

    创建于2024年3月13日 上海市嘉定区
*/


export interface UserEntity {
    username: string
}


export interface SecurityBasicInfo {
    id: string
    display_name: string
    inst_type: string
}


export interface MinuteMarketDataEntry {
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

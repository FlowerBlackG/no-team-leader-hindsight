// SPDX-License-Identifier: MulanPSL-2.0
/*

    created on April 19, 2024 at Anting, Jiading Shanghai
*/

import { SeatEntity } from "./Entities"
import { PagedResult } from "./PagedResult"


export interface CreateSeatsResponseDtoEntry {
    uniqueKey: number
    success: boolean
    msg: string
    seatInfo: SeatEntity | null
}

export type CreateSeatsResponseDto =  CreateSeatsResponseDtoEntry[]

export interface CreateSeatsRequestDtoEntry {
    uniqueKey: number
    group?: number
    username?: string
    userid?: number
    skel?: number
    note?: string
}

export type CreateSeatsRequestDto = CreateSeatsRequestDtoEntry[]


export type GetSeatsResponseDtoEntry = {
    username: string
    groupname: string
} & SeatEntity

export type GetSeatsResponseDto = PagedResult<GetSeatsResponseDtoEntry>

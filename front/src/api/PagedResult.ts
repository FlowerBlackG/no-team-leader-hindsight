// SPDX-License-Identifier: MulanPSL-2.0

export interface PagedResult <T> {
    records: T[]
    pageNo: number
    pageSize: number
    total: number
}


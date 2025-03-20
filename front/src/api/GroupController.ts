// SPDX-License-Identifier: MulanPSL-2.0

import { UserGroupEntity } from "./Entities"

export type GetGroupsResponseDtoEntry = {
    membersCount: number
} & UserGroupEntity

export type GetGroupsResponseDto = GetGroupsResponseDtoEntry[]

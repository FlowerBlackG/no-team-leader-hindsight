// SPDX-License-Identifier: MulanPSL-2.0

/* 上财果团团 */

/*
 * 枚举内容应与后端 
 *   entity/BUserPermissionGroupEntity.PermissionGroup
 *   保持一致。
 */


/**
 * 权限枚举。
 */
export enum Permission {
 
    UNDEFINED = 0,

    /**
     * 管理所有用户的权限
     */
    GRANT_PERMISSION = 1,

    /**
     * 创建和删除自己创建的用户
     */
    CREATE_AND_DELETE_USER = 100,

    /**
     * 删除任何用户
     */
    DELETE_ANY_USER = 101,

    /**
     * 创建和删除自己创建的桌面环境
     */
    CREATE_SEAT = 200,

    /**
     * 删除任何 seat
     */
    DELETE_ANY_SEAT = 201,

    /**
     * 编辑任意 seat 的名字
     */
    NAME_ANY_SEAT = 202,

    /**
     * 登录到任意用户的环境
     */
    LOGIN_TO_ANY_SEAT = 203,

    /**
     * 登录到已经被关闭的主机
     */
    LOGIN_TO_DISABLED_SEAT = 204,

    /**
     * 禁用或启用主机。同时包含强制关闭主机的能力
     */
    DISABLE_OR_ENABLE_ANY_SEAT = 205,

    /**
     * 创建组。包含删除自己组的权限。创建后，自动获取组内一切权限
     */
    CREATE_GROUP = 300,

    /**
     * 编辑任意组的组内成员权限
     */
    MODIFY_ANY_GROUP_MEMBERS_PERMISSION = 301,


}


export enum GroupPermission {

    UNDEFINED = 0,

    /**
     * 组内赋权
     */
    GRANT_PERMISSION = 1,

    /**
     * 删除一个组
     */
    DROP_GROUP = 2,

    /**
     * 将用户移入或移出组
     */
    ADD_OR_REMOVE_USER = 100,

    /**
     * 在组内创建主机，以及删除组内任意主机
     */
    CREATE_OR_DELETE_SEAT = 200,

    /**
     * 编辑组内任意 seat 的名字
     */
    NAME_ANY_SEAT = 201,

    /**
     * 登录到组内任意主机
     */
    LOGIN_TO_ANY_SEAT = 202,

    /**
     * 登录到已经被关闭的主机
     */
    LOGIN_TO_DISABLED_SEAT = 203,

    /**
     * 禁用或启用主机。同时包含强制关闭主机的能力
     */
    DISABLE_OR_ENABLE_ANY_SEAT = 204,

    /**
     * 收集指定位置的文件
     */
    COLLECT_FILES = 300,


}


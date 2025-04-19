import { Button, Card, Flex, Input, message, Select, Space } from "antd";
import { useState } from "react";
import { globalHooks } from "../../common/GlobalData";
import { request } from "../../utils/request";
import { SearchOutlined } from "@ant-design/icons";

import styles from './Search.module.css'
import { useConstructor } from "../../utils/react-functional-helpers";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";


const pageData = {
    searchInvokeCount: 0
}


interface SecurityBasicInfo {
    id: string
    display_name: string
    inst_type: string
}


export function SearchPage() {

    const pageEntity = PageRouteManager.getRouteEntity('/search')


    const [searchValue, setSearchValue] = useState<string>()
    const [searchData, setSearchData] = useState<SecurityBasicInfo[]>([])
    const [loading, setLoading] = useState(false)


    useConstructor(constructor)
    function constructor() {
        globalHooks.layoutFrame.setCurrentPageEntity(pageEntity)
    }


    function fetchData() {
        setLoading(true)
        request({
            url: '/security-basic-info',
            method: 'GET',
            params: {
                search: searchValue
            },
            vfOpts: {
                autoHandleNonOKResults: true,
                rejectNonOKResults: true,
                giveResDataToCaller: true
            }
        }).then(untypedData => {
            const data = untypedData as SecurityBasicInfo[]
            setSearchData(data.filter(it => ['stock', 'etf'].includes(it.inst_type) ))
        }).catch(err => {
            globalHooks.app.message.error("无法搜索！")
        }).finally(() => {
            setLoading(false)
        })
    }


    return <Flex vertical
        style={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute',
        }}
    >

        
        <Flex
            style={{
                width: '100%',
                boxSizing: "border-box",
                padding: 16
            }}
        >
            <Input
                placeholder="股票代码或名称"
                style={{
                    marginRight: 16
                }}

                onChange={(e) => {
                    setSearchValue(e.target.value)
                }}
            />

            <Button icon={<SearchOutlined />} type="primary" 
                onClick={fetchData}
                disabled={loading}
            />
        </Flex>

        <Flex vertical
            style={{
                flexShrink: 0,
                flexGrow: 1,
                height: 0
            }}

            className="overflow-y-overlay"
        >
            {
                searchData.map(it => {
                    return <Card
                        style={{
                            position: 'relative',

                            marginLeft: 16,
                            marginRight: 16,
                            marginTop: 16
                        }}
                        hoverable

                        title={it.id + " " + it.display_name}
                    >
                        <Flex>
                            <div>
                                <p>代号：{ it.id }</p>
                                <p>类型：{ it.inst_type }</p>
                            </div>


                            <Space
                                style={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16,

                                }}
                            >
                                <Button type="primary" ghost>单日行情</Button>
                                <Button type="primary" ghost>手动回测</Button>
                                <Button type="primary" ghost>网格模拟</Button>
                            </Space>
                        </Flex>
                    </Card>
                })
            }

            <div style={{ height: 16, flexShrink: 0 }} />
        </Flex>

    </Flex>
}

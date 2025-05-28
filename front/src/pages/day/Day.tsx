import { Flex, Slider, Spin } from "antd";
import { globalHooks } from "../../common/GlobalData";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";
import { useConstructor } from "../../utils/react-functional-helpers";
import { useSearchParams } from "react-router-dom";
import { later } from "../../utils/later";
import { useState } from "react";

import { DayChart } from "../../components/DayChart";


export function DayPage() {
    const pageEntity = PageRouteManager.getRouteEntity('/day');
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [instCode, setInstCode] = useState('');
    const [ticks, setTicks] = useState(245)

    useConstructor(() => {
        globalHooks.layoutFrame.setCurrentPageEntity(pageEntity);
        later(() => {
            const code = searchParams.get('code');
            if (!code) {
                globalHooks.app.message.error('参数不对。需要 code。');
                globalHooks.app.navigate(-1);
                return;
            }
            setInstCode(code);
        });
    });


    return (
        <Flex vertical style={{ width: '100%', height: '100%', position: 'absolute'}} className="overflow-y-overlay" >
            
            <Slider
                style={{
                    marginTop: 16,
                    marginLeft: 16,
                    marginRight: 16
                }}
                onChange={setTicks}
                max={245}
                defaultValue={245}
            />
            <Spin spinning={loading}>
                <DayChart code={instCode} ticks={ticks} />

            </Spin>
        </Flex>
    );
}

// SPDX-License-Identifier: MulanPSL-2.0
// for test only!

import { useState } from "react";
import { useConstructor } from "../../utils/react-functional-helpers";
import { request } from "../../utils/request";
import PageRouteManager from "../../common/PageRoutes/PageRouteManager";

export default function TestPage() {
    const pageEntity = PageRouteManager.getRouteEntity('/test')
    const [txt, setTxt] = useState("")
    const [html, setHtml] = useState("")

    useConstructor(constructor)
    function constructor() {
        request({
            url: 'test/log',
            vfOpts: {
                giveResDataToCaller: true
            }
        }).then(res => {
            setTxt(res)
        
        })
    }


    return <div style={{
        width: '100%', height: '100%',
        position: 'absolute'
    }}>
           
           <div dangerouslySetInnerHTML={{__html: txt}} />
        
    </div>
}

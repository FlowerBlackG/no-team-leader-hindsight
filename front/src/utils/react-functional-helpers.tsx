// SPDX-License-Identifier: MulanPSL-2.0

/*
 * 
 * 创建于2024年3月4日 上海市嘉定区
 */

import { ForwardedRef, useState } from "react"


export const useConstructor = (callback = () => {}) => {
    const [hasBeenCalled, setHasBeenCalled] = useState(false)
    if (hasBeenCalled) {
        return
    }

    callback()
    setHasBeenCalled(true)
}

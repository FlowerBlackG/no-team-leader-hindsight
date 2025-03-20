/* SPDX-License-Identifier: MulanPSL-2.0 */
/*

    created on 2024.8.18 at Yushan, Shangrao, Jiangxi
*/


export interface LightIndicatorProps {
    color?: 'grey' | 'green' | 'red'

}

export function LightIndicator(props: LightIndicatorProps) {
    const indicatorSize = 16
    const indicatorStyleShared = {
        width: indicatorSize,
        height: indicatorSize,
        borderRadius: '100%',
        marginRight: 16,
        transition: '0.4s'
    } as React.CSSProperties

    const indicatorStyle = {
        grey: {
            ...indicatorStyleShared,
            background: '#474b4c',
            boxShadow: '0 0 12px 2px #474b4c40'
        } as React.CSSProperties,
        
        green: {
            ...indicatorStyleShared,
            background: '#43b244',
            boxShadow: '0 0 12px 2px #43b24440'
        } as React.CSSProperties,

        red: {
            ...indicatorStyleShared,
            background: '#ee3f4d',
            boxShadow: '0 0 12px 2px #ee3f4d40'
        } as React.CSSProperties
    }

    return <div style={ indicatorStyle[props.color ? props.color : 'grey'] } />
}

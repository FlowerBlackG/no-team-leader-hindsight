/* SPDX-License-Identifier: MulanPSL-2.0 */

/*

    创建于2024年4月5日 上海市嘉定区
*/

import Random from "../../utils/Random"


const buttonStyleShared = {
    normal: {

        // background-color

        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        borderRadius: 24,
        height: 40,
        fontSize: 'larger',
        userSelect: 'none',
        boxShadow: '0 4px 10px #2f90b97f',
        transition: '0.2s',
    } as React.CSSProperties,

    hover: {

        // background-color
    } as React.CSSProperties,

    active: {
        opacity: 0.72
    } as React.CSSProperties
}


interface LoginPageBackgroundEntry {
    title: string
    url: string
    photographer: string
    location: string
    description: string
    colors: {
        button: {
            normal: string
            boxShadow: string
            hover: string
        }
    }
    styles?: {
        button: {
            normal: React.CSSProperties
            hover: React.CSSProperties
            active: React.CSSProperties
        }
    }
}


export class LoginPageBackgroundManager {

    private entries : LoginPageBackgroundEntry[] = [
        {  // idx: 0
            title: '嘉定校区鸟瞰',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20231208_123408.1.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区图书馆14层',
            description: '',
            colors: {
                button: {
                    normal: '#2486b9',
                    boxShadow: '',
                    hover: '#1177b0'
                }
            }
        },

        {
            title: '肖四',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20231211_125623.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区安楼',
            description: '',
            colors: {
                button: {
                    normal: '#e8b004',
                    boxShadow: '',
                    hover: '#d9a40e'
                }
            }
        },

        {
            title: '旷',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230727_185858.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区图书馆',
            description: '',
            colors: {
                button: {
                    normal: '#c8adc4',
                    boxShadow: '',
                    hover: '#d1c2d3'
                }
            }
        },

        {
            title: '水杉',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20210412_092042.webp',
            photographer: '2051565GTY',
            location: '同济大学四平路校区中央大道',
            description: '',
            colors: {
                button: {
                    normal: '#41ae3c',
                    boxShadow: '',
                    hover: '#20894d'
                }
            }
        },

        {
            title: '樱花冰糖',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20210326_183307.webp',
            photographer: '2051565GTY',
            location: '同济大学四平路校区樱花大道',
            description: '',
            colors: {
                button: {
                    normal: '#2f2f35',
                    boxShadow: '',
                    hover: '#2e317c'
                }
            }
        },

        {  // idx: 5
            title: '耶！',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20240329_144332.webp',
            photographer: '2051565GTY',
            location: '同济大学设计创意学院深海探索馆',
            description: '',
            colors: {
                button: {
                    normal: '#ee3f4d',
                    boxShadow: '',
                    hover: '#ed556a'
                }
            }
        },


        {
            title: '瑞安楼',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20240402_124000.webp',
            photographer: '2051565GTY',
            location: '同济大学四平路校区赤峰路门',
            description: '',
            colors: {
                button: {
                    normal: '#f07c82',
                    boxShadow: '',
                    hover: '#f1939c'
                }
            }
        },

        {  // idx: 7
            title: '快逃！',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20240530_110742.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区校前区',
            description: '',
            colors: {
                button: {
                    normal: '#ee3f4d',
                    boxShadow: '',
                    hover: '#ed556a'
                }
            }
        },

        {
            title: '快逃！',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/P1230254.webp',
            photographer: '2054011WYX',
            location: '同济大学嘉定校区校前区',
            description: '',
            colors: {
                button: {
                    normal: '#ee3f4d',
                    boxShadow: '',
                    hover: '#ed556a'
                }
            }
        },

        {  // idx: 9
            title: '樱花猫猫',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20210326_180029.webp',
            photographer: '2051565GTY',
            location: '同济大学四平路校区樱花大道',
            description: '',
            colors: {
                button: {
                    normal: '#f07c82',
                    boxShadow: '',
                    hover: '#f1939c'
                }
            }
        },


        
        {  // idx: 10
            title: '安楼',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230307_102609.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区安楼',
            description: '',
            colors: {
                button: {
                    normal: '#8abcd1',
                    boxShadow: '',
                    hover: '#5cb3cc'
                }
            }
        },
        
        {  // idx: 11
            title: '隐春深',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230415_150300.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区艺术与传媒学院',
            description: '',
            colors: {
                button: {
                    normal: '#229453',
                    boxShadow: '',
                    hover: '#66c18c'
                }
            }
        },
        
        {  // idx: 12
            title: '照亮',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230508_180213.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区智信馆',
            description: '',
            colors: {
                button: {
                    normal: '#fca106',
                    boxShadow: '',
                    hover: '#dc9123'
                }
            }
        },
        
        {  // idx: 13
            title: '嘉定校区图书馆',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20231122_183343.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区蝴蝶桥',
            description: '',
            colors: {
                button: {
                    normal: '#4f4032',
                    boxShadow: '',
                    hover: '#66462a'
                }
            }
        },
        
        {  // idx: 14
            title: '落日',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230802_183026.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区图书馆',
            description: '',
            colors: {
                button: {
                    normal: '#5698c3',
                    boxShadow: '',
                    hover: '#2177b8'
                }
            }
        },
        
        {  // idx: 15
            title: '贴贴',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230802_191106.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区图书馆（7层）',
            description: '',
            colors: {
                button: {
                    normal: '#7a7374',
                    boxShadow: '',
                    hover: '#5e616d'
                }
            }
        },
        
        {  // idx: 16
            title: '烧！',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20230919_180324.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区博楼',
            description: '',
            colors: {
                button: {
                    normal: '#815c94',
                    boxShadow: '',
                    hover: '#7e1671'
                }
            }
        },
        
        {  // idx: 17
            title: '阳光',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20231124_125103.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区图书馆草坪',
            description: '',
            colors: {
                button: {
                    normal: '#daa45a',
                    boxShadow: '',
                    hover: '#e7a23f'
                }
            }
        },
        
        {  // idx: 18
            title: '好困啊啊！！',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20240316_120846.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区友园19-20号楼',
            description: '',
            colors: {
                button: {
                    normal: '#f28e16',
                    boxShadow: '',
                    hover: '#f9a633'
                }
            }
        },
        
        {  // idx: 19
            title: '描绘',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20240323_110020.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区安楼',
            description: '',
            colors: {
                button: {
                    normal: '#c08eaf',
                    boxShadow: '',
                    hover: '#a35c8f'
                }
            }
        },
        
        {  // idx: 20
            title: '嘉图四季',
            url: 'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/jiading-lib-seasons.webp',
            photographer: '2051565GTY',
            location: '同济大学嘉定校区图书馆（14层）',
            description: '',
            colors: {
                button: {
                    normal: '#1a94bc',
                    boxShadow: '',
                    hover: '#158bb8'
                }
            }
        },

/*
        {
            title: '',
            url: '',
            colors: {
                button: {
                    normal: '',
                    boxShadow: '',
                    hover: ''
                }
            }
        },
*/
    ]


    private backgroundEntry = null as LoginPageBackgroundEntry | null
    private constructor() {
        for (let it of this.entries) {
            let boxShadowColor = it.colors.button.boxShadow
            if (boxShadowColor.length === 0) {
                boxShadowColor = `${it.colors.button.normal}7f`
            }
            let buttonStyleNormal = {
                ...buttonStyleShared.normal,
                backgroundColor: it.colors.button.normal,
                boxShadow: `0 4px 10px ${boxShadowColor}`
            } as React.CSSProperties

            let buttonStyleHover = {
                ...buttonStyleNormal,
                ...buttonStyleShared.hover,
                backgroundColor: it.colors.button.hover
            } as React.CSSProperties

            let buttonStyles = {
                normal: buttonStyleNormal,
                hover: buttonStyleHover,
                active: {
                    ...buttonStyleHover,
                    ...buttonStyleShared.active
                } as React.CSSProperties
            }

            it.styles = {
                button: buttonStyles
            }
        }

        this.random()
        
    }


    private static _instance: LoginPageBackgroundManager


    static get instance(): LoginPageBackgroundManager {
        if (!LoginPageBackgroundManager._instance) {
            LoginPageBackgroundManager._instance = new LoginPageBackgroundManager()
        }

        return LoginPageBackgroundManager._instance
    }

    
    random() {
        this.backgroundEntry = Random.randElement(this.entries)
    }

    get background(): LoginPageBackgroundEntry {
        return this.backgroundEntry!
    }

    get all() {
        return this.entries
    }

}



/* SPDX-License-Identifier: MulanPSL-2.0 */

/*

    创建于2024年3月14日 上海市嘉定区
*/


import { useState } from 'react'
import PageRouteManager from '../../common/PageRoutes/PageRouteManager'
import styles from './MyInfo.module.css'
import { useConstructor } from '../../utils/react-functional-helpers'
import { Avatar, Button, Input, Modal, Spin, Typography } from 'antd'
import { UserEntity } from '../../api/Entities'
import { ensureGlobalData, globalData, globalHooks } from '../../common/GlobalData'
import DateTimeUtils from '../../utils/DateTimeUtils'
import { request } from '../../utils/request'

const { Text } = Typography

interface MyProfilePageState {
    userInfo: UserEntity | null
}

export default function MyProfilePage() {
    const pageEntity = PageRouteManager.getRouteEntity('/my-profile')


    /* states */

    const [state, setState] = useState<MyProfilePageState>({
        userInfo: globalData.userEntity
    })
    const [changePwDialogOpen, setChangePwDialogOpen] = useState(false)


    function constructor() {
        ensureGlobalData().then(() => {
            state.userInfo = globalData.userEntity
            setState({...state})
        }).catch(() => {})
    }
    useConstructor(constructor)


    /* render */


    function settings(): React.ReactNode {
        const commonMargin = <div style={{ height: 12 }} />
        const commonWidth = 200

        return <div
            style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex'
            }}
        >
            <Button type='primary' shape='round'
                style={{
                    width: commonWidth,
                    maxWidth: '90%'
                }}
                onClick={() => setChangePwDialogOpen(true)}
            >
                修改密码
            </Button>

            <ChangePWDialog
                open={changePwDialogOpen}
                onClose={() => setChangePwDialogOpen(false)}
            />

        </div>
    
    }


    const avatarWidth = 100

    return <div
        style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
        className='overflow-y-overlay'
    >

        <div style={{height: 64}} />

        <Avatar 
            shape='square'
            src={ 
                'https://i0.wp.com/chiikawahk.com/wp-content/uploads/2023/12/image-3.png' // todo: copyright
                //'https://canfish.oss-cn-shanghai.aliyuncs.com/app/vesper-front/20231208_123408.1.webp' 
            } 
            style={{
                height: avatarWidth,
                width: avatarWidth,
            }}
        />


        <div style={{height: 16}} />

        <Text style={{
            fontSize: 22
        }}>
            { state.userInfo?.username }
        </Text>

        <div style={{height: 16}} />


        { settings() }
    </div>
}



/* ------------ ChangePWDialog ------------ */

interface ChangePWDialogProps {
    onClose: () => void
    open: boolean
}

function ChangePWDialog(props: ChangePWDialogProps) {


    const [confirmLoading, setConfirmLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [oldPw, setOldPw] = useState("")
    const [newPw, setNewPw] = useState("")
    const [newPwConfirm, setNewPwConfirm] = useState("")

    return <Modal
        destroyOnClose={true}
        title="修改密码"
        open={props.open}
        centered={true}
        onCancel={props.onClose}
        confirmLoading={confirmLoading}
        onOk={() => {
            if (newPw !== newPwConfirm) {
                globalHooks.app.message.error("两次输入的新密码不一致")
                return
            }

            setConfirmLoading(true)

            request({
                url: 'user/changePassword',
                method: 'post',
                vfOpts: {
                    rejectNonOKResults: true,
                    autoHandleNonOKResults: true,
                    giveResDataToCaller: true
                },
                data: {
                    oldPw: oldPw,
                    newPw: newPw
                }
            }).then(res => {

                globalHooks.app.message.success("修改成功")
                props.onClose()
            }).catch(err => {

            }).finally(() => {
                setConfirmLoading(false)
            })
            
        }}
    >
        <p>修改密码</p>


        <Input.Password
            placeholder='旧密码'
            onChange={(event) => {
                setOldPw(event.target.value)
            }}
        />

        <Input.Password
            placeholder='新密码'
            style={{ marginTop: 16 }}
            onChange={(event) => {
                setNewPw(event.target.value)
            }}
        />


        <Input.Password
            placeholder='再输入一遍新密码'
            style={{ marginTop: 16 }}
            onChange={(event) => {
                setNewPwConfirm(event.target.value)
            }}
            status={ newPwConfirm === newPw ? '' : 'error' }
        />

    </Modal>
}


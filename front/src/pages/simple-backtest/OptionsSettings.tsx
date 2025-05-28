import { Button, Card, Col, Form, InputNumber, Row } from "antd"
import { Fee } from "../../utils/backtestengine/SimpleBackTestEngine"
import { Typography } from 'antd';
import { SelectStock } from "../../components/SelectStock";
import { useState } from "react";

const { Title } = Typography;


interface Options {
    instCode: string
    capital: number
    sellFee: Fee
    buyFee: Fee
}


interface OptionsSettingsProps {
    onFinish: (options: Options) => void
}

export function OptionsSettings(props: OptionsSettingsProps) {


    const [instCode, setInstCode] = useState('600000')

    const [form] = Form.useForm();

    const handleFormFinish = (values: any) => {
        const options: Options = {
            instCode: instCode,
            capital: values.capital,
            buyFee: {
                minimum: values.buyFeeMinimum,
                rate: values.buyFeeRate,
            },
            sellFee: {
                minimum: values.sellFeeMinimum,
                rate: values.sellFeeRate,
            },
        };
        props.onFinish(options);
    };

    // 设置表单初始值
    const formInitialValues = {
        capital: 100000,
        buyFeeMinimum: 0,
        buyFeeRate: 0.0003,
        sellFeeMinimum: 0,
        sellFeeRate: 0.0003,
        instCode: instCode,
    };

    return <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>交易参数设置</Title>
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFormFinish}
            initialValues={formInitialValues}
        >
            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="capital"
                        label="初始资金 (元)"
                        rules={[{ required: true, message: '请输入初始资金!' }, { type: 'number', min: 0, message: '资金不能为负!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="例如: 100000" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="instCode"
                        label="投资标的"
                        rules={[{ required: true, message: '请选择投资标的!' }]}
                    >
                        <SelectStock onChange={setInstCode} />
                    </Form.Item>
                </Col>
            </Row>

            <Title level={4} style={{ marginTop: '20px', marginBottom: '15px' }}>买入手续费</Title>
            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="buyFeeRate"
                        label="费率 (例如: 万分之三填 0.0003)"
                        rules={[{ required: true, message: '请输入买入费率!' }, { type: 'number', min: 0, max: 1, message: '费率应在0和1之间!' }]}
                    >
                        <InputNumber step={0.0001} style={{ width: '100%' }} placeholder="例如: 0.0003" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="buyFeeMinimum"
                        label="最低收费 (元)"
                        rules={[{ required: true, message: '请输入买入最低收费!' }, { type: 'number', min: 0, message: '最低收费不能为负!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="例如: 5" />
                    </Form.Item>
                </Col>
            </Row>

            <Title level={4} style={{ marginTop: '20px', marginBottom: '15px' }}>卖出手续费</Title>
            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="sellFeeRate"
                        label="费率 (例如: 万分之三填 0.0003)"
                        rules={[{ required: true, message: '请输入卖出费率!' }, { type: 'number', min: 0, max: 1, message: '费率应在0和1之间!' }]}
                    >
                        <InputNumber step={0.0001} style={{ width: '100%' }} placeholder="例如: 0.0003" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="sellFeeMinimum"
                        label="最低收费 (元)"
                        rules={[{ required: true, message: '请输入卖出最低收费!' }, { type: 'number', min: 0, message: '最低收费不能为负!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="例如: 5" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{ marginTop: '30px', textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" size="large" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
                    开始交易
                </Button>
            </Form.Item>
        </Form>
        
    </div>
}

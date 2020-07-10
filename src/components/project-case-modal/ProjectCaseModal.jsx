import React, { Component } from 'react';
import './projectCaseModal.scss'
import { Input, Form, Select, Button, Tabs, message, Spin } from 'antd'
import Host from './Host'
import ReactJson from 'react-json-view'
import RequestArgsModal from './RequestArgsModal'
import { getStrDataFromJson, getJsonDataFromStr } from '../../util/commonUtil'
import { singleCaseDebug } from '../../api/index'
const { TabPane } = Tabs;
class ProjectCaseModal extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef()
        this.initValue = this.props.initValue
        this.state = {
            responseResult: null,
            isWaitingRes: false
        }
    }
    handleSubmit = async (value) => {
        this.setState({ isWaitingRes: true })
        let res = await singleCaseDebug(value)
        this.setState({ isWaitingRes: false })
        if (res.status === 1) {
            this.setState({ responseResult: getJsonDataFromStr(res.data) })
        } else {
            message.warning(res.error)
        }
    }

    hostValidator = (rule, value) => {
        if (value) {
            if (value.isUseEnv) {
                if (value.envHost) {
                    return Promise.resolve()
                } else {
                    return Promise.reject('必填')
                }
            } else {
                if (value.requestHost) {
                    return Promise.resolve()
                } else {
                    return Promise.reject('必填')
                }
            }
        } else {
            return Promise.reject('必填')
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 15
            },
        }
        return (
            <div className='project-case-body'>
                <div className='project-case-body-left'>
                    <Form
                        {...formItemLayout}
                        onFinish={this.handleSubmit}
                        name='projecrCase'
                        ref={this.formRef}
                        initialValues={
                            {
                                caseName: this.initValue.caseName,
                                requestMehod: this.initValue.requestMehod,
                                requestPath: this.initValue.requestPath,
                                requestHost: this.initValue.requestHost,
                                requestHeaders: this.initValue.requestHeaders || [],
                                requestQuery: this.initValue.requestQuery || [],
                                requestBody: this.initValue.requestBody || [],
                            }
                        }
                    >
                        <Form.Item
                            name='caseName'
                            label='用例名称'
                            rules={[{ required: true, message: '必填' }]}
                        >
                            <Input placeholder='请输入用例名称' autoComplete="off"/>
                        </Form.Item>
                        <Form.Item
                            name='requestMehod'
                            label='请求方式'
                            rules={[{ required: true, message: '必填' }]}
                            wrapperCol={{
                                span: 6
                            }}
                        >
                            <Select
                                placeholder='请求方式'
                                className='project-case-card-title-select-method'
                                bordered={true}
                            >
                                <Select.Option value={1}>Get</Select.Option>
                                <Select.Option value={2}>Post</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='requestPath'
                            label='请求路径'
                            rules={[{ required: true, message: '必填' }]}
                        >
                            <Input placeholder='请输入请求地址' autoComplete="off"/>
                        </Form.Item>
                        <Form.Item
                            name='requestHost'
                            label='请求域名'
                            required={true}
                            rules={[{ validator: this.hostValidator }]}
                        >
                            <Host projectId={this.props.projectId}/>
                        </Form.Item>
                        <Form.Item
                            name='requestHeaders'
                            label='请求头部'
                        >
                            <RequestArgsModal />
                        </Form.Item>
                        <Form.Item
                            name='requestQuery'
                            label='请求参数'
                        >
                            <RequestArgsModal />
                        </Form.Item>
                        <Form.Item
                            name='requestBody'
                            label='请求主体'
                        >
                            <RequestArgsModal />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 10 }}>
                            <Button type='primary' htmlType="submit">调试</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='project-case-body-right'>
                    <span >响应结果:</span>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Rows" key="1">
                            <div style={{
                                border: '1px solid #d9d9d9',
                                height: 300,
                                overflowY: 'scroll'
                            }}>
                                {this.state.isWaitingRes ?
                                    <Spin style={{marginTop:135,marginLeft:140}}/>
                                    :
                                    <span>{getStrDataFromJson(this.state.responseResult)}</span>
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="Json" key="2">
                            <div style={{
                                border: '1px solid #d9d9d9',
                                height: 300,
                                overflowY: 'scroll'
                            }}>
                                {this.state.isWaitingRes ?
                                    <Spin style={{marginTop:135,marginLeft:140}}/>
                                    :
                                    <ReactJson
                                        src={this.state.responseResult}
                                        name={false}
                                        displayDataTypes={false}
                                        displayObjectSize={false}
                                    />
                                }

                            </div>

                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
export default ProjectCaseModal;
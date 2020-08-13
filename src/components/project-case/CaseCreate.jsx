import React, {Component} from 'react';
import {Form,Input,Row,Col,TreeSelect,Select} from 'antd'
import TableForm from "./TableForm";
import {priorityEnum} from '../../util/projectEnum'

class CaseCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.form=React.createRef()
    };



    render() {
        var initSteps = []
        if (this.props.currentCase.steps){
            this.props.currentCase.steps.forEach((item,index)=>{
                item.key=index+1
                initSteps.push(item)
            })
        }
        initSteps.push({key:initSteps.length+1,step:null,exception:null})
        const currentModule=this.props.currentModule.length===0?undefined:this.props.currentModule[0]
        return (
            <Form
                labelAlign={"left"}
                ref={this.form}
                initialValues={{
                    caseName:this.props.currentCase.name,
                    caseModule:this.props.currentCase.module_id||currentModule,
                    priority:this.props.currentCase.priority?this.props.currentCase.priority.toString():undefined,
                    precondition:this.props.currentCase.precondition,
                    remark:this.props.currentCase.remark,
                    caseStep:initSteps
                }}
            >
                <Row>
                    <Col
                        span={12}
                    >
                        <Form.Item
                            labelCol={{span:5}}
                            wrapperCol={{span:12}}
                            label={'用例名称'}
                            name={'caseName'}
                            rules={[{required:true,message:'必填!'}]}
                        >
                            <Input autoComplete={'off'} placeholder={'请输入用例名称'}/>
                        </Form.Item>
                    </Col>
                    <Col
                        span={12}
                    >
                        <Form.Item
                            labelCol={{span:5}}
                            wrapperCol={{span:10}}
                            label={'所属模块'}
                            name={'caseModule'}
                            rules={[{required:true,message:'必填!'}]}
                        >
                            <TreeSelect
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.props.moduleTree}
                                placeholder="请选择模块"
                                treeDefaultExpandAll
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        span={12}
                    >
                        <Form.Item
                            labelCol={{span:5}}
                            wrapperCol={{span:8}}
                            label={'优先级'}
                            name={'priority'}
                            rules={[{required:true,message:'必填!'}]}
                        >
                            <Select
                                placeholder='请选择优先级'
                                bordered={true}
                            >
                                {Object.keys(priorityEnum).map(key=>{
                                    return (
                                        <Select.Option value={key} key={key}>
                                            {priorityEnum[key]}
                                        </Select.Option>
                                        )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col
                        span={24}>
                        <p style={{color:'#000000D9'}}>前置条件:</p>
                    </Col>
                    <Col
                        span={24}
                    >
                        <Form.Item
                            name={'precondition'}
                        >
                            <Input.TextArea
                                placeholder='请输入前置条件'
                                allowClear={true}
                                autoSize={{minRows: 2, maxRows: 6}}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        span={24}>
                        <p style={{color:'#000000D9'}}>用例步骤:</p>
                    </Col>
                    <Col
                        span={24}
                    >
                        <Form.Item
                            name={'caseStep'}
                        >
                            <TableForm />
                        </Form.Item>
                    </Col>
                    <Col
                        span={24}>
                        <p style={{color:'#000000D9'}}>备注:</p>
                    </Col>
                    <Col
                        span={24}
                    >
                        <Form.Item
                            name={'remark'}
                        >
                            <Input.TextArea
                                placeholder='请输入用例备注'
                                allowClear={true}
                                autoSize={{minRows: 2, maxRows: 6}}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default CaseCreate;
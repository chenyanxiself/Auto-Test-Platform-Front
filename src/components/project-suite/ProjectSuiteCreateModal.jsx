import React, {Component} from 'react';
import {Form,Input} from 'antd'
class ProjectSuiteCreateModal extends Component {
    constructor(props) {
        super(props);
        this.form = React.createRef()
        this.state = {};
    };

    render() {
        return (
            <Form ref = {this.form}>
                <Form.Item
                    label={'名称'}
                    labelCol={{span:4}}
                    wrapperCol={{span:14}}
                    rules={[{required:true,message:'必填'}]}
                    name={'suiteName'}
                >
                    <Input placeholder={'请输入测试集名'} autoComplete={'off'}/>
                </Form.Item>
            </Form>
        );
    };
}

export default ProjectSuiteCreateModal;
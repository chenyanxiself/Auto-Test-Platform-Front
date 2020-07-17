import React, {Component} from 'react';
import ProjectImgUpload from '../project-img-upload/ProjectImgUpload'
import {Form, Input, Button, message} from 'antd'
import {connect} from 'react-redux'
import {createProject} from '../../api/index'
import ProjectMember from '../project-member/ProjectMember'

class ProjectCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMemberModalVisible: false,
        }
        this.memberRef = React.createRef()
    }

    handleSubmit = async (value) => {
        const projectMember = value.projectMember.map(item => {
            return item.id
        })
        const res = await createProject({...value, projectMember})
        if (res.status === 1) {
            message.success('新建项目成功')
            this.props.closeModal()
            this.props.reloadData()
        } else {
            message.warning(res.error)
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 11
            },
        }
        return (
            <div>
                <Form
                    {...formItemLayout}
                    onFinish={this.handleSubmit}
                    name='projectForm'
                    initialValues={{
                        projectMember: [{
                            id: this.props.user.id,
                            cname: this.props.user.cname,
                            briefName: this.props.user.cname.substring(this.props.user.cname.length - 2, this.props.user.cname.length),
                            disabled: true,
                        }]
                    }}
                >
                    <Form.Item
                        name='projectName'
                        label='项目名称'
                        rules={[{required: true, message: '必填'}]}
                    >
                        <Input placeholder='请输入项目名称' autoComplete="off"/>
                    </Form.Item>
                    <Form.Item
                        name='projectDesc'
                        label='项目简介'
                    >
                        <Input.TextArea
                            placeholder='请输入项目简介'
                            allowClear={true}
                            autoSize={{minRows: 4, maxRows: 6}}
                            maxLength={200}
                        />
                    </Form.Item>
                    <Form.Item
                        label='项目成员'
                        name='projectMember'
                    >
                        <ProjectMember/>
                    </Form.Item>
                    <Form.Item
                        label='项目封面'
                        name='projectImg'
                    >
                        <ProjectImgUpload/>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 10}}>
                        <Button type='primary' htmlType="submit">确认新建</Button>
                    </Form.Item>
                </Form>

            </div>
        );
    }
}

export default connect(
    state => ({
        user: state.user
    }),
    null
)(ProjectCreate);
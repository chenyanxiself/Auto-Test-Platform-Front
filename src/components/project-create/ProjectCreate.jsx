import React, { Component } from 'react';
import ProjectImgUpload from '../project-img-upload/ProjectImgUpload'
import { Form, Input, Button, Modal, Avatar, Tooltip,message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import MemberTransfer from '../../components/member-transfer/MemberTransfer'
import { connect } from 'react-redux'
import './projectCreate.scss'
import {setCreateProjectMember} from '../../store/actionFactory'
import {createProject} from '../../api/index'

class ProjectCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMemberModalVisible: false,
        }
        this.memberRef = React.createRef()
    }
    handleSubmit = async (value) => {
        const projectMember = this.props.projectMember.map(item=>{
            return item.id
        })
        const projectImg = this.props.projectImg
        const res = await createProject({...value,projectImg,projectMember})
        if(res.status===1){
            message.success('新建项目成功')
            this.props.closeModal()
            this.props.reloadData()
        }else{
            message.warning('新建项目失败'+res.error)
        }
    }
    onMemberTransferClick = () => {
        this.props.setCreateProjectMember(this.memberRef.current.getSelectedMember())
        this.setState({ isMemberModalVisible: false })
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
                >
                    <Form.Item
                        name='projectName'
                        label='项目名称'
                        rules={[{ required: true, message: '必填' }]}
                    >
                        <Input placeholder='请输入项目名称' autoComplete="off"></Input>
                    </Form.Item>
                    <Form.Item
                        name='projectDesc'
                        label='项目简介'
                    >
                        <Input.TextArea
                            placeholder='请输入项目简介'
                            allowClear={true}
                            autoSize={{minRows:4,maxRows:6}}
                            maxLength={200}
                        />
                    </Form.Item>
                    <Form.Item
                        label='项目成员'
                    >
                        <div style={{ alignItems: 'center', display: 'flex' }}>
                            {this.props.projectMember.map((item,index) => {
                               return ( <Tooltip title={item.cname} key={index+1}>
                                    <Avatar
                                        className='project-create-form-member-avatar'
                                    >{item.briefName}</Avatar>
                                </Tooltip>)
                            })}
                            <Button
                                style={{ float: "left" }}
                                shape='circle'
                                icon={<PlusOutlined />}
                                size='small'
                                onClick={() => this.setState({ isMemberModalVisible: true })}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        label='项目封面'
                    >
                        <ProjectImgUpload />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 10 }}>
                        <Button type='primary' htmlType="submit">确认新建</Button>
                    </Form.Item>
                </Form>
                <Modal
                    visible={this.state.isMemberModalVisible}
                    onCancel={() => this.setState({ isMemberModalVisible: false })}
                    centered={true}
                    destroyOnClose={true}
                    onOk={this.onMemberTransferClick}
                >
                    <MemberTransfer ref={this.memberRef}/>
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        projectImg: state.createProject.projectImg,
        projectMember: state.createProject.projectMember,
        user: state.user
    }),
    {setCreateProjectMember}
)(ProjectCreate);
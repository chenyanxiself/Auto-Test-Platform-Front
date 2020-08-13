import React, {Component} from 'react';
import {Upload, Button, message, Form, Input} from 'antd'
import {UploadOutlined} from '@ant-design/icons';
import './base.scss'
import {uploadProjectImgApi, getProjectById,updateProjectById} from "../../api";
import ProjectMember from "../project-member/ProjectMember";


class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectImgUrl: '',
        };
        this.form = React.createRef()
    };


    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        this.setState({isloading: true})
        const res = await getProjectById(this.props.projectId)
        if (res.status === 1) {
            const projectMember = res.data.member.map(item => {
                return {
                    id: item.id,
                    cname: item.cname,
                    briefName: item.cname.substring(item.cname.length - 2, item.cname.length),
                    disabled: item.id === res.data.creator,
                }
            })
            this.setState({
                projectImgUrl: res.data.url,
            })
            this.form.current.setFieldsValue({
                projectName: res.data.name,
                projectMember,
                projectDesc: res.data.remark
            })
        } else {
            message.warning(res.error)
        }
    }

    onCustomRequest = async (file) => {
        const res = await uploadProjectImgApi(file, this.props.projectId)
        if (res.status === 1) {
            message.success('上传成功')
            this.setState({projectImgUrl: res.data.url})
        } else {
            message.warning(res.error)
        }
    }
    onFinish = async (value) => {
        const projectMember=value.projectMember.map(item=>{
            return item.id
        })
        const postData = {
            ...value,
            id:this.props.projectId,
            projectMember
        }
        const res = await updateProjectById(postData)
        if (res.status===1){
            message.success('更新成功')
            this.getData()
        }else {
            message.warning(res.error)
        }
    }

    render() {
        return (
            <div className={'project-setting-base-main'}>
                <div className={'project-setting-base-left'}>
                    <Form
                        ref={this.form}
                        layout={"vertical"}
                        onFinish={this.onFinish}
                        hideRequiredMark={true}
                        initialValues={{
                            projectName: '',
                            projectDesc: '',
                            projectMember: [],
                        }}
                    >
                        <Form.Item
                            name='projectName'
                            label='项目名称'
                            rules={[{required: true, message: '必填'}]}
                        >
                            <Input
                                placeholder='请输入项目名称'
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            name='projectDesc'
                            label='项目简介'
                        >
                            <Input.TextArea
                                placeholder='请输入项目简介'
                                allowClear={true}
                                autoSize={{minRows: 1, maxRows: 6}}
                                maxLength={200}
                                value={this.state.projectDesc}
                            />
                        </Form.Item>
                        <Form.Item
                            label='项目成员'
                            name='projectMember'
                        >
                            <ProjectMember/>
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType="submit">更新项目</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={'project-setting-base-right'}>
                    <div className={'project-setting-base-avatar-title'}>
                        项目封面
                    </div>
                    <div className={'project-setting-base-avatar-img'}>
                        <img src={this.state.projectImgUrl} alt={'avatar'}/>
                    </div>
                    <Upload
                        showUploadList={false}
                        accept='image/*'
                        customRequest={this.onCustomRequest}
                        name='projectImg'
                    >
                        <div className={'project-setting-base-avatar-button'}>
                            <Button icon={<UploadOutlined/>}>
                                更换封面
                            </Button>
                        </div>
                    </Upload>
                </div>
            </div>
        );
    };
}

export default Base;
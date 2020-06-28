import React, {Component} from 'react';
import {Form, Input, Button, Card, Modal, message} from 'antd'
import './user.scss'
import {connect} from 'react-redux'
import {updatePassword, updateUserInfo} from '../../api/index'

class User extends Component {
    constructor(props) {
        super(props);
        this.modalForm = React.createRef()
        this.state = {
            isModalVisible: false,
        };
    };

    onFinish = async (value) => {
        const res = await updateUserInfo(value)
        if (res.status === 1) {
            message.success('修改成功')
            this.props.setCurrentUser({
                ...this.props.user,
                cname:value.cname,
                email:value.email,
                phone:value.phone
            })
        } else {
            message.warning(res.error)
        }
    }
    changePwdOnFinish = async (value) => {
        // console.log(value)
        const res = await updatePassword(value.oldPassword, value.newPassword)
        if (res.status === 1) {
            message.success('修改成功')
        } else {
            message.warning(res.error)
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 7},
        };
        const modalFormItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 9},
        };
        return (
            <div>
                <Card
                    title={<span style={{fontSize: 18, fontWeight: 500}}>个人中心</span>}
                    bordered={false}
                >
                    <Form
                        {...formItemLayout}
                        labelAlign={'left'}
                        fields={[
                            {name: 'name', value: this.props.user.name},
                            {name: 'cname', value: this.props.user.cname},
                            {name: 'email', value: this.props.user.email},
                            {name: 'phone', value: this.props.user.phone},
                        ]}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label={<span className={'user-info-label'}>用户名</span>}
                            name={'name'}
                            rules={[{
                                required: true,
                                message: '必填',
                            }]}
                        >
                            <Input disabled={true} autoComplete='off'/>
                        </Form.Item>
                        <Form.Item
                            label={<span className={'user-info-label'}>用户昵称</span>}
                            name={'cname'}
                            rules={[{
                                required: true,
                                message: '必填',
                            }]}
                        >
                            <Input autoComplete='off'/>
                        </Form.Item>
                        <Form.Item
                            label={<span className={'user-info-label'}>邮箱</span>}
                            name={'email'}
                        >
                            <Input autoComplete='off'/>
                        </Form.Item>
                        <Form.Item
                            label={<span className={'user-info-label'}>手机</span>}
                            name={'phone'}
                        >
                            <Input autoComplete='off'/>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{offset: 4}}
                        >
                            <Button
                                onClick={() => this.setState({isModalVisible: true})}
                                type="dashed"
                            >修改密码</Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{span: 7, offset: 4}}>
                            <Button type="primary" htmlType="submit">
                                确认修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Modal
                    visible={this.state.isModalVisible}
                    onCancel={() => this.setState({isModalVisible: false})}
                    footer={null}
                >
                    <Form
                        ref={this.modalForm}
                        {...modalFormItemLayout}
                        labelAlign={'left'}
                        onFinish={this.changePwdOnFinish}
                    >
                        <Form.Item
                            label={'原密码'}
                            name={'oldPassword'}
                            rules={[{
                                required: true,
                                message: '必填',
                            }]}
                        >
                            <Input.Password placeholder={'请输入原密码'}/>
                        </Form.Item>
                        <Form.Item
                            label={'新密码'}
                            name={'newPassword'}
                            rules={[{
                                required: true,
                                message: '必填',
                            }, {
                                min: 5,
                                message: '至少5个字符',
                            }]}
                        >
                            <Input.Password placeholder={'请输入新密码'}/>
                        </Form.Item>
                        <Form.Item
                            label={'确认密码'}
                            name={'ackPassword'}
                            required={true}
                            rules={[{
                                validator: (_, value) => {
                                    const newPassword = this.modalForm.current.getFieldValue('newPassword')
                                    if (value !== newPassword) {
                                        return Promise.reject('两次输入的密码不一致')
                                    } else {
                                        return Promise.resolve()
                                    }
                                }
                            }]}
                        >
                            <Input.Password placeholder={'确认密码'}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{span: 7, offset: 7}}>
                            <Button type="primary" htmlType="submit">
                                确认修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    };
}

export default connect(
    state => ({user: state.user}),
    null
)(User);
import React, { Component } from 'react';
import './login.scss'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button,message } from 'antd';
import {loginApi} from '../../api/index'
import storeageUtil,{key} from '../../util/storeageUtil'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    validatorUserName = (rule, value) => {
        if ( /^ *$/.test(value)) {
            return Promise.reject("用户名不能为空!")
        }
        else if(!value){
            return Promise.reject("请输入用户名!")
        }
        else if (/^[a-zA-Z0-9_]{1,12}$/.test(value)) {
            return Promise.resolve()
        } else {
            return Promise.reject("用户名为4到12位,英文、数字、下划线!")
        }
    }
    handleSubmit=(values)=>{
        loginApi(values)
        .then(res=>{
            if (res.status===1){
                message.success("登陆成功")
                storeageUtil.save(key.TOKEN,res.data.token)
                //replace不需要再次回退回来,push可以回退到login页面
                this.props.history.replace('/')
            }else{
                message.warning(res.error)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    render() { 
        return ( 
            <div className='login'>
                <div className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.handleSubmit}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { validator: this.validatorUserName }
                            ]}
                        >
                            <Input 
                            prefix={<UserOutlined 
                            className="site-form-item-icon" />} 
                            placeholder="用户名" 
                            autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
         );
    }
}
 
export default Login
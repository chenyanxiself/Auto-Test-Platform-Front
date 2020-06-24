import React, { Component } from 'react';
import { Transfer,message } from 'antd';
import {connect} from 'react-redux'
import {getAllUser} from '../../api/index'
class MemberTransfer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: [],
            targetKeys: [],
        };
    }

    componentDidMount() {
        this.getData();
    }
    getSelectedMember=()=>{
        let selectMember = []
        this.state.targetKeys.forEach(key=>{
            const user = this.state.userData.find(item=>item.id===key)
            selectMember.push({
                id:user.id,
                cname:user.cname,
                briefName:user.cname.substring(user.cname.length-2,user.cname.length)
            })
        })
        return selectMember
    }
    getData = async() => {
        let res = await getAllUser()
        if(res.status === 1){
            const selectedKeys = this.props.projectMember.map(item=>{
                return item.id
            })
            let userList=res.data.userList.map(item=>{
                if(item.id===this.props.user.id){
                    item.disabled=true
                }
                return item
            })
            this.setState({userData:userList,targetKeys:selectedKeys})
        }else{
            message.warning('获取用户信息失败: '+res.error)
        }
    };

    filterOption = (inputValue, option) => option.cname.indexOf(inputValue) > -1;

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    };

    render() {
        return (
            <Transfer
                dataSource={this.state.userData}
                showSearch
                filterOption={this.filterOption}
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange}
                render={item => item.cname}
                titles={['用户列表','已选用户']}
                operations={['添加','删除']}
                rowKey={item=>item.id}
            />
        );
    }
}

export default connect(
    state=>({
        projectMember:state.createProject.projectMember,
        user:state.user
    }),
    null,
    null,
    {forwardRef:true}
)(MemberTransfer)
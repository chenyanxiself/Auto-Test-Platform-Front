import React, {Component} from 'react';
import {Modal, Avatar, Tooltip, Button} from 'antd'
import MemberTransfer from "./MemberTransfer";
import {PlusOutlined} from '@ant-design/icons';
import './projectMember.scss'

class ProjectMember extends Component {
    constructor(props) {
        super(props);
        this.state={
            isMemberModalVisible:false
        };
        this.memberRef=React.createRef()
    }
    onChange=(changedValue)=>{
        this.props.onChange(
            [...changedValue]
        )
    }
    onOk=()=>{
        const changeData = this.memberRef.current.getSelectedMember()
        this.props.onChange(
            [...changeData]
        )
        this.setState({isMemberModalVisible:false})
    }
    render() {
        return (
            <div style={{alignItems: 'center', display: 'flex'}}>
                {this.props.value.map((item, index) => {
                    return (<Tooltip title={item.cname} key={index + 1}>
                        <Avatar
                            className='project-member-avatar'
                        >{item.briefName}</Avatar>
                    </Tooltip>)
                })}
                <Button
                    style={{float: "left"}}
                    shape='circle'
                    icon={<PlusOutlined/>}
                    size='small'
                    onClick={() => this.setState({isMemberModalVisible: true})}
                />
                <Modal
                    visible={this.state.isMemberModalVisible}
                    onCancel={() => this.setState({isMemberModalVisible: false})}
                    centered={true}
                    destroyOnClose={true}
                    onOk={this.onOk}
                >
                    <MemberTransfer ref={this.memberRef} selectedMember={this.props.value}/>
                </Modal>
            </div>
        );
    };
}

export default ProjectMember;
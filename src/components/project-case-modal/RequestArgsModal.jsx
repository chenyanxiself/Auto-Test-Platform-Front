import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import RequestArgs from './RequestArgs'
class RequestArgsModal extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.props.onChange
        this.requestArgsRef = React.createRef()
        this.state = {
            isModalVisible: false
        }
    }
    triggerChange = changedValue => {
        if (this.onChange) {
            this.onChange(
                changedValue,
            );
        }
    };
    onCancel = () => {
        this.setState({ isModalVisible: false })
    }
    onOk=()=>{
        const data = this.requestArgsRef.current.getDataSource()
        this.triggerChange(data)
        this.setState({isModalVisible:false})
    }
    render() {
        return (
            <div>
                <Button icon={<EditOutlined />} shape='circle' onClick={() => this.setState({ isModalVisible: true })} />
                <Modal
                    onCancel={this.onCancel}
                    visible={this.state.isModalVisible}
                    onOk={this.onOk}
                    destroyOnClose={true}
                >
                    <RequestArgs ref={this.requestArgsRef} initValue={this.props.value}/>
                </Modal>
            </div>
        );
    }
}

export default RequestArgsModal;
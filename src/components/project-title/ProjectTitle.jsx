import React, { Component } from 'react';
import {Menu} from 'antd'

class ProjectTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys:['1']
        }
    }
    onMenuClick = (item) => {
        let { key,keyPath } = item
        this.setState({ selectedKeys: keyPath })
        this.props.changeType(key)
    }
    render() { 
        return (
            <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={this.state.selectedKeys}
            onClick={this.onMenuClick}
        >
            <Menu.Item key='1'>进行中</Menu.Item>
            <Menu.Item key='0'>已归档</Menu.Item>
        </Menu>
        );
    }
}
 
export default ProjectTitle;
import React, {Component} from 'react';
import {Card, Menu} from 'antd'
import Base from '../../components/project-setting/Base'
import Env from '../../components/project-setting/Env'
import Advance from '../../components/project-setting/Advance'
import './projectSetting.scss'

const menuMap = {
    base: '基础设置',
    env: '环境设置',
    advance:'高级设置'
}



class ProjectSetting extends Component {
    constructor(props) {
        super(props);
        this.projectId = parseInt(this.props.match.params.id)
        this.state = {
            selectedKey: 'base'
        }
    }

    onMenuClick = (key) => {
        this.setState({selectedKey: key})
    }
    renderRight=()=>{
        const {selectedKey} = this.state
        switch (selectedKey) {
            case 'base':
                return <Base projectId={this.projectId}/>
            case 'env':
                return <Env projectId={this.projectId}/>
            case 'advance':
                return <Advance projectId={this.projectId}/>
            default:
                return null
        }
    }
    render() {
        return (
            <div className={'project-setting-main'}>
                <div className={'project-setting-left'}>
                    <Menu
                        mode={"inline"}
                        // theme={"light"}
                        selectedKeys={[this.state.selectedKey]}
                        onClick={({key}) => this.onMenuClick(key)}
                    >
                        {
                            Object.keys(menuMap).map(item => {
                                return <Menu.Item key={item}>{menuMap[item]}</Menu.Item>
                            })
                        }
                    </Menu>
                </div>
                <div className={'project-setting-right'}>
                    <Card
                        title={menuMap[this.state.selectedKey]}
                        bordered={false}
                    >
                        {this.renderRight()}
                    </Card>

                </div>
            </div>


        );
    }
}

export default ProjectSetting;
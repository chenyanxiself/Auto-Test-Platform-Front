import React, {Component} from 'react';
import {Button, message, Modal} from "antd";
import './advance.scss'
import {getProjectById,updateProjectType,deleteProject} from "../../api";
import {withRouter} from 'react-router-dom'

// import { PlusOutlined, FormOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

class Advance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectType: 1,
            isFiledVisible: false,
            isDeleteVisible: false

        };
    };

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        this.setState({isloading: true})
        const res = await getProjectById(this.props.projectId)
        if (res.status === 1) {
            this.setState({projectType: res.data.type})
        } else {
            message.warning(res.error)
        }
    }
    getFiledButton = () => {
        let buttonType = 'danger'
        let buttonText = '归档项目'
        if (this.state.projectType === 0) {
            buttonType = 'primary'
            buttonText = '激活项目'
        }
        return <Button
            type={buttonType}
            ghost={true}
            onClick={
                () => {
                    this.setState({isFiledVisible: true})
                }
            }
        >{buttonText}</Button>
    }
    onFiledOk = async() => {
        const projectType = this.state.projectType===1?0:1
        const res = await updateProjectType(this.props.projectId,projectType)
        if (res.status===1){
            message.success('操作成功')
            this.setState({isFiledVisible:false})
            this.getData()
        }else {
            message.warning(res.error)
        }
    }
    onDeleteOk = async() => {
        const res = await deleteProject(this.props.projectId)
        if (res.status===1){
            message.success('操作成功')
            this.props.history.replace('/project/')
        }else {
            message.warning(res.error)
        }
    }

    render() {
        return (
            <div className={'project-setting-advance-main'}>
                <div className={'project-setting-advance-item'}>
                    <div>
                        <span className={'project-setting-advance-title'}>归档项目</span>
                        <div className={'project-setting-advance-text'}>
                            归档后,所有项目数据不可再次编辑,只可查看,您可以重新激活项目
                        </div>
                    </div>
                    <div>
                        {this.getFiledButton()}

                    </div>
                </div>
                <div className={'project-setting-advance-item'}>
                    <div>
                        <span className={'project-setting-advance-title'}>删除项目</span>
                        <div className={'project-setting-advance-text'}>
                            删除后,该项目无法复原
                        </div>
                    </div>
                    <div>
                        <Button
                            type={"primary"}
                            danger={true}
                            onClick={() => this.setState({isDeleteVisible:true})}
                        >删除项目</Button>
                    </div>
                </div>
                <Modal
                    title={this.state.projectType === 1 ? '归档项目' : '激活项目'}
                    visible={this.state.isFiledVisible}
                    destroyOnClose={true}
                    onOk={this.onFiledOk}
                    onCancel={() => this.setState({isFiledVisible: false})}
                >
                    <span>{this.state.projectType === 1 ? '是否确认归档项目?' : '是否确认激活项目?'}</span>
                </Modal>
                <Modal
                    title={'删除项目'}
                    visible={this.state.isDeleteVisible}
                    destroyOnClose={true}
                    onOk={this.onDeleteOk}
                    onCancel={() => this.setState({isDeleteVisible: false})}
                >
                    <span>删除后,该项目数据无法复原,确认删除该项目?</span>
                </Modal>
            </div>
        );
    };
}

export default withRouter(Advance);
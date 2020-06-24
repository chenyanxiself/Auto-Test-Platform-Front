import React, { Component } from 'react';
import { Card, Button, Pagination, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import Title from '../../components/project-title/ProjectTitle'
import { connect } from 'react-redux'
import './project.scss'
import ProjectCreate from '../../components/project-create/ProjectCreate'
import {
    delCreateProjectImg,
    delCreateProjectMember,
    setCreateProjectMember,
} from '../../store/actionFactory'
import { getAllProject } from '../../api/index'
class Project extends Component {
    constructor(props) {
        super(props);
        this.pageSize = 20
        this.state = {
            isLoading: false,
            projectList: [],
            selectType: 1, //1进行中 0已归档
            currentPage: 1,
            isModalVisible: false
        }
    }
    componentDidMount() {
        this.getProjectList(this.state.selectType)
    }
    getProjectList = (type) => {
        this.setState({ isLoading: true }, async () => {
            let res = await getAllProject(type)
            if (res.status === 1) {
                this.setState({
                    projectList: res.data,
                    isLoading: false,
                })
            } else {
                message.warning('获取项目列表失败:' + res.error)
            }
        })
    }
    onProjectClick = (item) => {
        this.props.history.push(`/project/${item.id}/overview`)
    }
    changeSelectType = (value) => {
        this.setState({ selectType: value, currentPage: 1 }, () => {
            this.getProjectList(this.state.selectType)
        })
    }
    onCreateClick = () => {
        let initMember = {
            id: this.props.user.id,
            cname: this.props.user.cname,
            briefName: this.props.user.cname.substring(this.props.user.cname.length - 2, this.props.user.cname.length)
        }
        this.props.setCreateProjectMember([initMember])
        this.setState({ isModalVisible: true })
    }
    pageChange = (page) => {
        this.setState({ currentPage: page })
    }
    onCancel = () => {
        this.setState({ isModalVisible: false })
        this.props.delCreateProjectImg()
        this.props.delCreateProjectMember()
    }
    render() {
        const extra = (
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={this.onCreateClick} />
        )
        const pagedProjectList = this.state.projectList.slice((this.state.currentPage - 1) * this.pageSize, this.state.currentPage * this.pageSize)
        return (
            <React.Fragment>
                <Card
                    title={<Title
                        changeType={(value) => { this.changeSelectType(value) }}
                    />}
                    style={{ width: '100%', height: '90%' }}
                    extra={extra}
                    bordered={false}
                    loading={this.state.isLoading}
                    bodyStyle={{ height: '80%', overflowY: 'scroll' }}
                >
                    {pagedProjectList.reduce((pre, cur) => {
                        pre.push(
                            <Card
                                key={cur.id}
                                type='inner'
                                hoverable={true}
                                className='project-body-item'
                                title={<span className='project-body-item-title'>{cur.name}</span>}
                                headStyle={{ height: 48 }}
                                onClick={() => { this.onProjectClick(cur) }}
                                cover={
                                    <div className='project-body-item-cover'>
                                        <img
                                            alt="example"
                                            src={cur.url}
                                        />
                                    </div>
                                }
                                bodyStyle={{ padding: '0px 10px 10px 10px', height: 52, }}
                            >
                                <span className='project-body-item-body-remark'>{cur.remark}</span>
                            </Card>
                        )
                        return pre
                    }, [])}
                </Card>
                <Pagination
                    current={this.state.currentPage}
                    total={this.state.projectList.length}
                    pageSize={this.pageSize}
                    className='project-bottom-pagination'
                    onChange={this.pageChange}
                />
                <Modal
                    className='project-modal'
                    visible={this.state.isModalVisible}
                    onCancel={this.onCancel}
                    width={800}
                    title={<div style={{ textAlign: 'center' }}>新建项目</div>}
                    destroyOnClose={true}
                    footer={null}
                >
                    <ProjectCreate
                        reloadData={() => this.getProjectList(this.state.selectType)}
                        closeModal={() => this.setState({ isModalVisible: false })}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(
    state => ({
        user: state.user,
    }),
    {
        delCreateProjectImg,
        delCreateProjectMember,
        setCreateProjectMember,
    }
)(Project);
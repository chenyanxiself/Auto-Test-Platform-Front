import React, {Component} from 'react';
import {Card, Button, Modal, message, List} from 'antd'
import {PlusOutlined} from '@ant-design/icons';
import './project.scss'
import ProjectCreate from '../../components/project-create/ProjectCreate'
import {getAllProject} from '../../api/index'
const tabList=[
    {
        key:1,
        tab:'进行中'
    },
    {
        key:0,
        tab: '已归档'
    }
]
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
        this.setState({isLoading: true}, async () => {
            let res = await getAllProject(type)
            if (res.status === 1) {
                this.setState({
                    projectList: res.data,
                    isLoading: false,
                })
            } else {
                message.warning(res.error)
            }
        })
    }
    onProjectClick = (item) => {
        this.props.history.push(`/project/${item.id}/overview`)
    }
    handleTabChange=(key)=>{
            this.getProjectList(key)
    }
    onCreateClick = () => {
        this.setState({isModalVisible: true})
    }

    onCancel = () => {
        this.setState({isModalVisible: false})
    }

    render() {
        const extra = (
            <Button type="primary" shape="circle" icon={<PlusOutlined/>} onClick={this.onCreateClick}/>
        )
        return (
            <React.Fragment>
                <Card
                    title={'项目列表'}
                    tabList={tabList}
                    onTabChange={key=>this.handleTabChange(key)}
                    extra={extra}
                    bordered={false}
                    loading={this.state.isLoading}
                >
                    <List
                        className={'project-body-list'}
                        rowKey={'id'}
                        grid={{
                            gutter:25,
                            xs:1,
                            sm:2,
                            md:3,
                            lg:4,
                            xl:5,
                            xxl:5
                        }}
                        dataSource={this.state.projectList}
                        renderItem={item=>(
                            <List.Item className={'project-body-list-item'}>
                                <Card
                                    className={'project-body-card'}
                                    hoverable={true}
                                    key={item.id}
                                    cover={<img alt={item.name} src={item.url} className={'project-body-card-img'}/>}
                                    onClick={() => {
                                        this.onProjectClick(item)
                                    }}
                                >
                                    <Card.Meta
                                        title={<div className={'project-body-card-title'}>{item.name}</div>}
                                        description={<div className={'project-body-card-remark'}>{item.remark}</div>}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Card>
                <Modal
                    className='project-modal'
                    visible={this.state.isModalVisible}
                    onCancel={this.onCancel}
                    width={800}
                    title={<div style={{textAlign: 'center'}}>新建项目</div>}
                    destroyOnClose={true}
                    footer={null}
                >
                    <ProjectCreate
                        reloadData={() => this.getProjectList(this.state.selectType)}
                        closeModal={() => this.setState({isModalVisible: false})}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

export default Project
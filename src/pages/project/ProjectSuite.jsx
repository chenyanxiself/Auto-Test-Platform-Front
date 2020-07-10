import React, {Component} from 'react';
import {Card, Button, Menu, Modal, message, Table} from 'antd'
import './projectSuite.scss'
import ProjectSuiteModifyModal from "../../components/project-suite/ProjectSuiteModifyModal";
import {
    getSuiteByProjectId,
    getSuiteInfoById,
    createSuite,
    deleteSuite,
    updateSuiteCaseRelation,
    updateSuiteCaseSort
} from '../../api'
import ProjectSuiteCreateModal from '../../components/project-suite/ProjectSuiteCreateModal'
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {HTML5Backend} from 'react-dnd-html5-backend'
import update from 'immutability-helper';
import {component} from '../../components/project-suite/DndComponent'
import {DndProvider} from 'react-dnd'

const {confirm} = Modal


const columns = [
    {
        title: '用例名',
        dataIndex: 'name',
    },
    {
        title: '请求方式',
        dataIndex: 'method',
        render: (method) => {
            return method === 1 ? 'Get' : 'Post'
        }
    },
    {
        title: '域名',
        dataIndex: 'real_host',
    },
    {
        title: '路径',
        dataIndex: 'request_path',
    },
];

class ProjectSuite extends Component {
    constructor(props) {
        super(props);
        this.projectId = parseInt(this.props.match.params.id)
        this.modalRef = React.createRef()
        this.createRef = React.createRef()
        this.state = {
            isSuiteModifyModalVisible: false,
            isSuiteCreateModalVisible: false,
            isLeftCardLoading: false,
            isRightCardLoading: false,
            suiteList: [],
            dataSource: [],
            currentSuite: {
                suiteId: null,
                suiteName: '',
                projectId: this.projectId,
                totalCaseList: [],
                relation: []
            }
        }
    }

    getData = async () => {
        this.setState({isLeftCardLoading: true})
        const res = await getSuiteByProjectId(this.projectId)
        this.setState({suiteList: res.data, isLeftCardLoading: false})
    }

    componentDidMount() {
        this.getData()
    }

    getSuiteData = async (suiteId) => {
        this.setState({isRightCardLoading: true})
        const res = await getSuiteInfoById(suiteId, this.projectId)
        if (res.status === 1) {
            const totalCaseList = res.data.total_case_list
            const dataSource = res.data.relation.map((item, index) => {
                let current_case = totalCaseList.find(caseItem => {
                    return caseItem.id === item.case_id
                })
                current_case.index = index
                return current_case
            })
            this.setState({
                isRightCardLoading: false,
                dataSource,
                currentSuite: {
                    suiteId: suiteId,
                    suiteName: res.data.suite_name,
                    projectId: this.projectId,
                    totalCaseList: res.data.total_case_list,
                    relation: res.data.relation
                }
            })
        } else {
            message.warning(res.error)
            this.setState({
                isRightCardLoading: false,
            })
        }
    }

    onSuiteSelect = ({key}) => {
        this.getSuiteData(key)
    }

    onCreateOK = () => {
        this.createRef.current.form.current.validateFields().then(async value => {
            const res = await createSuite(this.projectId, value.suiteName)
            if (res.status === 1) {
                message.success('新建成功')
                this.getData({isSuiteModifyModalVisible: false})
                this.setState({isSuiteCreateModalVisible: false})
            } else {
                message.warning('新建失败:' + res.error)
            }
        }).catch(e => {
            console.log(e)
        })
    }
    onModalOk = async () => {
        const res = await updateSuiteCaseRelation(
            this.state.currentSuite.suiteId,
            this.projectId,
            this.modalRef.current.getSelectedKeys()
        )
        if (res.status === 1) {
            message.success('编辑成功')
            this.getSuiteData(this.state.currentSuite.suiteId)
            this.setState({isSuiteModifyModalVisible: false})
        } else {
            message.warning('编辑失败: ' + res.error)
        }
    }

    showConfirm = (suiteId) => {
        confirm({
            title: '是否确认删除?',
            icon: <ExclamationCircleOutlined/>,
            maskClosable: true,
            onOk: async () => {
                const res = await deleteSuite(suiteId)
                if (res.status === 1) {
                    message.success('删除成功')
                    this.getData()
                    this.setState({
                        currentSuite: {
                            suiteId: null,
                            suiteName: '',
                            projectId: this.projectId,
                            totalCaseList: [],
                            relation: []
                        }
                    })
                } else {
                    message.success('删除失败: ' + res.error)
                    return Promise.reject()
                }
            },
        });
    }
    moveRow = async (dragIndex, hoverIndex) => {
        const {dataSource} = this.state;
        const dragRow = dataSource[dragIndex];
        const newDataSource = update(this.state.dataSource,
            {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
            },
        )
        const beforeId = this.state.dataSource[dragIndex].id
        const afterId = this.state.dataSource[hoverIndex].id
        const res = await updateSuiteCaseSort(this.projectId, this.state.currentSuite.suiteId, beforeId, afterId)
        if (res.status===1){
            this.setState({dataSource: newDataSource});
        }else {
            message.warning(res.error)
        }
    };

    render() {
        const suiteExtra = (
            <div>
                <Button
                    type="primary"
                    size={'small'}
                    style={{marginRight: 10}}
                    onClick={() => this.setState({isSuiteCreateModalVisible: true})}
                >新建</Button>
                <Button
                    type="primary"
                    size={'small'}
                    style={{marginRight: 10}}
                    onClick={() => this.setState({isSuiteModifyModalVisible: true})}
                    disabled={!this.state.currentSuite.suiteId}
                >修改</Button>
                <Button
                    type="primary"
                    size={'small'}
                    danger={true}
                    disabled={!this.state.currentSuite.suiteId}
                    onClick={() => this.showConfirm(this.state.currentSuite.suiteId)}
                >删除</Button>
            </div>
        )

        return (
            <div className={'project-suite'} style={{height: '100%'}}>
                <Card
                    className={'project-suite-left'}
                    title="测试集"
                    bordered={false}
                    headStyle={{height: 70}}
                    extra={suiteExtra}
                    loading={this.state.isLeftCardLoading}
                >

                    <Menu
                        onSelect={this.onSuiteSelect}
                    >
                        {this.state.suiteList.map(item => {
                            return (
                                <Menu.Item key={item.id}>{item.name}</Menu.Item>
                            )
                        })}
                    </Menu>
                </Card>
                <Card
                    className={'project-suite-right'}
                    title="测试用例"
                    bordered={false}
                    headStyle={{height: 70}}
                    bodyStyle={{paddingLeft: 0, paddingRight: 0}}
                    loading={this.state.isRightCardLoading}
                >
                    {<DndProvider backend={HTML5Backend}>
                        <Table
                            columns={columns}
                            dataSource={this.state.dataSource}
                            components={component}
                            pagination={false}
                            rowKey={'id'}
                            showHeader={false}
                            onRow={(record, index) => ({
                                index,
                                moveRow: this.moveRow,
                            })}
                        />
                    </DndProvider>}
                </Card>
                <Modal
                    visible={this.state.isSuiteModifyModalVisible}
                    onCancel={() => this.setState({isSuiteModifyModalVisible: false})}
                    width={800}
                    bodyStyle={{overflowY: 'scroll', height: 500}}
                    onOk={this.onModalOk}
                    destroyOnClose={true}
                    title={'编辑测试集'}
                >
                    <ProjectSuiteModifyModal currentSuite={this.state.currentSuite} ref={this.modalRef}/>
                </Modal>
                <Modal
                    visible={this.state.isSuiteCreateModalVisible}
                    onCancel={() => this.setState({isSuiteCreateModalVisible: false})}
                    destroyOnClose={true}
                    title={'新建测试集'}
                    onOk={this.onCreateOK}
                >
                    <ProjectSuiteCreateModal ref={this.createRef}/>
                </Modal>
            </div>
        );
    }
}

export default ProjectSuite;
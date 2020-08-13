import React, {Component} from 'react';
import {Card, Button, Menu, Modal, message, Table, Form, Checkbox} from 'antd'
import './projectSuite.scss'
import ProjectSuiteModifyModal from "../../components/project-suite/ProjectSuiteModifyModal";
import {
    getSuiteByProjectId,
    getSuiteInfoById,
    createSuite,
    deleteSuite,
    updateSuiteCaseRelation,
    updateSuiteCaseSort,
    executeSuite
} from '../../api'
import ProjectSuiteCreateModal from '../../components/project-suite/ProjectSuiteCreateModal'
import {ExclamationCircleOutlined, PlayCircleOutlined} from '@ant-design/icons';
import {HTML5Backend} from 'react-dnd-html5-backend'
import update from 'immutability-helper';
import {component} from '../../components/project-suite/DndComponent'
import {DndProvider} from 'react-dnd'
import RequestArgsModal from '../../components/project-api-case/RequestArgsModal'
import Host from "../../components/project-api-case/Host";

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
            isCaseExecuteModalVisible: false,
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
        if (res.status === 1) {
            this.setState({suiteList: res.data, isLeftCardLoading: false})
        } else {
            message.warning(res.error)
        }
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
                message.warning(res.error)
            }
        }).catch(e => {
            console.log(e)
        })
    }
    onModalOk = async () => {
        let caseIdList = this.modalRef.current.getSelectedKeys()
        const res = await updateSuiteCaseRelation(
            this.state.currentSuite.suiteId,
            this.projectId,
            caseIdList
        )
        if (res.status === 1) {
            message.success('编辑成功')
            this.getSuiteData(this.state.currentSuite.suiteId)
            this.setState({isSuiteModifyModalVisible: false})
        } else {
            message.warning(res.error)
        }
    }

    showConfirm = (suiteId) => {
        confirm({
            title: '是否确认删除?',
            icon: <ExclamationCircleOutlined/>,
            maskClosable: true,
            onOk: async () => {
                const res = await deleteSuite(suiteId, this.projectId)
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
        // console.log(this.state.dataSource[dragIndex])
        // console.log(this.state.dataSource[hoverIndex])
        const type = dragIndex > hoverIndex ? 1 : 2  //'1'代表after的上方  '2'代表after的下方
        const res = await updateSuiteCaseSort(this.projectId, this.state.currentSuite.suiteId, beforeId, afterId, type)
        if (res.status === 1) {
            this.setState({dataSource: newDataSource});
        } else {
            message.warning(res.error)
        }
    };
    onExecute = async (value) => {
        const res = await executeSuite(this.projectId, this.state.currentSuite.suiteId, value)
        if (res.status === 1) {
            message.success('请在测试报告页面查看结果')
            this.setState({isCaseExecuteModalVisible: false})
        } else {
            message.warning(res.error)
        }
    }

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
        const caseExtra = (
            <Button
                type={"primary"}
                icon={<PlayCircleOutlined/>}
                disabled={!this.state.currentSuite.suiteId || this.state.currentSuite.relation.length === 0}
                onClick={() => this.setState({isCaseExecuteModalVisible: true})}
            >
                执行
            </Button>
        )
        const layout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16},
        };
        const tailLayout = {
            wrapperCol: {offset: 6, span: 14},
        };
        return (
            <div className={'project-suite'}>
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
                        mode={"inline"}
                        theme={"light"}
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
                    extra={caseExtra}
                >
                    {!this.state.currentSuite.suiteId || this.state.currentSuite.relation.length === 0 ? null :
                        <DndProvider backend={HTML5Backend}>
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
                <Modal
                    visible={this.state.isCaseExecuteModalVisible}
                    onCancel={() => this.setState({isCaseExecuteModalVisible: false})}
                    destroyOnClose={true}
                    title={'执行测试集'}
                    footer={null}
                    width={600}
                >
                    <Form
                        {...layout}
                        onFinish={this.onExecute}
                        labelAlign={"left"}
                        initialValues={{
                            isSaveCookie: true,
                            globalHost: {
                                isUseEnv: true,
                                requestHost: undefined,
                                envHost: undefined
                            }
                        }}
                    >
                        <Form.Item
                            label={'全局域名'}
                            name={'globalHost'}
                        >
                            <Host projectId={this.projectId}/>
                        </Form.Item>
                        <Form.Item
                            label={'全局请求头'}
                            name={'globalHeaders'}
                        >
                            <RequestArgsModal/>
                        </Form.Item>
                        <Form.Item
                            {...tailLayout}
                            name="isSaveCookie"
                            valuePropName="checked"
                        >
                            <Checkbox>自动保存Cookie</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button
                                htmlType={"submit"}
                                type={"primary"}
                            >提交</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ProjectSuite;
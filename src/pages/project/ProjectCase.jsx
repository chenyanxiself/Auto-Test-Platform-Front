import React, {Component} from 'react';
import './projectCase.scss'
import ModuleTree from "../../components/project-case/ModuleTree";
import {Button, Card, Input, Table, Modal, message} from "antd";
import {
    HomeOutlined,
    SearchOutlined,
    FormOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
    PlusCircleOutlined,
    DownloadOutlined,
    UploadOutlined,
    CopyOutlined
} from '@ant-design/icons';
import CaseCreate from "../../components/project-case/CaseCreate";
import {getCaseByModuleId, createProjectCase, updateProjectCase, deleteProjectCase} from '../../api'
import {priorityEnum} from '../../util/projectEnum'

class ProjectCase extends Component {
    constructor(props) {
        super(props);
        this.projectId = parseInt(this.props.match.params.id)
        this.inputRef = React.createRef()
        this.state = {
            selectedModule: [],
            dataSource: [],
            isCaseModalVisible: false,
            currentCase: {},
            moduleTree: [],
            operation: 1,  // 1 新建用例 2 编辑用例
            isloading: false,
            caseModalLoading: false,
        }
        this.columns = [
            {
                title: '',
                width: '7%',
                dataIndex: 'index',
            },
            {
                title: '名称',
                width: '20%',
                ellipsis: true,
                dataIndex: 'name',
            },
            {
                title: '优先级',
                width: '20%',
                dataIndex: 'priority',
                render: (text) => {
                    return priorityEnum[text]
                },
            },
            {
                title: '所属模块',
                width: '20%',
                ellipsis: true,
                dataIndex: 'moduleName',
            },
            {
                title: '创建人',
                width: '10%',
                ellipsis: true,
                dataIndex: 'cname',
            },
            {
                title: '操作',
                width: '23%',
                render: (record) =>
                    <span>
                            <Button
                                type='primary'
                                shape="circle"
                                icon={<FormOutlined/>}
                                size='small'
                                onClick={() => {
                                    this.setState({
                                        isCaseModalVisible: true,
                                        operation: 2,
                                        currentCase: record
                                    })
                                }}
                                style={{marginRight: 10}}
                            />
                            <Button
                                type='primary'
                                shape="circle"
                                icon={<CopyOutlined />}
                                size='small'
                                style={{marginRight: 10}}
                                onClick={()=>this.onCopy(record)}
                            />
                            <Button
                                type='primary'
                                shape="circle"
                                icon={<CloseOutlined/>}
                                danger
                                size='small'
                                onClick={() => {
                                    this.onDelete(record)
                                }}
                            />
                        </span>
            },
        ]
        this.caseCreate = React.createRef()
    }


    componentDidMount() {
        this.getData([])
    }
    onCopy=(record)=>{
        let newRecord = {...record}
        newRecord.name = ''
        this.setState({
            isCaseModalVisible: true,
            operation: 1,
            currentCase: newRecord
        })
    }

    onDelete = async (record) => {
        Modal.confirm({
            title: '是否确认删除?',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            maskClosable: true,
            onOk: async () => {
                let res = await deleteProjectCase([record.id], this.projectId)
                if (res.status === 1) {
                    message.success('删除成功')
                    this.getData(this.state.selectedModule)
                } else {
                    message.warning(res.error)
                    return Promise.reject(res.error)
                }
            },
            onCancel: this.setState({isCaseModalVisible: false}),
        });
    }
    onSearch = () => {
        this.getData(this.state.selectedModule)
    }

    getData = async (keys) => {
        let moduleId
        if (keys.length === 0) {
            moduleId = null
        } else {
            moduleId = keys[0]
        }
        this.setState({isloading: true})
        const res = await getCaseByModuleId(this.projectId, moduleId, this.inputRef.current.state.value)
        if (res.status === 1) {
            let dataSource = res.data.map(item => {
                item.moduleName = item['module_name']
                return item
            })
            this.setState({
                dataSource,
                isloading: false
            })
        } else {
            message.warning(res.error)
            this.setState({
                isloading: false
            })
        }
    }


    updateSelectedModule = (keys) => {
        if (JSON.stringify(keys) !== JSON.stringify(this.state.selectedModule)) {
            this.setState({
                selectedModule: keys,
                currentCase: {},
            })
            // console.log(this.inputRef.current)
            this.inputRef.current.state.value = null
            this.getData(keys)

        }
    }

    updateModuleTree = (value) => {
        this.setState({moduleTree: value})
    }

    onModalOk = () => {
        this.caseCreate.current.form.current.validateFields()
            .then(async value => {
                if (this.state.operation === 1) {
                    let postData = {
                        name: value.caseName,
                        module_id: value.caseModule,
                        priority: value.priority,
                        precondition: value.precondition,
                        remark: value.remark,
                        steps: value.caseStep.filter(item => {
                            return item.step || item.exception
                        }),
                        project_id: this.projectId
                    }
                    this.setState({caseModalLoading: true})
                    const res = await createProjectCase(postData)
                    if (res.status === 1) {
                        message.success('创建成功')
                        this.setState({isCaseModalVisible: false})
                        this.getData(this.state.selectedModule)
                    } else {
                        message.warning(res.error)
                    }
                    this.setState({caseModalLoading: false})
                } else {
                    let postData = {
                        id: this.state.currentCase.id,
                        name: value.caseName,
                        module_id: value.caseModule,
                        priority: value.priority,
                        precondition: value.precondition,
                        remark: value.remark,
                        steps: value.caseStep.filter(item => {
                            return item.step || item.exception
                        }),
                        project_id: this.projectId
                    }
                    this.setState({caseModalLoading: true})
                    const res = await updateProjectCase(postData)
                    if (res.status === 1) {
                        message.success('修改成功')
                        this.setState({isCaseModalVisible: false})
                        this.getData(this.state.selectedModule)
                    } else {
                        message.warning(res.error)
                    }
                    this.setState({caseModalLoading: false})
                }
            }).catch(_ => {
        })
    }

    render() {
        const title = (
            <div style={{fontWeight: "normal", fontSize: 14}}>
                <div style={{marginBottom: 10}}>
                    <Button
                        icon={<HomeOutlined/>}
                        type={"text"}
                        onClick={() => {
                            this.updateSelectedModule([])
                        }}
                        size={"large"}
                        style={{padding: 0}}
                    >全部用例</Button>
                </div>
                <div style={{height: 40, lineHeight: '40px'}}>
                    <div style={{float: "left"}}>
                        <Button
                            style={{marginRight: 10}}
                            size={"small"}
                            onClick={() => this.setState({
                                isCaseModalVisible: true,
                                operation: 1,
                                currentCase: {},
                            })}
                            icon={<PlusCircleOutlined/>}
                        >新建用例</Button>
                        <Button
                            style={{marginRight: 10}}
                            size={"small"}
                            icon={<DownloadOutlined/>}
                        >导入用例</Button>
                        <Button
                            style={{marginRight: 10}}
                            size={"small"}
                            icon={<UploadOutlined />}
                        >导出用例</Button>
                    </div>
                    <div style={{float: "right"}}>
                        <Input
                            placeholder={'根据名称搜索'}
                            prefix={<SearchOutlined/>}
                            style={{width: 200, marginRight: 10}}
                            ref={this.inputRef}
                            onPressEnter={this.onSearch}
                        />
                        <Button type={"primary"} onClick={this.onSearch}>搜索</Button>
                    </div>
                </div>
            </div>
        )
        return (
            <div className={'project-case-main'}>
                <div className={'project-case-left'}>
                    <ModuleTree
                        projectId={this.projectId}
                        updateSelectedModule={this.updateSelectedModule}
                        selectedModule={this.state.selectedModule}
                        updateModuleTree={this.updateModuleTree}
                    />
                </div>
                <div className={'project-case-right'}>
                    <Card
                        style={{width: '100%', height: '100%'}}
                        bordered={false}
                        title={title}
                    >
                        <Table
                            dataSource={this.state.dataSource}
                            columns={this.columns}
                            rowKey={'index'}
                            loading={this.state.isloading}
                            pagination={{pageSize: 10}}
                        />
                    </Card>
                </div>
                <Modal
                    destroyOnClose={true}
                    visible={this.state.isCaseModalVisible}
                    onCancel={() => this.setState({isCaseModalVisible: false})}
                    width={1000}
                    title={this.state.operation === 1 ? '新建用例' : '编辑用例'}
                    bodyStyle={{padding: '24px 100px'}}
                    onOk={this.onModalOk}
                    maskClosable={false}
                    confirmLoading={this.state.caseModalLoading}
                >
                    <CaseCreate
                        ref={this.caseCreate}
                        moduleTree={this.state.moduleTree}
                        currentCase={this.state.currentCase}
                        currentModule={this.state.selectedModule}
                    />
                </Modal>
            </div>

        );
    }
}

export default ProjectCase;
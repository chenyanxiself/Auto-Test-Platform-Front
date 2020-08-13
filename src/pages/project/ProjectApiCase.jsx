import React, {Component} from 'react';
import {Card, Select, Input, Button, Table, Modal, message, Tooltip} from 'antd'
import {PlusOutlined, FormOutlined, CloseOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import './projectApiCase.scss'
import ProjectApiCaseModal from '../../components/project-api-case/ProjectApiCaseModal'
import {getStrDataFromJson} from '../../util/commonUtil'
import {
    createProjectApiCase,
    updateProjectApiCase,
    getApiCaseByCondition,
    deleteApiCaseById
} from '../../api/index'

const {confirm} = Modal;

class ProjectApiCase extends Component {
    constructor(props) {
        super(props);
        this.projectId = parseInt(this.props.match.params.id)
        this.PCMRef = React.createRef()
        this.state = {
            selectMethod: 0,
            searchKeyword: '',
            total: 0,
            isLoading: false,
            pageNum: 1,
            isModalVisible: false,
            currentCase: {},
            data: [],
        }
        this.pageSize = 8
        this.columns = this.initeColumns()
    }

    initeColumns = () => (
        [
            {
                title: '',
                width: '3%',
                dataIndex: 'orderId',
                ellipsis: true,
                render: (id) => (
                    <Tooltip title={id}>
                            <span className={'project-api-case-cell'}>
                                {id}
                            </span>
                    </Tooltip>
                )
            },
            {
                title: '请求方式',
                width: '7%',
                dataIndex: 'requestMehod',
                ellipsis: true,
                render: (method) => {
                    let methodToStr
                    if (method === 1) {
                        methodToStr = 'Get'
                    } else if (method === 2) {
                        methodToStr = 'Post'
                    } else {
                        methodToStr = 'Undefind'
                    }
                    return (
                        <Tooltip title={methodToStr}>
                            <span className={'project-api-case-cell'}>
                                {methodToStr}
                            </span>
                        </Tooltip>
                    )
                }
            },
            {
                title: '用例名称',
                width: '14%',
                dataIndex: 'caseName',
                ellipsis: true,
                render: (name) => (
                    <Tooltip title={name}>
                        <span className={'project-api-case-cell'}>
                            {name}
                        </span>
                    </Tooltip>
                )
            },
            {
                title: '请求域名',
                width: '18%',
                dataIndex: 'requestHost',
                ellipsis: true,
                render: (host) => (
                    <Tooltip title={host.realHost}>
                        <span className={'project-api-case-cell'}>
                            {host.realHost}
                        </span>
                    </Tooltip>
                )
            },
            {
                title: '请求路径',
                width: '15%',
                dataIndex: 'requestPath',
                ellipsis: true,
                render: (path) => (
                    <Tooltip title={path}>
                        <span className={'project-api-case-cell'}>
                            {path}
                        </span>
                    </Tooltip>
                )
            },
            {
                title: '请求头部',
                width: '10%',
                dataIndex: 'requestHeaders',
                render: (headers) => (
                    <Tooltip title={getStrDataFromJson(headers)}>
                        <div className={'project-api-case-cell'}>
                            {getStrDataFromJson(headers)}
                        </div>
                    </Tooltip>
                )
            },
            {
                title: '请求参数',
                width: '10%',
                dataIndex: 'requestQuery',
                render: (query) => (
                    <Tooltip title={getStrDataFromJson(query)}>
                        <div className={'project-api-case-cell'}>
                            {getStrDataFromJson(query)}
                        </div>
                    </Tooltip>
                )
            },
            {
                title: '请求主体',
                width: '10%',
                dataIndex: 'requestBody',
                render: (body) => (
                    <Tooltip title={getStrDataFromJson(body)}>
                        <div className={'project-api-case-cell'}>
                            {getStrDataFromJson(body)}
                        </div>
                    </Tooltip>
                )
            },
            {
                title: '操作',
                width: '13%',
                ellipsis: true,
                render: (item) => {
                    return (
                        <span className='project-case-card-body-table-action'>
                            <Button
                                type='primary'
                                shape="circle"
                                icon={<FormOutlined/>}
                                size='small'
                                onClick={() => {
                                    this.setState({isModalVisible: true, currentCase: item})
                                }}
                            />
                            <Button
                                type='primary'
                                shape="circle"
                                icon={<CloseOutlined/>}
                                danger
                                size='small'
                                onClick={() => {
                                    this.onDelete(item)
                                }}
                            />
                        </span>
                    )
                }
            }
        ]
    )

    componentDidMount() {
        this.getData(1)
    }

    onDelete = async (item) => {
        confirm({
            title: '是否确认删除?',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            maskClosable: true,
            onOk: async () => {
                let resData = await deleteApiCaseById(item.id, this.projectId)
                if (resData.status !== 1) {
                    message.warning(resData.error)
                    return Promise.reject(resData.error)
                } else {
                    message.success('删除用例成功')
                    this.getData(this.state.pageNum)
                }
            },
            onCancel: this.setState({isModalVisible: false}),
        });
    }
    getData = async (pageNum) => {
        this.setState({isLoading: true})
        const resData = await getApiCaseByCondition(
            this.projectId, pageNum, this.pageSize, this.state.selectMethod, this.state.searchKeyword
        )
        if (resData.status === 1) {
            const total = resData.data.total
            const dataInit = resData.data.data
            if (dataInit.length === 0 && pageNum > 1) {
                return this.getData(pageNum - 1)
            }
            const data = dataInit.map(item => {
                return {
                    id: item.id,
                    orderId: item.order_id,
                    caseName: item.name,
                    requestMehod: item.method,
                    requestHost: {
                        isUseEnv: item.is_use_env,
                        requestHost: item.request_host,
                        envHost: item.env_host ? item.env_host : undefined,
                        realHost: item.real_host,
                    },
                    requestPath: item.request_path,
                    requestHeaders: item.request_headers,
                    requestQuery: item.request_query,
                    requestBody: item.request_body,
                }
            })
            this.setState({
                total,
                data,
                isLoading: false,
                pageNum: pageNum
            })
        } else {
            message.warning(resData.error)
            this.setState({isLoading: false})
        }

    }
    onCancel = () => {
        this.setState({isModalVisible: false, currentCase: {}})
    }
    onOk = () => {
        this.PCMRef.current.formRef.current.validateFields()
            .then(async (value) => {
                value = {...value, projectId: this.projectId}
                if (this.state.currentCase.id) {
                    const res = await updateProjectApiCase({...value, id: this.state.currentCase.id})
                    if (res.status === 1) {
                        this.setState({isModalVisible: false})
                        message.success('更新用例成功')
                        this.getData(this.state.pageNum)
                    } else {
                        message.warning(res.error)
                    }
                } else {
                    const res = await createProjectApiCase(value)
                    if (res.status === 1) {
                        this.setState({isModalVisible: false})
                        message.success('新增用例成功')
                        this.getData(this.state.pageNum)
                    } else {
                        message.warning(res.error)
                    }
                }
            })
            .catch(_ => {
            })
    }
    onMethodChange = (value) => {
        this.setState({selectMethod: value}, () => {
            this.getData(this.state.pageNum)
        })

    }

    render() {
        const title = (
            <div className='project-case-card-title'>
                <Select
                    value={this.state.selectMethod}
                    className='project-case-card-title-select-method'
                    onChange={(value) => {
                        this.onMethodChange(value)
                    }}
                    bordered={false}
                >
                    <Select.Option value={0}>全部</Select.Option>
                    <Select.Option value={1}>Get</Select.Option>
                    <Select.Option value={2}>Post</Select.Option>
                </Select>
                <Input
                    placeholder='请输入关键字'
                    className='project-case-card-title-input'
                    value={this.state.searchKeyword}
                    onChange={(e) => {
                        this.setState({searchKeyword: e.target.value})
                    }}
                    onPressEnter={() => {
                        this.getData(1)
                    }}
                    allowClear={true}
                />
                <Button
                    type='primary'
                    onClick={() => {
                        this.getData(1)
                    }}
                >搜索</Button>
            </div>
        )
        const extra = (
            <Button
                type='primary'
                icon={<PlusOutlined/>}
                onClick={() => {
                    this.setState({isModalVisible: true, currentCase: {}})
                }}
            />
        )
        return (
            <React.Fragment>
                <Card
                    title={title}
                    extra={extra}
                    bordered={false}
                    className='project-case-card'
                    bodyStyle={{height: '100%'}}
                >
                    <Table
                        className='project-case-card-body-table'
                        dataSource={this.state.data}
                        columns={this.columns}
                        size='middle'
                        // bordered
                        tableLayout='fixed'
                        loading={this.state.isLoading}
                        rowKey={item => item.id}
                        pagination={{
                            current: this.state.pageNum,
                            defaultPageSize: this.pageSize,
                            showQuickJumper: true,
                            onChange: (page) => {
                                this.getData(page)
                            },
                            total: this.state.total,
                        }}
                    />
                </Card>
                <Modal
                    className='project-case-modal'
                    visible={this.state.isModalVisible}
                    onCancel={this.onCancel}
                    width={1000}
                    title='用例编辑'
                    destroyOnClose={true}
                    onOk={this.onOk}
                    centered={true}
                    bodyStyle={{height: 480}}
                    maskClosable={false}
                >
                    <ProjectApiCaseModal
                        ref={this.PCMRef}
                        initValue={this.state.currentCase}
                        projectId={this.projectId}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

export default ProjectApiCase;
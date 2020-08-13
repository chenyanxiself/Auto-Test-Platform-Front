import React from 'react';
import {Table, Input, Form, Button, message, Modal} from 'antd';
import {getEnvByProjectId, updateProjectEnv, createProjectEnv,deleteProjectEnv} from '../../api'

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `必填!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

class Env extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            currentEnv: {},
            isModalVisible: false
        }
        this.form = React.createRef()

        this.columns = [
            {
                title: '环境名',
                dataIndex: 'name',
                width: '30%',
                editable: true,
            },
            {
                title: '域名',
                dataIndex: 'host',
                width: '40%',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: '30%',
                render: (_, record) => {
                    const editable = this.state.currentEnv.id === record.id;
                    return editable ? (
                        <span>
                            <Button
                                onClick={() => this.save(record)}
                                style={{
                                    marginRight: 8,
                                }}
                                ghost={true}
                                type={"primary"}
                                size={"small"}
                            >
                              保存
                            </Button>
                            <Button
                                onClick={() => this.setState({currentEnv: {}})}
                                ghost={true}
                                type={"primary"}
                                size={"small"}
                                style={{
                                    marginRight: 8,
                                }}
                            >取消</Button>
                            <Button
                                onClick={()=>this.onDelete(record)}
                                type={"primary"}
                                size={"small"}
                                danger={true}
                            >删除</Button>
                        </span>
                    ) : (
                        <Button
                            onClick={() => this.edit(record)}
                            ghost={true}
                            type={"primary"}
                            size={"small"}
                            disabled={!!this.state.currentEnv.id}
                        >
                            修改
                        </Button>
                    );
                },
            },
        ];
    }
    onDelete=async (record)=>{
        const res=await deleteProjectEnv(this.props.projectId,record.id)
        if (res.status===1){
            message.success('删除成功')
            this.setState({currentEnv:{}})
            this.getData()
        }else {
            message.warning(res.error)
        }
    }
    getData = async () => {
        const res = await getEnvByProjectId(this.props.projectId)
        if (res.status === 1) {
            this.setState({dataSource: res.data})
        } else {
            message.warning(res.error)
        }

    }

    componentDidMount() {
        this.getData()
    }

    edit = record => {
        this.form.current.setFieldsValue({
            name: '',
            host: '',
            ...record,
        });
        this.setState({currentEnv: record})
    };


    save = async value => {
        try {
            const row = await this.form.current.validateFields()
            const res = await updateProjectEnv(this.props.projectId, value.id, row.name, row.host)
            if (res.status === 1) {
                message.success('修改成功')
                this.setState({currentEnv:{}})
            } else {
                message.warning(res.error)
            }
        } catch (e) {
            console.log(e)
        }
    };

    mergedColumns = () => {
        return this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.state.currentEnv.id === record.id,
                }),
            };
        });
    }
    onFinish = async value => {
        const res = await createProjectEnv(this.props.projectId, value.envName, value.envHost)
        if (res.status === 1) {
            message.success('新增成功')
            this.setState({isModalVisible: false})
            this.getData()
        } else {
            message.warning(res.error)
        }
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    onClick={() => {
                        this.setState({isModalVisible: true})
                    }}
                    type={"primary"}
                    style={{marginBottom: 15}}
                >添加</Button>
                <Form ref={this.form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        dataSource={this.state.dataSource}
                        columns={this.mergedColumns()}
                        rowClassName="editable-row"
                        pagination={false}
                        rowKey={'id'}
                        size={'small'}
                    />

                </Form>
                <Modal
                    visible={this.state.isModalVisible}
                    onCancel={() => this.setState({isModalVisible: false})}
                    title='新增环境'
                    destroyOnClose={true}
                    // centered={true}
                    footer={false}
                >
                    <Form
                        onFinish={this.onFinish}
                        labelCol={{span: 6}}
                        wrapperCol={{span: 14}}
                    >
                        <Form.Item
                            name={'envName'}
                            label={'环境名称'}
                            rules={[{required: true, message: '必填'}]}
                        >
                            <Input placeholder={'请输入环境名称'} autoComplete={'off'}/>
                        </Form.Item>
                        <Form.Item
                            name={'envHost'}
                            label={'环境域名'}
                            rules={[{required: true, message: '必填'}]}
                        >
                            <Input placeholder={'请输入环境域名'} autoComplete={'off'}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 6}}>
                            <Button htmlType={"submit"} type={"primary"}>提交</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}

export default Env;

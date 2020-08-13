import React, {Component} from 'react';
import {Tooltip, Tree, Modal, Form, Input, message, Button} from "antd";
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    OrderedListOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import './moduleTree.scss'
import {createModule, updateModule, getAllModule, deleteModule} from '../../api'

const {confirm} = Modal;

class ModuleTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // selectKeys: [],
            currentModule: {},
            isModalVisible: false,
            dataSource: [],
            option: 0, //0创建根模块 1 创建子模块 2修改模块
        };
    };

    getDeleteIdList = (id) => {

        function getTargetTotal(source, targetId)  {
            if (source.id === targetId) {
                return source
            } else {
                if (source.children) {
                    var result=null
                    for (var i = 0;i<source.children.length;i++){
                        result=getTargetTotal(source.children[i], targetId)
                    }
                    return result
                }
            }
            return null
        }
        function getIdList(data, targetList){
            data.forEach(item => {
                targetList.push(item.id)
                if (item.children) {
                    getIdList(item.children, targetList)
                }
            })
        }
        var returnData=null
        for(var i=0;i<this.state.dataSource.length;i++){
            const data = getTargetTotal(this.state.dataSource[i],id)
            if (data){
                returnData=data
                break
            }
        }
        var idList = []
        getIdList([returnData], idList)
        return idList
    }
    onDelete = (id) => {
        confirm({
            title: '是否确认删除?',
            icon: <ExclamationCircleOutlined/>,
            content: '若存在子模块,则会一并删除',
            onOk: async () => {
                const idList = this.getDeleteIdList(id)
                const res = await deleteModule(idList, this.props.projectId)
                if (res.status === 1) {
                    message.success('删除成功')
                    this.getData()
                } else {
                    message.warning(res.error)
                    return Promise.reject(res.error)
                }
            },
            maskClosable: true
        });
    }
    renderTitle = (item) => {
        return (
            <div>
                <div style={{float: "left"}}>
                    <div style={{width:100,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{item.name}</div>
                </div>
                {this.props.selectedModule[0] === item.key ?
                    <div style={{float: "right"}}>
                        <Tooltip title={'修改'}>
                            <EditOutlined
                                className={'module-icon'}
                                onClick={() => this.setState({
                                    isModalVisible: true,
                                    option: 2,
                                    currentModule:item
                                })}
                            />
                        </Tooltip>
                        <Tooltip title={'添加子模块'}>
                            <PlusCircleOutlined
                                className={'module-icon'}
                                onClick={() => this.setState({
                                    isModalVisible: true,
                                    option: 1,
                                    currentModule:item
                                })}
                            />
                        </Tooltip>
                        <Tooltip title={'删除'}>
                            <DeleteOutlined
                                className={'module-icon'}
                                onClick={() => this.onDelete(item.id)}
                            />
                        </Tooltip>
                    </div> : null}
            </div>
        )
    }

    processData = (list) => {
        let curList = list.map(item => {
            return {
                title: this.renderTitle,
                key: item.id,
                name: item.name,
                id: item.id,
                parentId: item.parent_id
            }
        })
        //筛选出 包含parentId的数组；
        let parents = curList.filter(value => value.parentId === 0);
        //筛选出 包含不parentId的数组；
        let childrens = curList.filter(value => value.parentId !== 0);
        let initList = list.map(item => {
            return {
                title: item.name,
                key: item.id,
                value: item.id,
                id: item.id,
                parentId: item.parent_id
            }
        })
        //筛选出 包含parentId的数组；
        let initParents = initList.filter(value => value.parentId === 0);
        //筛选出 包含不parentId的数组；
        let initChildrens = initList.filter(value => value.parentId !== 0);
        //运用递归方法将子数组插入到父数组
        let translator = (parents, childrens) => {
            //遍历每一个父数组
            parents.forEach((parent) => {
                //遍历子数组 判断子节点的parentId等于父数组的id，
                childrens.forEach((child, index) => {
                    if (child.parentId === parent.id) {
                        //对子节点数据进行深复制
                        let temp = [...childrens];
                        //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                        temp.splice(index, 1);
                        //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                        translator([child], temp);
                        //把找到子节点放入父节点的ChildNodes属性中
                        typeof parent.children !== 'undefined' ? parent.children.push(child) : parent.children = [child];
                    }
                })

            })
        };
        translator(parents, childrens)
        translator(initParents, initChildrens)

        //返回最终的结果
        return {
            currentData:parents,
            initData:initParents
        }
    }

    getData = async () => {
        const res = await getAllModule(this.props.projectId)
        if (res.status === 1) {
            const {currentData,initData} = this.processData(res.data)
            this.props.updateModuleTree(initData)
            this.setState({
                dataSource:currentData
            })
        } else {
            message.warning(res.error)
        }
    }


    componentDidMount() {
        this.getData()
    }

    getModalTitle = () => {
        switch (this.state.option) {
            case 0:
                return '创建根模块'
            case 1:
                return '创建子模块'
            case 2:
                return '修改子模块'
            default:
                return '创建根模块'
        }
    }

    onSelect = (keys, {node}) => {
        if (keys.length !== 0) {
            const currentModule = {
                name: node.name,
                id: node.id,
                parentId: node.parentId
            }
            this.setState({currentModule})
            this.props.updateSelectedModule(keys)
        }
    }

    renderTree = () => {
        if (this.state.dataSource.length === 0) {
            return null
        } else {
            return (
                <Tree
                    showLine={true}
                    treeData={this.state.dataSource}
                    blockNode={true}
                    onSelect={this.onSelect}
                    selectedKeys={this.props.selectedModule}
                    defaultExpandAll={true}
                />
            )
        }
    }
    onFinish = async (value) => {
        var res
        if (this.state.option === 0) {
            res = await createModule(value.name, 0, this.props.projectId)
        } else if (this.state.option === 1) {
            res = await createModule(value.name, this.state.currentModule.id, this.props.projectId)
        } else {
            res = await updateModule(value.name, this.state.currentModule.id, this.props.projectId, this.state.currentModule.parentId)
        }
        if (res.status === 1) {
            message.success(this.state.option === 2 ? '编辑成功' : '创建成功')
            this.setState({isModalVisible: false})
            this.getData()
        } else {
            message.warning(res.error)
        }

    }

    render() {
        return (
            <div>
                <div className={'project-case-left-title'}>
                    <OrderedListOutlined style={{marginRight: 20}}/>
                    <span>模块列表</span>
                    <Button
                        icon={<PlusOutlined/>}
                        type={"primary"}
                        style={{float: "right"}}
                        onClick={() => {
                            // this.props.updateSelectedModule([])
                            this.setState({
                                option: 0,
                                isModalVisible: true,
                                // selectKeys: [],
                                currentModule: {},
                            })
                        }}
                    />
                </div>
                <div>
                    {this.renderTree()}
                    <Modal
                        title={this.getModalTitle()}
                        visible={this.state.isModalVisible}
                        destroyOnClose={true}
                        footer={false}
                        onCancel={() => this.setState({isModalVisible: false})}
                    >
                        <Form
                            initialValues={{
                                name: this.state.option === 2 ? this.state.currentModule.name : null
                            }}
                            onFinish={this.onFinish}
                        >
                            <Form.Item
                                label={'模块名'}
                                name={'name'}
                                rules={[{required: true, message: '必填'}]}
                                wrapperCol={{span: 14}}
                                labelCol={{span: 5}}
                            >
                                <Input placeholder={'请输入模块名'} autoComplete={'off'}/>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{offset: 5}}
                            >
                                <Button htmlType={"submit"} type={"primary"}>提交</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    };
}

export default ModuleTree;
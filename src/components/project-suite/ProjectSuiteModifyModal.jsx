import React, {Component} from 'react';
import {Table, Button, Input} from 'antd'

class ProjectSuiteModifyModal extends Component {
    constructor(props) {
        super(props);
        const initSelectedRowKeys=this.props.currentSuite.relation.map(item=>{
            return item.case_id
        })
        this.state = {
            selectedRowKeys: initSelectedRowKeys,
            data: this.props.currentSuite.totalCaseList,
            searchKeyword: ''
        };
        this.columns = [
            {
                title: '编号',
                dataIndex: 'order_id',
            },
            {
                title: '用例名',
                dataIndex: 'name',
            },
            {
                title: '请求方式',
                dataIndex: 'method',
                render:(method)=>{
                    return method===1?'Get':'Post'
                }
            },
            {
                title: '请求域名',
                dataIndex: 'real_host',
            },
        ]
    };

    getData = async () => {
        if (this.state.searchKeyword){
            const newData = this.props.currentSuite.totalCaseList.filter(item=>item.name.indexOf(this.state.searchKeyword)!==-1)
            this.setState({
                data: newData
            })
        }else {
            this.setState({
                data:this.props.currentSuite.totalCaseList
            })
        }
    }


    getSelectedKeys = () => {
        return this.state.selectedRowKeys
    }
    onSelectChange = selectedRowKeys => {
        this.setState({selectedRowKeys});
    };

    render() {
        const {selectedRowKeys} = this.state;
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Input
                        placeholder='请输入关键字'
                        value={this.state.searchKeyword}
                        onChange={(e) => {
                            this.setState({searchKeyword: e.target.value})
                        }}
                        onPressEnter={() => {
                            this.getData()
                        }}
                        allowClear={true}
                        style={{width: 200, marginRight: 10}}
                        // size={'small'}
                    />
                    <Button
                        type='primary'
                        // size={'small'}
                        onClick={() => {
                            this.getData()
                        }}
                    >搜索</Button>
                </div>
                <Table
                    rowSelection={
                        {
                            selectedRowKeys,
                            onChange: this.onSelectChange,
                        }
                    }
                    columns={this.columns}
                    dataSource={this.state.data}
                    rowKey={(item) => item.id}
                    pagination={false}
                    size={'small'}
                />
            </div>
        );
    }
}

export default ProjectSuiteModifyModal;
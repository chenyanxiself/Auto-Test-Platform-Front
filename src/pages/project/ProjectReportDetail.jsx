import React, {Component} from 'react';
import {PageHeader, Tabs, message, Descriptions,Table} from 'antd';
import ReactEcharts from "echarts-for-react";
import {getReportDetail} from '../../api'
import {getStrDataFromJson} from '../../util/commonUtil'
const {TabPane} = Tabs;


class ProjectReportDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resChartOption: {},
            statusChartOption: {},
            overview: {
                detail:[]
            }
        };
        this.projectId = this.props.match.params.id
        this.reportId = this.props.match.params.reportId
        this.columns = [
            {title:'用例名',dataIndex:'case_name',ellipsis:true},
            {title:'域名',dataIndex:'host',ellipsis:true},
            {title:'路径',dataIndex:'path',ellipsis:true},
            {title:'状态码',dataIndex:'status',ellipsis:true},
            {title:'状态',dataIndex:'is_success',ellipsis:true,render:(value)=>{return value===1?'成功':'失败'}},
            {title:'请求头',dataIndex:'headers',ellipsis:true,render:(value)=>{return getStrDataFromJson(value)}},
            {title:'请求参数',dataIndex:'params',ellipsis:true,render:(value)=>{return getStrDataFromJson(value)}},
            {title:'请求主体',dataIndex:'body',ellipsis:true,render:(value)=>{return getStrDataFromJson(value)}},
        ]
    };

    getData = async () => {
        const res = await getReportDetail(this.reportId,this.projectId)
        if (res.status === 1) {
            const resOption = [
                {value: res.data.success_case_num, name: '成功'},
                {value: res.data.failed_case_num, name: '失败'},
            ]
            const statusOption = []
            Object.keys(res.data.status_code_distribution).forEach(key => {
                statusOption.push({value: res.data.status_code_distribution[key], name: key})
            })
            this.setState({
                resChartOption: this.getOption('用例执行情况', resOption),
                statusChartOption: this.getOption('状态码分布', statusOption),
                overview: res.data
            })
        } else {
            message.warning(res.error)
        }
    }

    componentDidMount() {
        this.getData()
    }

    getOption = (title, data) => {
        const columns = data.map(item => {
                return item.name
            }
        )
        return {
            title: {
                text: title,
                left: 'center'
            }
            ,
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            }
            ,
            legend: {
                orient: 'vertical',
                left: 'left',
                data: columns
            }
            ,
            series: [
                {
                    name: '执行信息',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '60%'],
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    render() {
        return (
            <div>
                <PageHeader
                    onBack={() => this.props.history.goBack()}
                    title="报告详情"
                />
                <Tabs
                    defaultActiveKey="1"
                    style={{padding: '0 20px'}}
                >
                    <TabPane tab="概况" key="1">
                        <Descriptions title="执行概况" column={4} style={{margin: '30px 0'}}>
                            <Descriptions.Item label="测试集名">{this.state.overview.suite_name}</Descriptions.Item>
                            <Descriptions.Item label="项目名">{this.state.overview.project_name}</Descriptions.Item>
                            <Descriptions.Item label="报告名">{this.state.overview.report_name}</Descriptions.Item>
                            <Descriptions.Item label="创建者">{this.state.overview.cname}</Descriptions.Item>
                            <Descriptions.Item
                                label="全局域名">{this.state.overview.global_host ? this.state.overview.global_host : '无'}</Descriptions.Item>
                            <Descriptions.Item
                                label="全局请求头">{this.state.overview.global_headers ? this.state.overview.global_headers : '无'}</Descriptions.Item>
                            <Descriptions.Item
                                label="是否保存cookie">{this.state.overview.is_save_cookie ? '是' : '否'}</Descriptions.Item>
                            <Descriptions.Item label="用例总数">{this.state.overview.total_case_num}</Descriptions.Item>
                            <Descriptions.Item label="成功用例数">{this.state.overview.success_case_num}</Descriptions.Item>
                            <Descriptions.Item label="失败用例数">{this.state.overview.failed_case_num}</Descriptions.Item>

                        </Descriptions>
                        <div>
                            <div style={{width: '50%', float: "left"}}>
                                <ReactEcharts
                                    option={this.state.resChartOption}
                                />
                            </div>
                            <div style={{width: '50%', float: "left"}}>
                                <ReactEcharts
                                    option={this.state.statusChartOption}
                                />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="用例详情" key="2">
                        <Table
                            columns={this.columns}
                            rowKey={'id'}
                            size={'small'}
                            expandable={{
                                expandedRowRender: record => <p style={{ margin: 0 }}>{record.response}</p>,
                            }}
                            dataSource={this.state.overview.detail}
                        />
                    </TabPane>
                </Tabs>
            </div>

        );
    }
    ;
}

export default ProjectReportDetail;
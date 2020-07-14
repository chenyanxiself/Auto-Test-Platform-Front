import React, {Component} from 'react';
import {PageHeader, Tabs, message} from 'antd';
import ReactEcharts from "echarts-for-react";
import {getReportDetail} from '../../api'

const {TabPane} = Tabs;


class ProjectReportDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resChartOption: {},
            statusChartOption: {}
        };
        this.projectId = this.props.match.params.id
        this.reportId = this.props.match.params.reportId
    };

    getData = async () => {
        const res = await getReportDetail(this.reportId)
        if (res.status === 1) {
            const resOption = [
                {value: res.data.success_case_num,name:'成功'},
                {value: res.data.failed_case_num,name:'失败'},
            ]
            const statusOption = []
            Object.keys(res.data.status_code_distribution).forEach(key => {
                statusOption.push({value: res.data.status_code_distribution[key], name: key})
            })
            this.setState({
                resChartOption: this.getOption('用例执行情况', resOption),
                statusChartOption: this.getOption('状态码分布', statusOption)
            })
        } else {
            message.warning(res.error)
        }
    }

    componentDidMount() {
        this.getData()

    }

    getOption = (title, data) => {
        // data = [
        //     {value: 6, name: '直接访问'},
        //     {value: 2, name: '邮件营销'},
        //     {value: 12, name: '联盟广告'},
        // ]
        // title='用例执行情况'
        return {
            backgroundColor: '#fff',
            title: {
                text: title,
                left: 'left',
                top: 20,
            },

            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {}
            },
            series: [
                {
                    name: '报告详情',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: data.sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    labelLine: {
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        }
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
                        Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </div>

        );
    };
}

export default ProjectReportDetail;
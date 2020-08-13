import React, {Component} from 'react';
import {Avatar, Card, Col, message, Row, Statistic, Table} from 'antd'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import './workStation.scss'
import {getWorkstationProjects} from '../../api'

class WorkStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            underwayProjects:[],
            partedProjects:[],
            myReports:[],
            totalProjectsNum:0,
            totalUnderwayProjectsNum:0
        }
        this.reportColumns = [
            {
                title:'报告名',
                dataIndex:'report_name',
                width:'70%'
            },
            {
                title:'操作',
                render:(item)=>{
                    return <Link to={`/project/${item.project_id}/testReport/${item.id}/detail`}>查看</Link>
                }
            }
        ]
    }
    getData=async()=>{
        const res = await getWorkstationProjects()
        if (res.status===1){
            this.setState({
                underwayProjects:res.data.underway_projects,
                partedProjects:res.data.parted_projects,
                myReports:res.data.my_reports,
                totalProjectsNum:res.data.total_projects_num,
                totalUnderwayProjectsNum:res.data.total_underway_projects_num
            })
        }else {
            message.warning(res.error)
        }
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        let {cname, email} = this.props.user
        const headerContent = (
            <div className={'workstation-header-main'}>
                <div className={'workstation-header-avatar'}>
                    <Avatar size={"large"}>
                        <div className={'workstation-header-avatar-text'}>
                            {cname ? cname.substring(cname.length - 2, cname.length) : null}
                        </div>
                    </Avatar>
                </div>
                <div className={'workstation-header-content'}>
                    <div className={'workstation-header-title'}>
                        你好，
                        {cname}
                        ，祝你开心每一天！
                    </div>
                    <div>
                        {email}
                    </div>
                </div>
            </div>
        )
        const extra = (
            <div className={'workstation-extra'}>
                <div className={'workstation-extra-item'}>
                    <Statistic
                        title={'项目总数'}
                        value={this.state.totalUnderwayProjectsNum}
                        suffix={`/ ${this.state.totalProjectsNum}`}
                    />
                </div>
                {/*<div className={'workstation-extra-item'}>*/}
                {/*    <Statistic title={'项目数'} value={56}/>*/}
                {/*</div>*/}
            </div>
        )
        return (
            <div className={'workstation-main'}>
            <Card
                title={headerContent}
                extra={extra}
                bordered={false}
                bodyStyle={{
                    backgroundColor:'#f0f2f5',
                    paddingLeft: 0,
                    paddingRight: 0,
                    width:'100%'
                }}
            >
                <Row>
                    <Col xl={15} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{marginBottom: 24}}
                            title={'我参与的项目'}
                            bordered={false}
                            extra={<Link to={'/project'}>全部项目</Link>}
                            bodyStyle={{padding: 0}}
                        >
                            {this.state.partedProjects.map(item=>{
                                return (
                                    <Card.Grid
                                        key={item.id}
                                        className={'workstation-grid'}
                                        onClick={()=>this.props.history.push(`/project/${item.id}/overview`)}
                                    >
                                        <Card.Meta
                                            title={item.name}
                                            description={<div className={'workstation-grid-remark'}>{item.remark}</div>}
                                            avatar={<Avatar src={item.url}/>}
                                        />
                                    </Card.Grid>
                                )
                            })}
                        </Card>
                        <Card
                            style={{marginBottom: 24}}
                            title={'进行中的项目'}
                            bordered={false}
                            extra={<Link to={'/project'}>全部项目</Link>}
                            bodyStyle={{padding: 0}}
                        >
                            {this.state.underwayProjects.map(item=>{
                                return (
                                    <Card.Grid
                                        key={item.id}
                                        className={'workstation-grid'}
                                        onClick={()=>this.props.history.push(`/project/${item.id}/overview`)}
                                    >
                                        <Card.Meta
                                            title={item.name}
                                            description={<div className={'workstation-grid-remark'}>{item.remark}</div>}
                                            avatar={<Avatar src={item.url}/>}
                                        />
                                    </Card.Grid>
                                )
                            })}
                        </Card>
                    </Col>
                    <Col xl={1} lg={0} md={0} sm={0} xs={0}/>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{marginBottom: 24}}
                            title={'我的测试报告'}
                            bordered={false}
                        >
                            <Table
                                columns={this.reportColumns}
                                showHeader={false}
                                dataSource={this.state.myReports}
                                rowKey={'id'}
                                pagination={false}
                                size={'small'}
                            />
                        </Card>
                    </Col>

                </Row>
            </Card>
            </div>
        );
    }
}

export default connect(
    state => ({user: state.user}),
    null
)(WorkStation);
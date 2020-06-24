import React, { Component } from 'react';
import Left from '../../components/left-nav/Left'
import { Layout } from "antd";
import { Redirect, Switch, Route } from 'react-router-dom'
import './home.scss'
import ProjectHeader from '../../components/header-nav/ProjectHeader'
import homeRoute from '../../route/homeRoute'
import { getCurrentUser } from '../../api/index'
import {connect} from 'react-redux'
import {setCurrentUser} from '../../store/actionFactory'
const { Footer, Sider, Content, Header } = Layout;
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        getCurrentUser()
            .then(res => {
                this.props.setCurrentUser(res.data)
            })
    }
    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <Left></Left>
                </Sider>
                <Layout>
                    <Header style={{ backgroundColor: 'white' }}>
                        <ProjectHeader></ProjectHeader>
                    </Header>
                    <Content style={{ margin: '20px', backgroundColor: '#fff', padding: '10px 10px' }}>
                        <Switch>
                            {/* 必须加exact */}
                            <Redirect from='/' to='/overview' exact></Redirect>
                            {
                                homeRoute.map((item, index) => {
                                    return (
                                        <Route
                                            key={index + 1}
                                            path={item.path}
                                            component={item.component}
                                            exact={item.exact}
                                        ></Route>
                                    )
                                })
                            }
                            <Redirect to='/overview'></Redirect>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>底部待修改</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default connect(
    null,
    {setCurrentUser}
)(Home);
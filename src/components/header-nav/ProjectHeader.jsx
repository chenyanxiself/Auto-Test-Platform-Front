import React, {Component} from 'react';
import {Menu, Avatar, Popover} from 'antd'
import './projectHeader.scss'
import projectMenuList from '../../util/projectMenuList'
import {withRouter} from 'react-router-dom'
import {getProjectIdByPath} from '../../util/commonUtil'
import {connect} from 'react-redux'
import LinkButton from '../../components/link-button/LinkButton'
import storeageUtil, {key} from '../../util/storeageUtil'

class ProjectHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: []
        }
    }

    onMenuClick = (item) => {
        let {key} = item
        const projectId = getProjectIdByPath(this.props.history.location.pathname)
        const url = key.replace(':id', projectId)
        if (url !== this.props.history.location.pathname) {
            this.props.history.push(url)
        }
    }
    logout = () => {
        storeageUtil.remove(key.TOKEN)
        this.props.history.push('/login/')
    }
    handleUserInfo = () => {
        if (this.props.history.location.pathname!==`/user/info`){
            this.props.history.push(`/user/info`)
        }
    }

    render() {
        let selectedItem = projectMenuList.find(item => (item.regExp.test(this.props.history.location.pathname)))
        let isShowMenu = !!selectedItem
        let key = selectedItem ? [selectedItem.path] : []
        let cname = this.props.user.cname
        const content = (
            <div>
                <LinkButton onClick={this.handleUserInfo} className='project-header-user-button'>个人信息</LinkButton>
                <LinkButton onClick={this.logout} className='project-header-user-button'>退出</LinkButton>
            </div>
        )
        return (
            <div className='project-header'>
                {isShowMenu ?
                    <Menu
                        className='project-header-menus'
                        theme="light"
                        mode="horizontal"
                        onClick={this.onMenuClick}
                        selectedKeys={key}
                    >
                        {projectMenuList.map(item => {
                            return (
                                <Menu.Item key={item.path} icon={item.icon}>{item.name}</Menu.Item>
                            )
                        })}
                    </Menu>
                    : null}
                <div className='project-header-user'>
                    <Popover
                        content={content}
                        placement="bottom"
                    >
                        <Avatar className='project-header-user-avatar' size='default'>
                            {cname ? cname.substring(cname.length - 2, cname.length) : null}
                        </Avatar>
                    </Popover>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({user: state.user}),
    null
)(withRouter(ProjectHeader));

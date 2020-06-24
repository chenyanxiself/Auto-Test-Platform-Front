import React, { Component } from 'react';
import { Menu } from 'antd';
import menuList from '../../util/menuList'
import { withRouter } from 'react-router-dom';
const { SubMenu } = Menu;

class Menus extends Component {
    constructor(props){
        super(props)
        this.state = this.init()
    }
    init=()=>{
        const pathname = this.props.history.location.pathname
        return menuList.reduce((pre,cur)=>{
            if(cur.childMenu.length>0){
                pre.rootSubmenuKeys.push(cur.path)
                const isSelected = cur.childMenu.find(item=>item.regExp.test(pathname))
                if(isSelected){
                    pre.openKeys.push(cur.path)
                    pre.selectedKeys.push(isSelected.path)
                }
            }else{
                if(cur.regExp.test(pathname)){
                    pre.selectedKeys.push(cur.path)
                }
            }
            return pre
        },{
            selectedKeys:[],
            openKeys: [],
            rootSubmenuKeys:[]
        });
    }
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };
    onMenuClick=(item)=>{
        let {key, keyPath} = item
        this.setState({selectedKeys:keyPath})
        this.props.history.push(key)
    }
    render() {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                theme='dark'
                onClick={this.onMenuClick}
                selectedKeys={this.state.selectedKeys}
            >
                {
                    menuList.map(item => {
                        if (item.childMenu.length > 0) {
                            return (
                                <SubMenu
                                    key={item.path}
                                    icon={item.icon}
                                    title={item.name}
                                >
                                    {
                                        item.childMenu.map(childItem => (
                                            <Menu.Item
                                                key={childItem.path}
                                            >
                                                {childItem.name}
                                            </Menu.Item>
                                        ))
                                    }
                                </SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item
                                    key={item.path}
                                    icon={item.icon}
                                >
                                    {item.name}
                                </Menu.Item>
                            )
                        }
                    })}
            </Menu>
        );
    }
}


export default withRouter(Menus);
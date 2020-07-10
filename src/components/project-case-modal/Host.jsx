import React, { Component } from 'react';
import { Input, Select, Switch,message } from 'antd';
import {getEnvByProjectId} from '../../api/index'
const { Option } = Select;

class Host extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.props.onChange
        this.initValue = this.props.value
        this.isUpdate = !!this.initValue
        this.state = {
            isUseEnv: this.isUpdate?this.initValue.isUseEnv:true,
            requestHost: this.isUpdate?this.initValue.requestHost:undefined,
            envHost: this.isUpdate?this.initValue.envHost:undefined,
            envSelect:[]
        }
    }
    async componentDidMount (){
        const res = await getEnvByProjectId(this.props.projectId)
        if(res.status===1){
            this.setState({envSelect:res.data})
        }else{
            message.warning('获取环境失败: '+res.error)
        }
    }
    triggerChange = changedValue => {
        if (this.onChange) {
            this.onChange({
                isUseEnv: this.state.isUseEnv,
                requestHost: this.state.requestHost,
                envHost: this.state.envHost,
                ...changedValue,
            });
        }
    };
    onRequestHostChange = e => {
        const newRequestHost = e.target.value
        this.setState({ requestHost: newRequestHost })
        this.triggerChange({ requestHost: newRequestHost })
    };

    onEnvHostChange = newEnvHost => {
        this.setState({ envHost: newEnvHost })
        this.triggerChange({ envHost: newEnvHost })
    };
    onUseEnvChange = (checked) => {
        this.setState({ isUseEnv: checked })
        this.triggerChange({ isUseEnv: checked })
    }
    render() {
        return (
            <span>
                <Switch
                    onChange={this.onUseEnvChange}
                    checked={this.state.isUseEnv}
                    checkedChildren="环境"
                    unCheckedChildren="环境"
                    style={{ marginRight: 5 }}
                />
                {this.state.isUseEnv ?
                    <Select
                        value={this.state.envHost}
                        style={{
                            width: 140,
                        }}
                        onChange={this.onEnvHostChange}
                        placeholder='请选择环境'
                    >
                        {this.state.envSelect.map(item=>{
                            return (
                                <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                        })}
                    </Select> :
                    <Input
                        type="text"
                        value={this.state.requestHost}
                        onChange={this.onRequestHostChange}
                        placeholder='请输入域名'
                        style={{
                            width: 210,
                        }}
                    />}
            </span>
        );
    }
}

export default Host;
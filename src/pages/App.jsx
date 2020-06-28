import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import baseRoute from '../route/baseRoute'
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {
                        baseRoute.map((item, index) => {
                            return (
                                <Route key={index + 1} path={item.path} component={item.component} exact={item.exact} />
                            )
                        })
                    }
                    {/* 若上面路由全都匹配不到时,重定向到首页 */}
                    <Redirect to='/' />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
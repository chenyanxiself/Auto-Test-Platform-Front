import React from 'react';
import ReactDom from 'react-dom'
import 'antd/dist/antd.css';
import {Provider} from 'react-redux'
import store from './store/store'
import App from './pages/App.jsx'
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd'
ReactDom.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
        <App />
        </ConfigProvider>
    </Provider>, document.getElementById('root')
)
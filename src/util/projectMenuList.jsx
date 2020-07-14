import React from 'react';
import {
    ProjectOutlined,
    BlockOutlined,
    BookOutlined,
    SettingOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

export default [
    {
        name:'概览',
        path:'/project/:id/overview',
        regExp:/^\/project\/\d+\/overview\/?$/,
        icon:<ProjectOutlined />
    },
    {
        name:'接口用例',
        path:'/project/:id/case',
        regExp:/^\/project\/\d+\/case\/?$/,
        icon:<BlockOutlined />
    },
    {
        name:'测试集',
        path:'/project/:id/testSuite',
        regExp:/^\/project\/\d+\/testSuite\/?$/,
        icon:<BookOutlined />
    },
    {
        name:'测试报告',
        path:'/project/:id/testReport',
        regExp:/^\/project\/\d+\/testReport\/?/,
        icon:<EnvironmentOutlined />
    },
    {
        name:'项目设置',
        path:'/project/:id/projectSetting',
        regExp:/^\/project\/\d+\/projectSetting\/?$/,
        icon:<SettingOutlined />
    },
]
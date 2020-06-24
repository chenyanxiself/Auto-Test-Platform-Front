import {
    BarsOutlined,
    AppstoreOutlined,
    HomeOutlined

} from '@ant-design/icons';
import React from 'react';
export default [
    {
        name:'我的工作台',
        path:'/overview',
        regExp:/^\/overview\/?$/,
        icon:<HomeOutlined />,
        childMenu:[]
    },
    {
        name:'项目',
        path:'/project',
        regExp:/^\/project\/?/,
        icon:<AppstoreOutlined />,
        childMenu:[]
    },
    {
        name:'管理',
        path:'/manage',
        regExp:/^\/manage\/?&/,
        icon:<BarsOutlined />,
        childMenu:[
            {
                name:'用户管理',
                path:'/manage/user',
                regExp:/^\/manage\/user\/?&/,
            },
        //     {
        //         name:'角色管理',
        //         path:'/manage/role',
        //         regExp:/^\/manage\/role\/?&/,
        //     }
        ]
    },
]
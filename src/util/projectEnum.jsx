import React from "react";
import {ExclamationCircleOutlined} from '@ant-design/icons';
export const priorityEnum={
    1:<span><ExclamationCircleOutlined style={{marginRight:10,color:'green'}}/>低</span>,
    2:<span><ExclamationCircleOutlined style={{marginRight:10,color:'#FF9933'}}/>中</span>,
    3:<span><ExclamationCircleOutlined style={{marginRight:10,color:'#FF0000'}}/>高</span>,
    4:<span><ExclamationCircleOutlined style={{marginRight:10,color:'#CC0000'}}/>最高</span>,
}
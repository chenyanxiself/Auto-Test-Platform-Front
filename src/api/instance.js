import axios from 'axios'
import { message } from 'antd'
import storeageUtil,{key} from '../util/storeageUtil'
const instance = axios.create({
    baseURL: `http://192.168.99.17:8900/api/v1`,
    timeout: 20000,
    headers: {'Content-Type': 'application/json'},
});

instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = storeageUtil.get(key.TOKEN)
    if (token) {
        //将token放到请求头发送给服务器,将tokenkey放在请求头中
        config.headers.Authorization = 'Bearer '+token;     
        //也可以这种写法
        // config.headers['Authorization'] = Token;
         return config;
    }
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (res) {
    // 对响应数据做点什么
    return Promise.resolve(res.data)
}, function (err) {
    if(err.response){
        if(err.response.status===401){
            message.error('登陆失效')
            storeageUtil.remove(key.TOKEN)
            window.location.href='/login'
            return Promise.reject()
        }else{
            console.log(err.response.data)
            message.error(err.message)
            return Promise.reject(err);
        }
    }else{
    // 对响应错误做点什么
    message.error(err.message)
    return Promise.reject(err);
    }
});
export default instance
import Login from '../pages/login/Login'
import Home from '../pages/home/Home'
export default [
    {
        path:'/login',
        exact:true,
        component:Login
    },
    {
        path:'/',
        exact:false,
        component:Home
    }
]

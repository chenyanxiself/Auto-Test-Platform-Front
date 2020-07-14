import Project from '../pages/project/Project'
import ProjectCase from '../pages/project/ProjectCase'
import ProjectSuite from '../pages/project/ProjectSuite'
import ProjectOverview from '../pages/project/ProjectOverview'
import ProjectReport from '../pages/project/ProjectReport.jsx'
import ProjectReportDetail from '../pages/project/ProjectReportDetail'
import ProjectSetting from '../pages/project/ProjectSetting'
import WorkStation from '../pages/workStation/WorkStation'
import UserManage from '../pages/manage/UserManage'
// import RoleManage from '../pages/manage/RoleManage'
import User from '../pages/user/User'
export default [
    {
        path:'/project/:id/overview',
        exact:true,
        component:ProjectOverview
    },
    {
        path:'/project/:id/case',
        exact:true,
        component:ProjectCase
    },
    {
        path:'/project/:id/testSuite',
        exact:true,
        component:ProjectSuite
    },
    {
        path:'/project/:id/testReport',
        exact:true,
        component:ProjectReport
    },
    {
        path:'/project/:id/testReport/:reportId/detail',
        exact:true,
        component:ProjectReportDetail
    },
    {
        path:'/project/:id/projectSetting',
        exact:true,
        component:ProjectSetting
    },
    {
        path:'/overview',
        exact:true,
        component:WorkStation
    },
    {
        path:'/project',
        exact:true,
        component:Project
    },
    {
        path:'/manage/user',
        exact:true,
        component:UserManage
    },
    // {
    //     path:'/manage/role',
    //     exact:true,
    //     component:RoleManage
    // },
    {
        path:'/user/info',
        exact:true,
        component:User
    },
]
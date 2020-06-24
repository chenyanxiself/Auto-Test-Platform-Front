import instance from './instance'


const urls = {
    loginUrl:'/user/login/',
    getCurrentUserUrl:'/user/getCurrentUser/',
    getAllUserUrl:'/user/getAllUser/',
    uploadProjectImgUrl:'/project/uploadProjectImg',
    delProjectImgUrl:'/project/delProjectImg',
    createProjectUrl:'/project/createProject',
    getAllProjectUrl:'/project/getAllProject',
    getEnvByProjectIdUrl:'/project/getEnvByProjectId',
    singleCaseDebugUrl:'/request/singleCaseDebug',
    createProjectApiCaseUrl:'/project/createProjectApiCase/',
    updateProjectApiCaseUrl:'/project/updateProjectApiCase/',
    getApiCaseByConditionUrl:'/project/getApiCaseByCondition/',
    deleteApiCaseByIdUrl:'/project/deleteApiCaseById/'
}

export const loginApi = (data) => {
    const postData = {
        user_name: data.username,
        password: data.password
    }
    return instance.post(urls.loginUrl, postData)
}

export const getCurrentUser = () => {
    return instance.post(urls.getCurrentUserUrl)
}

export const getAllUser = () => {
    return instance.post(urls.getAllUserUrl)
}

export const uploadProjectImgApi = (data) => {
    let form = new FormData()
    form.append(data.filename,data.file)
    return instance.post(urls.uploadProjectImgUrl, form,{headers:{'Content-Type': 'multipart/form-data'}})
}

export const delProjectImgApi = (filename) => {
    return instance.post(urls.delProjectImgUrl, {filename})
}

export const createProject = (data) => {
    const postData = {
        project_name:data.projectName,
        project_desc:data.projectDesc,
        project_img:data.projectImg,
        project_member:data.projectMember,
    }
    return instance.post(urls.createProjectUrl, postData)
}

export const getAllProject = (type) => {
    return instance.get(urls.getAllProjectUrl,{params:{type}})
}

//根据条件筛选接口用例
export const getApiCaseByCondition = (projectId,pageNum,pageSize,type,keyword)=>{
    const getData = {params:{
        project_id:projectId,
        page_num:pageNum,
        page_size:pageSize,
        type,
        keyword,
    }}
    return instance.get(urls.getApiCaseByConditionUrl,getData)
}

export const deleteApiCaseById = (id) => {
    return instance.post(urls.deleteApiCaseByIdUrl,{id})
}

export const getEnvByProjectId = (projectId) => {
    return instance.get(urls.getEnvByProjectIdUrl,{params:{project_id:parseInt(projectId)}})
}

export const singleCaseDebug = (data) => {
    const postData = {
        request_path:data.requestPath,
        request_host:{
            env_host:data.requestHost.envHost,
            is_user_env:data.requestHost.isUseEnv,
            request_host:data.requestHost.requestHost
        },
        request_method:data.requestMehod,
        request_headers:data.requestHeaders,
        request_query:data.requestQuery,
        request_body:data.requestBody
    }
    return instance.post(urls.singleCaseDebugUrl,postData)
}

export const createProjectApiCase = (data) => {
    const postData = {
        name:data.caseName,
        suite_id:data.suiteID,
        request_path:data.requestPath,
        request_host:{
            env_host:data.requestHost.envHost,
            is_user_env:data.requestHost.isUseEnv,
            request_host:data.requestHost.requestHost
        },
        request_method:data.requestMehod,
        request_headers:data.requestHeaders,
        request_query:data.requestQuery,
        request_body:data.requestBody,
        project_id:data.projectId,
    }
    return instance.post(urls.createProjectApiCaseUrl, postData)
}


export const updateProjectApiCase = (data) => {
    const postData = {
        id:data.id,
        name:data.caseName,
        suite_id:data.suiteID,
        request_path:data.requestPath,
        request_host:{
            env_host:data.requestHost.envHost,
            is_user_env:data.requestHost.isUseEnv,
            request_host:data.requestHost.requestHost
        },
        request_method:data.requestMehod,
        request_headers:data.requestHeaders,
        request_query:data.requestQuery,
        request_body:data.requestBody,
        project_id:data.projectId,
    }
    return instance.post(urls.updateProjectApiCaseUrl, postData)
}

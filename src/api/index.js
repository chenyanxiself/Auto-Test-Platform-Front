import instance from './instance'


const urls = {
    loginUrl: '/user/login/',
    getCurrentUserUrl: '/user/getCurrentUser/',
    getAllUserUrl: '/user/getAllUser/',
    uploadProjectImgUrl: '/project/uploadProjectImg',
    delProjectImgUrl: '/project/delProjectImg',
    createProjectUrl: '/project/createProject',
    getAllProjectUrl: '/project/getAllProject',
    getEnvByProjectIdUrl: '/project/getEnvByProjectId',
    singleCaseDebugUrl: '/request/singleCaseDebug',
    createProjectApiCaseUrl: '/project/createProjectApiCase/',
    updateProjectApiCaseUrl: '/project/updateProjectApiCase/',
    getApiCaseByConditionUrl: '/project/getApiCaseByCondition/',
    deleteApiCaseByIdUrl: '/project/deleteApiCaseById/',
    updatePasswordUrl: '/user/updatePassword',
    updateUserInfoUrl: '/user/updateUserInfo',
    getSuiteByProjectIdUrl: '/project/getSuiteByProjectId',
    getSuiteInfoByIdUrl: '/project/getSuiteInfoById',
    createSuiteUrl: '/project/createSuite',
    deleteSuiteUrl: '/project/deleteSuite',
    updateSuiteCaseRelationUrl: '/project/updateSuiteCaseRelation',
    updateSuiteCaseSortUrl: '/project/updateSuiteCaseSort',
    executeSuiteUrl: '/project/executeSuite',
    getReportByConditionUrl: '/report/getAllReport',
    deleteReportByIdUrl: '/report/deleteReportById',
    getReportDetailUrl: '/report/getReportDetail'
}

export const loginApi = (data) => {
    const postData = {
        user_name: data.username,
        password: data.password
    }
    return instance.post(urls.loginUrl, postData)
}
//修改密码
export const updatePassword = (oldPwd, newPwd) => {
    const postData = {
        old_password: oldPwd,
        new_password: newPwd
    }
    return instance.post(urls.updatePasswordUrl, postData)
}

//修改用户信息
export const updateUserInfo = (data) => {
    const postData = {
        user_cname: data.cname,
        email: data.email,
        phone: data.phone
    }
    return instance.post(urls.updateUserInfoUrl, postData)
}

export const getCurrentUser = () => {
    return instance.post(urls.getCurrentUserUrl)
}

export const getAllUser = () => {
    return instance.post(urls.getAllUserUrl)
}

export const uploadProjectImgApi = (data) => {
    let form = new FormData()
    form.append(data.filename, data.file)
    return instance.post(urls.uploadProjectImgUrl, form, {headers: {'Content-Type': 'multipart/form-data'}})
}

export const delProjectImgApi = (filename) => {
    return instance.post(urls.delProjectImgUrl, {filename})
}

export const createProject = (data) => {
    const postData = {
        project_name: data.projectName,
        project_desc: data.projectDesc,
        project_img: data.projectImg,
        project_member: data.projectMember,
    }
    return instance.post(urls.createProjectUrl, postData)
}

export const getAllProject = (type) => {
    return instance.get(urls.getAllProjectUrl, {params: {type}})
}

//根据条件筛选接口用例
export const getApiCaseByCondition = (projectId, pageNum, pageSize, type, keyword) => {
    const getData = {
        params: {
            project_id: projectId,
            page_num: pageNum,
            page_size: pageSize,
            type,
            keyword,
        }
    }
    return instance.get(urls.getApiCaseByConditionUrl, getData)
}

export const deleteApiCaseById = (id) => {
    return instance.post(urls.deleteApiCaseByIdUrl, {id})
}

export const getEnvByProjectId = (projectId) => {
    return instance.get(urls.getEnvByProjectIdUrl, {params: {project_id: parseInt(projectId)}})
}

export const singleCaseDebug = (data) => {
    const postData = {
        request_path: data.requestPath,
        request_host: {
            env_host: data.requestHost.envHost,
            is_user_env: data.requestHost.isUseEnv,
            request_host: data.requestHost.requestHost
        },
        request_method: data.requestMehod,
        request_headers: data.requestHeaders,
        request_query: data.requestQuery,
        request_body: data.requestBody
    }
    return instance.post(urls.singleCaseDebugUrl, postData)
}

export const createProjectApiCase = (data) => {
    const postData = {
        name: data.caseName,
        suite_id: data.suiteID,
        request_path: data.requestPath,
        request_host: {
            env_host: data.requestHost.envHost,
            is_user_env: data.requestHost.isUseEnv,
            request_host: data.requestHost.requestHost
        },
        request_method: data.requestMehod,
        request_headers: data.requestHeaders,
        request_query: data.requestQuery,
        request_body: data.requestBody,
        project_id: data.projectId,
    }
    return instance.post(urls.createProjectApiCaseUrl, postData)
}


export const updateProjectApiCase = (data) => {
    const postData = {
        id: data.id,
        name: data.caseName,
        suite_id: data.suiteID,
        request_path: data.requestPath,
        request_host: {
            env_host: data.requestHost.envHost,
            is_user_env: data.requestHost.isUseEnv,
            request_host: data.requestHost.requestHost
        },
        request_method: data.requestMehod,
        request_headers: data.requestHeaders,
        request_query: data.requestQuery,
        request_body: data.requestBody,
        project_id: data.projectId,
    }
    return instance.post(urls.updateProjectApiCaseUrl, postData)
}

export const getSuiteByProjectId = (projectId) => {
    return instance.get(urls.getSuiteByProjectIdUrl, {params: {project_id: projectId}})
}


export const getSuiteInfoById = (id, projectId) => {
    return instance.get(urls.getSuiteInfoByIdUrl, {params: {id, project_id: projectId}})
}

export const createSuite = (projectId, suiteName) => {
    return instance.post(urls.createSuiteUrl, {project_id: projectId, suite_name: suiteName})
}

export const deleteSuite = (suiteId) => {
    return instance.post(urls.deleteSuiteUrl, {suite_id: suiteId})
}

export const updateSuiteCaseRelation = (suiteId, projectId, caseIdList) => {
    const postData = {
        suite_id: suiteId,
        project_id: projectId,
        case_id_list: caseIdList
    }
    return instance.post(urls.updateSuiteCaseRelationUrl, postData)
}

export const updateSuiteCaseSort = (projectId, suiteId, beforeId, afterId) => {
    const postData = {
        project_id: projectId,
        suite_id: suiteId,
        before_id: beforeId,
        after_id: afterId
    }
    return instance.post(urls.updateSuiteCaseSortUrl, postData)
}

export const executeSuite = (projectId, suiteId, value) => {
    const postData = {
        project_id: projectId,
        suite_id: suiteId,
        is_use_env: value.globalHost.isUseEnv,
        request_host: value.globalHost.requestHost,
        env_host: value.globalHost.envHost,
        is_save_cookie: value.isSaveCookie,
        global_headers: value.globalHeaders
    }
    return instance.post(urls.executeSuiteUrl, postData)
}

export const getReportByCondition = (projectId) => {
    return instance.get(urls.getReportByConditionUrl, {params: {project_id: projectId}})
}

export const deleteReportById = (id) => {
    return instance.post(urls.deleteReportByIdUrl, {id})
}

export const getReportDetail = (id) => {
    return instance.get(urls.getReportDetailUrl, {
        params: {
            report_id: id
        }
    })
}
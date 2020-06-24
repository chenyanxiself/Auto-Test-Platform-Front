import actionType from './actionType.jsx'


export const setCurrentUser = (user)=>({
    type:actionType.SET_CURRENT_USER,
    user
})


export const setCreateProjectImg = (url)=>({
    type:actionType.SET_CREATE_PROJECT_IMG,
    url
})

export const delCreateProjectImg = ()=>({
    type:actionType.DEL_CREATE_PROJECT_IMG,
})

export const setCreateProjectMember = (projectMember)=>({
    type:actionType.SET_CREATE_PROJECT_MEMBER,
    projectMember
})

export const delCreateProjectMember = ()=>({
    type:actionType.DEL_CREATE_PROJECT_MEMBER,
})




// export const logout=() =>{
//     return dispatch=>{
//         setTimeout(() => {
//             dispatch({type:actionType.LOGOUT})
//         }, 200);
//     }
// }


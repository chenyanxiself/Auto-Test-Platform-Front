import actionType from './actionType.jsx'


export const setCurrentUser = (user)=>({
    type:actionType.SET_CURRENT_USER,
    user
})



// export const logout=() =>{
//     return dispatch=>{
//         setTimeout(() => {
//             dispatch({type:actionType.LOGOUT})
//         }, 200);
//     }
// }


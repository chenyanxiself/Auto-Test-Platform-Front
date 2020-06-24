import actionType from './actionType'
import { combineReducers } from 'redux'
const defaultUserState = {}
const user = (state = defaultUserState, action) => {
    switch (action.type) {
        case actionType.SET_CURRENT_USER:
            return action.user
        default:
            return state
    }
}

const defaultCreateProject = {
    projectImg: '',
    projectMember: [],
}
const createProject = (state = defaultCreateProject, action) => {
    let newState = { ...state }
    switch (action.type) {
        case actionType.SET_CREATE_PROJECT_IMG:
            newState.projectImg = action.url
            break
        case actionType.DEL_CREATE_PROJECT_IMG:
            newState.projectImg = ''
            break
        case actionType.SET_CREATE_PROJECT_MEMBER:
            newState.projectMember = action.projectMember
            break
        case actionType.DEL_CREATE_PROJECT_MEMBER:
            newState.projectMember = []
            break
        default:
            break
    }
    return newState
}
export default combineReducers({
    user,
    createProject,
})
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


export default combineReducers({
    user,
})
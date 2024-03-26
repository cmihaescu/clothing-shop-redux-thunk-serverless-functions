import { USER_ACTION_TYPES } from "./user-types"
const {SET_CURRENT_USER} = USER_ACTION_TYPES

const INITIAL_STATE = {
    currentUser:null
}

export const userReducer = (state=INITIAL_STATE, action) => {
const {type, payload} = action

switch(type) {
    case SET_CURRENT_USER:
        return {
            ...state,
            currentUser:payload
            }
    default:
        return state;
    }
}


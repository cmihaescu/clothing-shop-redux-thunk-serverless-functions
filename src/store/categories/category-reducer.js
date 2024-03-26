import { CATEGORY_ACTION_TYPES } from "./category-types"
const { GET_CATEGORIES_START, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAILURE } = CATEGORY_ACTION_TYPES

export const CATEGORIES_INITIAL_STATE = {
    categoriesMap: [],
    isLoading: false,
    error: null
}

export const categoriesReducer = (state = CATEGORIES_INITIAL_STATE, action = {}) => {
    const { type, payload } = action

    switch (type) {
        case GET_CATEGORIES_START:
            return {
                ...state,
                isLoading: true
            }
        case GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categoriesMap:payload,
                isLoading: false
            }
        case GET_CATEGORIES_FAILURE:
            return {
                ...state,
                isLoading: false,
                error:payload
            }
        default:
            return state
    }
}


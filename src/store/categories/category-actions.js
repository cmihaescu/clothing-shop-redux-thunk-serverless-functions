import { CATEGORY_ACTION_TYPES } from "./category-types";
import { createAction } from "../../utils/reducer.utils";
import { getCategoriesAndDocuments } from '../../utils/firebase.utils'

const { GET_CATEGORIES_START, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAILURE } = CATEGORY_ACTION_TYPES


export const getCategoriesMapStart = () => createAction(GET_CATEGORIES_START)
export const getCategoriesMapSuccess = (categoriesMap) => createAction(GET_CATEGORIES_SUCCESS, categoriesMap)
export const getCategoriesMapFailure = (error) => createAction(GET_CATEGORIES_FAILURE, error)

// redux thunk async 

export const getCategoriesMapAsync = () => async (dispatch) => {
    dispatch(getCategoriesMapStart())
    try {
        const categoriesMap = await getCategoriesAndDocuments();
        dispatch(getCategoriesMapSuccess(categoriesMap))
    } catch (error) {
        dispatch(getCategoriesMapFailure(error))
    }

}
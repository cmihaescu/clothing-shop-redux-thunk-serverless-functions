import { CART_ACTION_TYPES } from "./cart-types";
import { createAction } from "../../utils/reducer.utils";
import { apiClientRevolut } from "../../utils/revolutAPI.utils";

const {
  SET_CURRENCY,
  SET_CART_DROPDOWN,
  SET_MOBILE_NAVIGATION_DROPDOWN,
  UPDATE_CART_ITEMS,
  UPDATE_ORDER_ID_START,
  UPDATE_ORDER_ID_SUCCESS,
  UPDATE_ORDER_ID_FAILURE,
  CLEAR_CART,
} = CART_ACTION_TYPES;

export const setCurrency = (currency) => {
  return createAction(SET_CURRENCY, currency);
};

export const setCartDropdown = (cartDropdown) => {
  return createAction(SET_CART_DROPDOWN, cartDropdown);
};

export const setMobileNavigationDropdown = (mobileNavigationDropdown) => {
  return createAction(SET_MOBILE_NAVIGATION_DROPDOWN, mobileNavigationDropdown);
};

export const clearCart = () => {
  return createAction(CLEAR_CART);
};

export const updateCart = (cart) => {
  return createAction(UPDATE_CART_ITEMS, cart);
};

export const updateCartOrderIdStart = () => createAction(UPDATE_ORDER_ID_START);
export const updateCartOrderIdSuccess = (order_id) =>
  createAction(UPDATE_ORDER_ID_SUCCESS, order_id);
export const updateCartOrderIdFailure = (error) =>
  createAction(UPDATE_ORDER_ID_FAILURE, error);

//redux thunk async
export const createOrderIdAsync = (order_details) => async (dispatch) => {
  dispatch(updateCartOrderIdStart());
  try {
    const order = await apiClientRevolut("post", order_details, "create_order");
    dispatch(updateCartOrderIdSuccess(order.id));
    return order;
  } catch (error) {
    dispatch(updateCartOrderIdFailure(error));
  }
};

import { CART_ACTION_TYPES } from "./cart-types";

const {
  SET_CURRENCY,
  SET_CART_DROPDOWN,
  SET_MOBILE_NAVIGATION_DROPDOWN,
  UPDATE_CART_ITEMS,
  UPDATE_ORDER_ID_START,
  UPDATE_ORDER_ID_SUCCESS,
  UPDATE_ORDER_ID_FAILURE,
  PAY_WITH_SAVED_METHOD_START,
  PAY_WITH_SAVED_METHOD_SUCCESS,
  PAY_WITH_SAVED_METHOD_FAILURE,
  CLEAR_CART,
} = CART_ACTION_TYPES;

export const CART_INITIAL_STATE = {
  cartDropdown: null,
  mobileNavigationDropdown: null,
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  currency: "EUR",
  order_id: "",
  creatingOrder: false,
  payment_id: "",
  payingWithSavedMethod: false,
};

export const cartReducer = (state = CART_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENCY:
      return {
        ...state,
        currency: payload,
      };
    case SET_CART_DROPDOWN:
      return {
        ...state,
        cartDropdown: payload,
      };
    case SET_MOBILE_NAVIGATION_DROPDOWN:
      return {
        ...state,
        mobileNavigationDropdown: payload,
      };
    case UPDATE_CART_ITEMS:
      const { cartItems, totalItems, totalPrice } = payload;
      return {
        ...state,
        cartItems: cartItems,
        totalItems: totalItems,
        totalPrice: totalPrice,
      };
    case UPDATE_ORDER_ID_START:
      return {
        ...state,
        creatingOrder: true,
      };
    case UPDATE_ORDER_ID_SUCCESS:
      return {
        ...state,
        order_id: payload,
        creatingOrder: false,
      };
    case UPDATE_ORDER_ID_FAILURE:
      return {
        ...state,
        creatingOrder: false,
      };
    case PAY_WITH_SAVED_METHOD_START:
      return {
        ...state,
        payingWithSavedMethod: true,
      };
    case PAY_WITH_SAVED_METHOD_SUCCESS:
      return {
        ...state,
        payment_id: payload,
        payingWithSavedMethod: false,
      };
    case PAY_WITH_SAVED_METHOD_FAILURE:
      return {
        ...state,
        payingWithSavedMethod: false,
      };
    case CLEAR_CART:
      return {
        ...state,
        order_id: "",
        cartItems: [],
        totalItems: 0,
        totalPrice: 0,
      };
    default:
      return state;
  }
};

export const updateCartItemsReducer = (newCartItems) => {
  let totalItems = newCartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );
  let totalPrice = newCartItems.reduce(
    (total, cartItem) => total + cartItem.quantity * cartItem.price,
    0
  );

  let payload = {
    totalItems,
    totalPrice,
    cartItems: newCartItems,
  };
  return { type: UPDATE_CART_ITEMS, payload };
};

const addCardItem = (cartItems, productToAdd) => {
  let productIndex = cartItems.findIndex(
    (product) => product.id === productToAdd.id
  );
  if (productIndex === -1) {
    productToAdd.quantity = 1;
    return (cartItems = [...cartItems, productToAdd]);
  } else {
    cartItems[productIndex].quantity += 1;
    return [...cartItems];
  }
};

const decreaseCardItem = (cartItems, productToDecrease) => {
  let productIndex = cartItems.findIndex(
    (product) => product.id === productToDecrease.id
  );
  if (cartItems[productIndex].quantity > 1) {
    cartItems[productIndex].quantity -= 1;
    return [...cartItems];
  } else {
    return removeCartItem(cartItems, productToDecrease);
  }
};

const removeCartItem = (cartItems, productToRemove) => {
  let productIndex = cartItems.findIndex(
    (product) => product.id === productToRemove.id
  );
  cartItems.splice(productIndex, 1);
  return [...cartItems];
};

export const addItemToCart = (cartItems, productToAdd) => {
  return addCardItem(cartItems, productToAdd);
};

export const decreaseItemFromCart = (cartItems, productToDecrease) => {
  return decreaseCardItem(cartItems, productToDecrease);
};

export const removeItemFromCart = (cartItems, productToRemove) => {
  return removeCartItem(cartItems, productToRemove);
};

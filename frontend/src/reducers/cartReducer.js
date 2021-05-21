/* eslint-disable no-case-declarations */
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_EMPTY,
  CART_ADDRESS_TYPE_CONFIRM,
} from "../constants/cartConstant";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingAddress: localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {},
  mapAddress: {},
  paymentMethod: "paypal",
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.productId === item.productId
      );
      // console.log(existingItem);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.productId === existingItem.productId
              ? // ? { ...item, qty: item.qty + cartItem.qty }
                item
              : cartItem
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      let prodId = action.payload.productId;
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.productId !== prodId),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CART_EMPTY:
      return {
        ...state,
        cartItems: [],
      };
    case CART_ADDRESS_TYPE_CONFIRM:
      return {
        ...state,
        mapAddress: action.payload,
      };
    default:
      return state;
  }
};

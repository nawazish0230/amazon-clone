import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstant";

const addToCart = (qty, productId) => async (dispatch, getState) => {
  let { data } = await axios.get(`/api/products/${productId}`);
  if (data) {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        name: data.name,
        productId: data._id,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        seller: data.seller,
        qty,
      },
    });
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  }
};

const removeFromCart = (productId) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: {
      productId,
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

const saveShippingAddress = (shippingData) => async (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: shippingData });
  localStorage.setItem("shippingAddress", JSON.stringify(shippingData));
};

const savePaymentMethod = (paymentData) => async (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: paymentData });
  // localStorage.setItem("shippingAddress", JSON.stringify(paymentData));
};

export const cartActions = {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
};

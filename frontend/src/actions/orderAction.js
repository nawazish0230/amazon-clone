import axios from "axios";
import { CART_EMPTY } from "../constants/cartConstant";
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_PAY_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_MINE_LIST_REQUEST,
  ORDER_MINE_LIST_SUCCESS,
  ORDER_MINE_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_SUMMARY_REQUEST,
  ORDER_SUMMARY_SUCCESS,
  ORDER_SUMMARY_FAIL,
} from "../constants/orderConstant";

const placeOrder = (orderData) => async (dispatch, getState) => {
  let userInfo = getState().user.userInfo;
  dispatch({
    type: ORDER_CREATE_REQUEST,
    payload: orderData,
  });
  try {
    let {
      data: { order },
    } = await axios.post("/api/orders", orderData, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    console.log(order);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: order,
    });
    dispatch({
      type: CART_EMPTY,
    });
    localStorage.removeItem("cartItems");
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// detail order
const detailsOrder = (orderId) => async (dispatch, getState) => {
  const userInfo = getState().user.userInfo;
  dispatch({
    type: ORDER_DETAILS_REQUEST,
    payload: orderId,
  });
  try {
    const { data } = await axios.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// pay order
const payOrder =
  (selectedOrder, paymentResult) => async (dispatch, getState) => {
    const userInfo = getState().user.userInfo;
    dispatch({
      type: ORDER_PAY_REQUEST,
      payload: paymentResult,
    });
    try {
      const { data } = await axios.put(
        `/api/orders/${selectedOrder._id}`,
        paymentResult,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: ORDER_PAY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// get list of mine orders
const listOrderMine = () => async (dispatch, getState) => {
  const userInfo = getState().user.userInfo;
  dispatch({
    type: ORDER_MINE_LIST_REQUEST,
    payload: true,
  });
  try {
    const { data } = await axios.get(`/api/orders/mine`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: ORDER_MINE_LIST_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ORDER_MINE_LIST_REQUEST,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: ORDER_MINE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// list all order
const listOrders =
  (sellerId = "") =>
  async (dispatch, getState) => {
    const userInfo = getState().user.userInfo;
    dispatch({
      type: ORDER_LIST_REQUEST,
      payload: true,
    });
    try {
      let sellerParam = "";
      if (sellerId) {
        sellerParam = `?sellerId=${sellerId}`;
      }
      const { data } = await axios.get(`/api/orders${sellerParam}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({
        type: ORDER_LIST_SUCCESS,
        payload: data,
      });
      dispatch({
        type: ORDER_LIST_REQUEST,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: ORDER_LIST_FAIL,
        payload: error.message,
      });
      dispatch({
        type: ORDER_LIST_REQUEST,
        payload: false,
      });
    }
  };

// delete order
const deleteOrder = (orderId) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await axios.delete(`/api/orders/delete/${orderId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response && error.response.data.message
      ? error.response.data
      : error.message;
  }
};

// deliver order
const deliverOrder = (orderId) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await axios.put(`/api/orders/deliver/${orderId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response && error.response.data.message
      ? error.response.data
      : error.message;
  }
};

// summary
const getSummary = () => async (dispatch, getState) => {
  const userInfo = getState().user.userInfo;
  dispatch({
    type: ORDER_SUMMARY_REQUEST,
    payload: true,
  });
  try {
    const { data } = await axios.get(`/api/orders/summary`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: ORDER_SUMMARY_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ORDER_SUMMARY_REQUEST,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: ORDER_SUMMARY_FAIL,
      payload: error.message,
    });
    dispatch({
      type: ORDER_SUMMARY_REQUEST,
      payload: false,
    });
  }
};

export const orderActions = {
  placeOrder,
  detailsOrder,
  payOrder,
  listOrderMine,
  listOrders,
  deleteOrder,
  deliverOrder,
  getSummary,
};

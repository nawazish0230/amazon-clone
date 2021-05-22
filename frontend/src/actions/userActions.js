import axios from "axios";
import {
  USER_AUTH_REQUEST,
  USER_AUTH_FAIL,
  USER_AUTH_SUCCESS,
  USER_LOGOUT,
  USER_DETAIL_REQUEST,
  USER_DETAIL_SUCCESS,
  USER_DETAIL_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  TOP_SELLER_LIST_REQUEST,
  TOP_SELLER_LIST_SUCCESS,
} from "../constants/userConstant";

// register user
const register = (name, email, password) => async (dispatch) => {
  dispatch({ type: USER_AUTH_REQUEST, payload: { name, email, password } });
  try {
    let { data } = await axios.post("/api/users/register", {
      name,
      email,
      password,
    });
    dispatch({ type: USER_AUTH_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_AUTH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    localStorage.removeItem("userInfo");
  }
};

// signin user
const signIn = (email, password) => async (dispatch) => {
  dispatch({ type: USER_AUTH_REQUEST, payload: { email, password } });
  try {
    let { data } = await axios.post("/api/users/login", {
      email,
      password,
    });
    dispatch({ type: USER_AUTH_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_AUTH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    localStorage.removeItem("userInfo");
  }
};

// signout
const signOut = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItem");
  localStorage.removeItem("shippingAddress");
  dispatch({
    type: USER_LOGOUT,
  });
};

// get user details
const getUserDetails = (userId) => async (dispatch, getState) => {
  const userInfo = getState().user.userInfo;
  dispatch({ type: USER_DETAIL_REQUEST, payload: true });
  try {
    let { data } = await axios.get(`/api/users/get-user-detail/${userId}`, {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
      },
    });
    dispatch({ type: USER_DETAIL_SUCCESS, payload: data });
    dispatch({ type: USER_DETAIL_REQUEST, payload: false });
  } catch (error) {
    dispatch({ type: USER_DETAIL_REQUEST, payload: false });
    dispatch({
      type: USER_DETAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// update user details
const updateUserDetails =
  (userId, name, email, password, sellerName, sellerLogo, sellerDescription) =>
  async (dispatch) => {
    dispatch({ type: USER_UPDATE_REQUEST, payload: true });
    try {
      let { data } = await axios.post(`/api/users/profile/${userId}`, {
        name,
        email,
        password,
        sellerName,
        sellerLogo,
        sellerDescription,
      });
      dispatch({ type: USER_UPDATE_SUCCESS, payload: true });
      dispatch({ type: USER_AUTH_SUCCESS, payload: data });
      dispatch({ type: USER_UPDATE_REQUEST, payload: false });
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({ type: USER_UPDATE_REQUEST, payload: false });
      dispatch({
        type: USER_DETAIL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// list all user
const listUsers = () => async (dispatch, getState) => {
  const userInfo = getState().user.userInfo;
  dispatch({
    type: USER_LIST_REQUEST,
    payload: true,
  });
  try {
    const { data } = await axios.get("/api/users", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
    dispatch({
      type: USER_LIST_REQUEST,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.message,
    });
    dispatch({
      type: USER_LIST_REQUEST,
      payload: false,
    });
  }
};

// update product
const blockUnBlockUser = (orderId, blockStatus) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  console.log(orderId, blockStatus);
  try {
    const { data } = await axios.put(
      `/api/users/block-unblock/${orderId}`,
      {
        isBlocked: blockStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response && error.response.data.message
      ? error.response.data
      : error.message;
  }
};

// update user
const updateUser = (userId, userObj) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await axios.put(
      `/api/users/update/${userId}`,
      {
        ...userObj,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response && error.response.data.message
      ? error.response.data
      : error.message;
  }
};

// list all user
const getTopSellers = () => async (dispatch) => {
  dispatch({
    type: TOP_SELLER_LIST_REQUEST,
    payload: true,
  });
  try {
    const { data } = await axios.get("/api/users/top-sellers");
    dispatch({
      type: TOP_SELLER_LIST_SUCCESS,
      payload: data,
    });
    dispatch({
      type: TOP_SELLER_LIST_REQUEST,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: TOP_SELLER_LIST_REQUEST,
      payload: false,
    });
    return error.message;
  }
};

export const userActions = {
  register,
  signIn,
  signOut,
  getUserDetails,
  updateUserDetails,
  listUsers,
  blockUnBlockUser,
  updateUser,
  getTopSellers,
};

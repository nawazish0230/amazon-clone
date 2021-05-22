import {
  TOP_SELLER_LIST_REQUEST,
  TOP_SELLER_LIST_SUCCESS,
  USER_AUTH_FAIL,
  USER_AUTH_REQUEST,
  USER_AUTH_SUCCESS,
  USER_DETAIL_FAIL,
  USER_DETAIL_REQUEST,
  USER_DETAIL_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
} from "../constants/userConstant";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : {},
  loading: false,
  errorMsg: "",
  userDetailLoading: false,
  userDetails: {},
  userDetailsError: "",
  userUpdateLoading: false,
  userUpdateState: false,
  users: [],
  usersLoading: false,
  usersError: "",
  topSellerLoading: false,
  topSellers: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_AUTH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        errorMsg: "",
      };
    case USER_AUTH_FAIL:
      return {
        ...state,
        loading: false,
        userInfo: {},
        errorMsg: action.payload,
      };
    case USER_LOGOUT:
      return {
        ...state,
        userInfo: {},
      };
    case USER_DETAIL_REQUEST:
      return {
        ...state,
        userDetailLoading: action.payload,
      };
    case USER_DETAIL_SUCCESS:
      return {
        ...state,
        userDetails: action.payload,
        userDetailsError: "",
      };
    case USER_DETAIL_FAIL:
      return {
        ...state,
        userDetailsError: action.payload,
      };
    case USER_UPDATE_REQUEST:
      return {
        ...state,
        userUpdateLoading: action.payload,
      };
    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        userUpdateState: action.payload,
      };
    case USER_LIST_REQUEST:
      return {
        ...state,
        usersLoading: action.payload,
      };
    case USER_LIST_SUCCESS:
      return {
        ...state,
        users: action.payload,
        usersError: "",
      };
    case USER_LIST_FAIL:
      return {
        ...state,
        usersError: action.payload,
      };
    case TOP_SELLER_LIST_REQUEST:
      return {
        ...state,
        topSellerLoading: action.payload,
      };
    case TOP_SELLER_LIST_SUCCESS:
      return {
        ...state,
        topSellers: action.payload,
      };
    default:
      return state;
  }
};

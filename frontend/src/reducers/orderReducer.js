/* eslint-disable no-case-declarations */

import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
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

const initialState = {
  order: {},
  success: false,
  loading: false,
  error: "",
  selectedOrder: {},
  orderMineListLoading: false,
  orderMineList: [],
  orderMineListError: "",
  orders: [],
  orderLoading: false,
  orderError: "",
  summaryLoading: false,
  summary: {},
  summaryError: "",
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        order: action.payload,
        success: true,
        loading: false,
      };
    case ORDER_CREATE_RESET:
      return {
        ...state,
        order: {},
        success: false,
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        error: action.payload,
        success: false,
        loading: false,
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        selectedOrder: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ORDER_MINE_LIST_REQUEST:
      return {
        ...state,
        orderMineListLoading: action.payload,
      };
    case ORDER_MINE_LIST_SUCCESS:
      return {
        ...state,
        orderMineList: action.payload,
      };
    case ORDER_MINE_LIST_FAIL:
      return {
        ...state,
        orderMineListError: action.payload,
        orderMineListLoading: false,
      };
    case ORDER_LIST_REQUEST:
      return {
        ...state,
        orderLoading: action.payload,
      };
    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        orders: action.payload,
        orderError: "",
      };
    case ORDER_LIST_FAIL:
      return {
        ...state,
        orderError: action.payload,
      };
    case ORDER_SUMMARY_REQUEST:
      return {
        ...state,
        summaryLoading: action.payload,
      };
    case ORDER_SUMMARY_SUCCESS:
      return {
        ...state,
        summary: action.payload,
        summaryError: "",
      };
    case ORDER_SUMMARY_FAIL:
      return {
        ...state,
        summaryError: action.payload,
      };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return {
        loading: true,
      };
    case ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_PAY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

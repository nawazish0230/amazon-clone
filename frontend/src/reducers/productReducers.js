import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from "../constants/productConstants";

const initialState = {
  productLoading: true,
  products: [],
  page: "",
  pages: "",
  productDetailLoading: true,
  product: {},
  errorText: "",
};

export const productListReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return {
        ...state,
        productLoading: action.payload,
      };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        errorText: "",
      };
    case PRODUCT_LIST_FAIL:
      return {
        ...state,
        errorText: action.payload,
      };
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        productDetailLoading: action.payload,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        product: action.payload,
        errorText: "",
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        errorText: action.payload,
      };
    default:
      return state;
  }
};

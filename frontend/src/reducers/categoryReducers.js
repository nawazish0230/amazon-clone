import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
} from "../constants/categoryConstant";

const initialState = {
  categoryLoading: true,
  categories: [],
  categoryError: "",
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return {
        ...state,
        categoryLoading: action.payload,
      };
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        categoryError: "",
      };
    case CATEGORY_LIST_FAIL:
      return {
        ...state,
        categoryError: action.payload,
      };
    default:
      return state;
  }
};

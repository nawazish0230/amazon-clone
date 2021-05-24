import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from "../constants/productConstants";
import Axios from "axios";

// get all products
const listProducts =
  (
    pageNumber = "",
    sellerObj = {},
    nameObj = {},
    categoryObj = {},
    min = 0,
    max = 0,
    rating = 0,
    order = "newest"
  ) =>
  async (dispatch, getState) => {
    console.log(categoryObj);
    const userInfo = getState().user.userInfo;
    dispatch({
      type: PRODUCT_LIST_REQUEST,
      payload: true,
    });
    try {
      let sellerParam = "";
      if (sellerObj.sellerId) {
        sellerParam = `&sellerId=${sellerObj.sellerId}`;
      }
      let nameParam = "";
      if (nameObj.name) {
        nameParam = `&name=${nameObj.name}`;
      }
      let categoryParam = "";
      if (categoryObj.category) {
        categoryParam = `&category=${categoryObj.category}`;
      }
      let minParam = "";
      let maxParam = "";
      if (min > 0 && max > 0) {
        minParam = nameParam || categoryParam ? `&min=${min}` : `?min=${min}`;
        maxParam = `&max=${max}`;
      }
      let ratingParam = "";
      if (rating > 0) {
        ratingParam = `&rating=${rating}`;
      }
      let orderParam = "";
      if (order) {
        orderParam = `&order=${order}`;
      }

      const { data } = await Axios.get(
        `/api/products?pageNumber=${pageNumber}${sellerParam}${nameParam}${categoryParam}${minParam}${maxParam}${ratingParam}${orderParam}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data);
      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
      dispatch({
        type: PRODUCT_LIST_REQUEST,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload: error.message,
      });
    }
  };

const detailsProduct = (id) => async (dispatch) => {
  console.log(id);
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
      payload: true,
    });
    const { data } = await Axios.get(`/api/products/${id}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
      payload: false,
    });
    return data;
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const createProduct = (createData) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await Axios.post(`/api/products/create`, createData, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response && error.response.data.message
      ? error.response.data
      : error.message;
  }
};

// update product
const updateProduct = (productId, productObj) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  console.log(productId, productObj);
  try {
    const { data } = await Axios.put(
      `/api/products/update/${productId}`,
      {
        ...productObj,
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

// delete product
const deleteProduct = (productId) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await Axios.delete(`/api/products/delete/${productId}`, {
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

// review product
const reviewProduct = (productId, ratingObj) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await Axios.put(
      `/api/products/${productId}/review`,
      {
        ...ratingObj,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error.response);
    return error.response && error.response.data.message
      ? error.response.data
      : error.message;
  }
};

export const productActions = {
  listProducts,
  detailsProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  reviewProduct,
};

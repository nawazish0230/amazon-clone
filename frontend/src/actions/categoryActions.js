import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
} from "../constants/categoryConstant";
import axios from "axios";

// get all categories
const listCategories = () => async (dispatch) => {
  dispatch({
    type: CATEGORY_LIST_REQUEST,
    payload: true,
  });
  try {
    const { data } = await axios.get(`/api/categories`);
    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
    dispatch({
      type: CATEGORY_LIST_REQUEST,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message,
    });
  }
};

const createCategory = (name, description) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await axios.post(
      `/api/categories/create`,
      {
        name,
        description,
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

// update category
const updateCategory = (categoryId, categoryObj) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  console.log(categoryId, categoryObj);
  try {
    const { data } = await axios.put(
      `/api/categories/update/${categoryId}`,
      {
        ...categoryObj,
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

// delete category
const deleteProduct = (categoryId) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await axios.delete(
      `/api/categories/delete/${categoryId}`,
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

// get category by Id
const getCategoryById = (categoryId) => async (a, getState) => {
  const userInfo = getState().user.userInfo;
  try {
    const { data } = await axios.get(`/api/categories/${categoryId}`, {
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

const uploadImage = (fileData) => async (dispatch, getState) => {
  console.log(fileData);
  const userInfo = getState().user.userInfo;
  const file = fileData;
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);
  try {
    let { data } = await axios.post("/api/uploads/s3", bodyFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    return error.message;
  }
};

export const categoryActions = {
  listCategories,
  createCategory,
  updateCategory,
  deleteProduct,
  getCategoryById,
  uploadImage,
};

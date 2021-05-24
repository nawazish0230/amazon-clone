import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { categoryActions } from "../../../actions/categoryActions.js";
import { productActions } from "../../../actions/productActions.js";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const CategoryListScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { categoryLoading, categories, categoryError } = useSelector(
    (state) => state.category
  );

  // const userInfo = useSelector((state) => state.user.userInfo);

  const [deletedMsg, setDeletedMsg] = useState("");

  useEffect(() => {
    dispatch(categoryActions.listCategories());
  }, []);

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure to delete ?")) {
      let res = await dispatch(productActions.deleteProduct(productId));
      console.log(res);
      if (res.statusCode === 200) {
        setDeletedMsg(res.message);
        dispatch(productActions.listProducts());
        setTimeout(() => {
          setDeletedMsg("");
        }, 3000);
      }
    }
  };

  return (
    <div className="m-1">
      <h1>Products Lists</h1>
      {categoryLoading && <LoadingBox />}
      {categoryError && (
        <MessageBox variant="danger">{categoryError}</MessageBox>
      )}
      {deletedMsg && <MessageBox variant="success">{deletedMsg}</MessageBox>}
      <>
        <div style={{ marginLeft: "90%", marginBottom: "15px" }}>
          <Link to="/create-category">
            <label></label>
            <button type="submit" className="primary">
              Create Category
            </button>
          </Link>
        </div>
        <table className="table mx-1">
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>IMAGE</td>
              <td>DESCRIPTION</td>
              <td>ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>
                    <img src={category.image} alt="" width="80" height="80" />
                  </td>
                  <td>{category.description}</td>
                  <td>
                    <button
                      type="button"
                      className="small"
                      onClick={() =>
                        history.push(`/edit-category/${category._id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => deleteHandler(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default CategoryListScreen;

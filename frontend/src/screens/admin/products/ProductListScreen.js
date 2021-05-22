import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { productActions } from "../../../actions/productActions.js";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { pageNumber = 1 } = useParams();

  const { productLoading, products, pages, page, errorText } = useSelector(
    (state) => state.product
  );

  const userInfo = useSelector((state) => state.user.userInfo);

  const [deletedMsg, setDeletedMsg] = useState("");

  useEffect(() => {
    console.log(location.pathname.includes("seller"), pageNumber);
    if (location.pathname.includes("seller")) {
      dispatch(
        productActions.listProducts(pageNumber, { sellerId: userInfo._id })
      );
    } else {
      dispatch(productActions.listProducts(pageNumber));
    }
  }, [pageNumber]);

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
      {productLoading && <LoadingBox />}
      {errorText && <MessageBox variant="danger">{errorText}</MessageBox>}
      {deletedMsg && <MessageBox variant="success">{deletedMsg}</MessageBox>}
      <>
        <div style={{ marginLeft: "90%", marginBottom: "15px" }}>
          <Link to="/create-product">
            <label></label>
            <button type="submit" className="primary">
              Create Product
            </button>
          </Link>
        </div>
        <table className="table mx-1">
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>PRICE</td>
              <td>CATEGORY</td>
              <td>BRAND</td>
              <td>ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      type="button"
                      className="small"
                      onClick={() =>
                        history.push(`/edit-product/${product._id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => deleteHandler(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="row center pagination">
          {[...Array(pages).keys()].map((pageNum) => (
            <Link
              className={pageNum + 1 === page ? "active" : ""}
              key={pageNum}
              to={`/products-list/page/${pageNum + 1}`}
            >
              {pageNum + 1}
            </Link>
          ))}
        </div>
      </>
    </div>
  );
};

export default ProductListScreen;

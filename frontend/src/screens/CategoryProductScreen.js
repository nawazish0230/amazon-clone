/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import { useParams } from "react-router-dom";

const CategoryProductScreen = ({ match }) => {
  let categoryId = match.params && match.params.id;
  const dispatch = useDispatch();
  const { pageNumber = 1 } = useParams();

  const { products, productLoading, errortext } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(
      productActions.listProducts(pageNumber, {}, {}, { category: categoryId })
    );
  }, [pageNumber, categoryId]);

  return (
    <div className="row top m-1">
      <div className="col-1">
        {productLoading ? (
          <LoadingBox></LoadingBox>
        ) : errortext ? (
          <MessageBox>{errortext}</MessageBox>
        ) : (
          <>
            {/* <ul className="card card-body">
              <li>
                <div className="row start">
                  <div className="">
                    <img
                      src={userDetails.seller && userDetails.seller.logo}
                      alt={userDetails.seller && userDetails.seller.name}
                      width="80"
                      height="80"
                    />
                  </div>
                  <div className="p-1">
                    <h1>{userDetails.seller && userDetails.seller.name}</h1>
                  </div>
                </div>
              </li>
              <li>
                <Rating
                  value={userDetails.seller && userDetails.seller.rating}
                  text={userDetails.seller && userDetails.seller.numReviews}
                />
              </li>
              <li>
                <a href={`mailto:${userDetails.email}`}>Contact Seller</a>
              </li>
              <li>{userDetails.seller && userDetails.seller.description}</li>
            </ul> */}
          </>
        )}
      </div>
      <div className="col-3">
        {productLoading ? (
          <LoadingBox></LoadingBox>
        ) : errortext ? (
          <MessageBox>{errortext}</MessageBox>
        ) : (
          <>
            {products ? (
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <MessageBox>No product found</MessageBox>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProductScreen;

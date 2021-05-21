/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <div className="card mx-2 my-1">
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={`${product.image}`} alt="product" />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <strong className="title-font">{product.name}</strong>
        </Link>
        <div className="seller mb-1">
          <Link to={`/seller/${product.seller && product.seller._id}`}>
            <small>{product.seller && product.seller.seller.name}</small>
          </Link>
        </div>
        <div className="price">
          <strong>${product.price}</strong>
        </div>
        <div className="row">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>
      </div>
    </div>
  );
};

export default Product;

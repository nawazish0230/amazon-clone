/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const ProductScreen = ({ match, history }) => {
  let productId = match.params.id;
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  const productList = useSelector((state) => state.product);
  const { productDetailsLoading, product, errorText } = productList;

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [ratingErr, setRatingErr] = useState("");
  const [showRatingErr, setShowRatingErr] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  useEffect(() => {
    dispatch(productActions.detailsProduct(productId));
  }, []);

  const handleCart = () => {
    history.push(`/cart/${productId}?qty=${quantity}`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (rating && comment) {
      let resp = await dispatch(
        productActions.reviewProduct(productId, { rating, comment })
      );
      if (resp.statusCode === 200) {
        setShowRatingSuccess(true);
        dispatch(productActions.detailsProduct(productId));
        setRating("");
        setComment("");
        setTimeout(() => {
          setShowRatingSuccess(false);
        }, 3000);
      } else {
        setShowRatingErr(true);
        setRatingErr("Something went wrong");
        setTimeout(() => {
          setShowRatingErr(false);
          setRatingErr("");
        }, 3000);
      }
    } else {
      alert("Enter Rating and comment");
    }
  };

  return (
    <>
      {productDetailsLoading ? (
        <LoadingBox />
      ) : errorText ? (
        <MessageBox variant="danger">{errorText}</MessageBox>
      ) : (
        <div className="p-1">
          <Link to="/">Go Back</Link>
          <div className="row top">
            <div className="col-2">
              <img className="large" src={product.image} alt={product.name} />
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </li>
                <li>Price : $ {product.price}</li>
                <li>
                  Description:
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    Seller
                    <h2>
                      <Link
                        to={`/seller/${product.seller && product.seller._id}`}
                      >
                        {product.seller &&
                          product.seller.seller &&
                          product.seller.seller.name}
                      </Link>
                    </h2>
                    <Rating
                      rating={product.seller && product.seller.seller.rating}
                      numReviews={
                        product.seller && product.seller.seller.numReviews
                      }
                    />
                  </li>
                  <li>
                    <div className="row">
                      <div>Price </div>
                      <div className="price">${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Status </div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">In Stock</span>
                        ) : (
                          <span className="danger">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>Qty</div>
                          <div>
                            <select
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (num) => (
                                  <option
                                    key={num}
                                    defaultValue={1}
                                    value={num + 1}
                                  >
                                    {num + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button className="primary block" onClick={handleCart}>
                          Add to Cart
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="reviews">
            {product.reviews && product.reviews.length === 0 ? (
              <MessageBox>No Review</MessageBox>
            ) : (
              <ul>
                {product.reviews &&
                  product.reviews.map((review) => (
                    <li key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} caption={" "} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                      <hr />
                    </li>
                  ))}
              </ul>
            )}
            {userInfo && Object.keys(userInfo).length > 0 ? (
              <>
                {showRatingErr && (
                  <MessageBox variant="danger">{ratingErr}</MessageBox>
                )}
                {showRatingSuccess && (
                  <MessageBox variant="success">Rating Added</MessageBox>
                )}
                <form className="form" onSubmit={handleReview}>
                  <div>
                    <h1>Write a review</h1>
                  </div>
                  <div>
                    <label htmlFor="rating">Rating</label>
                    <select
                      name="rating"
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="comment">Comment</label>
                    <textarea
                      name="comment"
                      id="comment"
                      cols="15"
                      rows="5"
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    ></textarea>
                  </div>
                  <div>
                    <button className="primary" type="submit">
                      Add Review
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="center">
                  Want to write review ? <Link to="/signin">Signin</Link>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductScreen;

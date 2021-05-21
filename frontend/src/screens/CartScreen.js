/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../actions/cartActions";
import MessageBox from "../components/MessageBox";
import { Link } from "react-router-dom";

const CartScreen = (props) => {
  const dispatch = useDispatch();
  const productId = props.match.params && props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(cartActions.addToCart(qty, productId));
  }, []);

  const removeFromCartHandler = (productId) => {
    dispatch(cartActions.removeFromCart(productId));
  };

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  return (
    <div className="row top p-2">
      <div className="col-2">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty <Link to="/">Go to Shopping</Link>
          </MessageBox>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.productId}>
                <div className="row">
                  <div>
                    <img src={item.image} alt={item.name} className="small" />
                  </div>

                  <div className="min-30">
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  </div>
                  <div>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          cartActions.addToCart(
                            Number(e.target.value),
                            item.productId
                          )
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((num) => (
                        <option key={num} defaultValue={1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>${item.price}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item.productId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-1 ml-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>
                Subtotal (
                {cartItems.reduce((item, product) => item + product.qty, 0)}{" "}
                items : $
                {cartItems.reduce(
                  (item, product) => item + product.price * product.qty,
                  0
                )}
                )
              </h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="primary block"
              >
                Proceed to Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;

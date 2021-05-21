/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { orderActions } from "../actions/orderAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { PayPalButton } from "react-paypal-button-v2";

const OrderScreen = (props) => {
  const dispatch = useDispatch();

  let orderId = props.match.params && props.match.params.id;

  const { userInfo } = useSelector((state) => state.user);
  const { error, loading, selectedOrder } = useSelector((state) => state.order);
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;

  const [sdkReady, setSdkReady] = useState(true);

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    console.log(selectedOrder);
    if (
      !selectedOrder._id ||
      successPay ||
      (selectedOrder && selectedOrder._id !== orderId)
    ) {
      dispatch(orderActions.detailsOrder(orderId));
    } else {
      if (!selectedOrder.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [orderId, selectedOrder, sdkReady]);

  const toPrice = (num) => Number(num).toFixed(2);

  const successPaymentHandler = (paymentResult) => {
    dispatch(orderActions.payOrder(selectedOrder, paymentResult));
  };

  const deliverOrderHandler = async () => {
    await dispatch(orderActions.deliverOrder(orderId));
    dispatch(orderActions.detailsOrder(orderId));
  };

  return loading ? (
    <LoadingBox />
  ) : error || Object.keys(selectedOrder).length === 0 ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="m-1">
      <h1>Order : {orderId}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong>{" "}
                  {selectedOrder.shippingAddress.fullName}
                  <br />
                  <strong>Address: </strong>{" "}
                  {selectedOrder.shippingAddress.address},{" "}
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.postalCode},{" "}
                  {selectedOrder.shippingAddress.country}
                  <br />
                </p>
                <p>
                  {selectedOrder.isDelivered ? (
                    <MessageBox variant="success">
                      Delivered at {selectedOrder.deliveredAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Delivered</MessageBox>
                  )}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong> {selectedOrder.paymentMethod}
                  <br />
                </p>
                <p>
                  {selectedOrder.isPaid ? (
                    <MessageBox variant="success">
                      Paid at {selectedOrder.paidAt}
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Not Paid</MessageBox>
                  )}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {selectedOrder.orderItems.map((item) => (
                    <li key={item.productId}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>

                        <div className="min-30">
                          <Link to={`/product/${item.productId}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} * ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1 mt-1 ml-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>
                    $
                    {selectedOrder.itemsPrice &&
                      toPrice(selectedOrder.itemsPrice)}
                  </div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping Charge</div>
                  <div>
                    $
                    {selectedOrder.shippingPrice &&
                      toPrice(selectedOrder.shippingPrice)}
                  </div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>
                    ${selectedOrder.taxPrice && toPrice(selectedOrder.taxPrice)}
                  </div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${toPrice(selectedOrder.totalPrice)}</strong>
                  </div>
                </div>
              </li>
              {!selectedOrder.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                      <PayPalButton
                        amount={selectedOrder.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                </li>
              )}
              {selectedOrder.isPaid &&
                userInfo.isAdmin &&
                !selectedOrder.isDelivered && (
                  <li>
                    <button
                      type="button"
                      onClick={deliverOrderHandler}
                      className="primary block"
                    >
                      Deliver Order
                    </button>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;

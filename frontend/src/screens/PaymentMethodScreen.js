import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { cartActions } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentMethodScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userInfo = useSelector((state) => state.user.userInfo);
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);

  if (userInfo && Object.keys(userInfo).length === 0) {
    history.push("/signin");
  }

  if (shippingAddress && Object.keys(shippingAddress).length === 0) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const handlePaymentMethod = (e) => {
    e.preventDefault();
    console.log(paymentMethod);
    dispatch(cartActions.savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <div className="mt-1">
      <CheckoutSteps step1 step2 step3 />
      <form className="form" onSubmit={handlePaymentMethod}>
        <div className="">
          <h1>Payment Method</h1>
        </div>
        <div>
          <input
            htmlFor="paypal"
            name="payment"
            type="radio"
            value={"paypal"}
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="paypal">Paypal</label>
        </div>
        <div>
          <input
            htmlFor="stripe"
            name="payment"
            type="radio"
            value={"stripe"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="stripe">Stripe</label>
        </div>

        <div>
          <label></label>
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodScreen;

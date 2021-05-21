/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const SellerRoute = ({ component: Component, ...rest }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo.isSeller ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="signin" />
        )
      }
    ></Route>
  );
};

export default SellerRoute;

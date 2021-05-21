/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo._id ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="signin" />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;

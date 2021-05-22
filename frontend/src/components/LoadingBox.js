import React from "react";
import loader from "../assets/loader.gif";

const LoadingBox = () => {
  return (
    <div className="p-1 mx-auto mt-1 row center">
      <img src={loader} alt="" width="60" height="60" />
    </div>
  );
};

export default LoadingBox;

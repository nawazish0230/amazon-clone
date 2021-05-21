/* eslint-disable react/prop-types */
import React from "react";

const MessageBox = ({ variant, children }) => {
  return (
    <>
      {children && (
        <div className={`alert alert-${variant ? variant : "info"}`}>
          {children}
        </div>
      )}
    </>
  );
};

export default MessageBox;

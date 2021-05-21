import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { orderActions } from "../../../actions/orderAction.js";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orderLoading, orders, orderError } = useSelector(
    (state) => state.order
  );

  const userInfo = useSelector((state) => state.user.userInfo);

  const [deletedMsg, setDeletedMsg] = useState("");
  const [statusCode, setStatusCode] = useState("");

  useEffect(() => {
    if (location.pathname.includes("seller")) {
      dispatch(orderActions.listOrders(userInfo._id));
    } else {
      dispatch(orderActions.listOrders());
    }
  }, []);

  const deleteHandler = async (orderId) => {
    if (window.confirm("Are you sure to delete ?")) {
      let res = await dispatch(orderActions.deleteOrder(orderId));
      console.log(res);

      if (res.statusCode === 200) {
        setStatusCode(200);
        setDeletedMsg(res.message);
        dispatch(orderActions.listOrders());
      } else {
        setDeletedMsg(res.message);
        setStatusCode(400);
      }
      setTimeout(() => {
        setDeletedMsg("");
        setStatusCode("");
      }, 3000);
    }
  };

  return (
    <div className="m-1">
      <h1>Products Lists</h1>
      {deletedMsg && (
        <MessageBox variant={`${statusCode === 200 ? `success` : "danger"} `}>
          {deletedMsg}
        </MessageBox>
      )}
      {orderLoading ? (
        <LoadingBox />
      ) : orderError ? (
        <MessageBox variant="danger">{orderError}</MessageBox>
      ) : (
        <>
          <table className="table mx-1">
            <thead>
              <tr>
                <td>ID</td>
                <td>USER</td>
                <td>DATE</td>
                <td>TOTAL</td>
                <td>PAID</td>
                <td>DELIVERED</td>
                <td>ACTIONS</td>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.slice(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.isPaid ? "Paid" : "Not paid"}</td>
                    <td>{order.isDelivered ? "Delivered" : "Not Delivered"}</td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => history.push(`/order/${order._id}`)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="small"
                        onClick={() => deleteHandler(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OrderListScreen;

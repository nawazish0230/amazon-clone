import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { orderActions } from "../actions/orderAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const OrderHistoryScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    orderMineListLoading,
    orderMineList,
    orderMineListError,
  } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(orderActions.listOrderMine());
  }, []);

  return (
    <div className="m-1">
      <h1>Order History</h1>
      {orderMineListLoading ? (
        <LoadingBox />
      ) : orderMineListError ? (
        <MessageBox variant="danger">{orderMineListError}</MessageBox>
      ) : (
        <>
          <table className="table mx-1">
            <thead>
              <tr>
                <td>ID</td>
                <td>DATE</td>
                <td>TOTAL</td>
                <td>PAID</td>
                <td>DELIVERED</td>
                <td>ACTIONS</td>
              </tr>
            </thead>
            <tbody>
              {orderMineList &&
                orderMineList.map((orderItem) => (
                  <tr key={orderItem._id}>
                    <td>{orderItem._id}</td>
                    <td>{orderItem.updatedAt.slice(0, 10)}</td>
                    <td>{Number(orderItem.itemsPrice).toFixed(2)}</td>
                    <td>{orderItem.isPaid ? "Paid" : "Not Paid"}</td>
                    <td>{orderItem.isPaid ? "Delivered" : "Not Delivered"}</td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => history.push(`/order/${orderItem._id}`)}
                      >
                        Details
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

export default OrderHistoryScreen;

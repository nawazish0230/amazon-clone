import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../../actions/orderAction";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import Chart from "react-google-charts";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { summaryLoading, summaryError, summary } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(orderActions.getSummary());
  }, []);

  return (
    <div>
      <div className="row">
        <h1>Dashboard</h1>
      </div>
      {summaryLoading ? (
        <LoadingBox></LoadingBox>
      ) : summaryError ? (
        <MessageBox variant="danger">{summaryError}</MessageBox>
      ) : (
        <>
          {summary && Object.keys(summary).length > 0 && (
            <>
              <ul className="row summary">
                <li>
                  <div className="summary-title color1">
                    <span>
                      <i className="fa fa-users"> Users</i>
                    </span>
                  </div>
                  <div className="summary-body">
                    {summary && summary.users[0].numUsers}
                  </div>
                </li>
                <li>
                  <div className="summary-title color2">
                    <span>
                      <i className="fa fa-shopping-cart"> Orders</i>
                    </span>
                  </div>
                  <div className="summary-body">
                    {summary && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </div>
                </li>
                <li>
                  <div className="summary-title color3">
                    <span>
                      <i className="fa fa-money"> Sales</i>
                    </span>
                  </div>
                  <div className="summary-body">
                    $
                    {summary && summary.orders[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </div>
                </li>
              </ul>
              <div>
                <h2>Sales</h2>
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Sale</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="AreaChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ["Date", "Sales"],
                      ...summary.dailyOrders.map((order) => [
                        order._id,
                        order.sales,
                      ]),
                    ]}
                  ></Chart>
                )}
              </div>
              <div>
                <h2>Categories</h2>
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Categories</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ["Category", "Products"],
                      ...summary.productCategories.map((product) => [
                        product._id,
                        product.count,
                      ]),
                    ]}
                  ></Chart>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardScreen;

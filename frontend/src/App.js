/* eslint-disable react/prop-types */
import { useSelector, useDispatch } from "react-redux";
import React, {
  BrowserRouter,
  Link,
  Route,
  Switch,
  // useHistory,
} from "react-router-dom";
import { userActions } from "./actions/userActions";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import OrderScreen from "./screens/OrderScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignScreen from "./screens/SignScreen";
import ProductListScreen from "./screens/admin/products/ProductListScreen";
import CreateProductScreen from "./screens/admin/products/CreateProductScreen";
import EditProductScreen from "./screens/admin/products/EditProductScreen";
import OrderListScreen from "./screens/admin/orders/OrderListScreen";
import UserListScreen from "./screens/admin/users/UserListScreen";
import EditUserScreen from "./screens/admin/users/EditUserScreen";
import SellerRoute from "./components/SellerRoute";
import SellerScreen from "./screens/SellerScreen";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import CategoryListScreen from "./screens/admin/category/CategoryListScreen";
import CreateCategoryScreen from "./screens/admin/category/CreateCategoryScreen";
import { useEffect, useState } from "react";
import { categoryActions } from "./actions/categoryActions";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";
import MapScreen from "./screens/MapScreen";
import DashboardScreen from "./screens/admin/DashboardScreen";

function App({ props }) {
  const dispatch = useDispatch();
  // const history = useHistory();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.user.userInfo);
  const { categoryLoading, categories, categoryError } = useSelector(
    (state) => state.category
  );

  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

  useEffect(() => {
    dispatch(categoryActions.listCategories());
  }, []);

  const signOutHandler = () => {
    dispatch(userActions.signOut());
    console.log(props);
    // history.push("/");
  };

  return (
    <body>
      <div className="grid-container">
        <BrowserRouter>
          <header className="row">
            <div>
              <button
                onClick={() => setSideBarIsOpen(true)}
                className="open-sidebar"
                type="button"
              >
                <div className="fa fa-bars"></div>
              </button>
              <Link className="brand" to="/">
                amazon clone
              </Link>
            </div>
            <div>
              <SearchBox />
            </div>
            <div>
              <Link to="/cart">
                Cart
                {cartItems.length > 0 && (
                  <>
                    <span className="badge">{cartItems.length}</span>
                  </>
                )}
              </Link>
              {userInfo && Object.keys(userInfo).length > 0 ? (
                <div className="dropdown">
                  <Link to="#">
                    {userInfo.name || "User"}{" "}
                    <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/profile">Update Profile</Link>
                    </li>
                    <li>
                      <Link to="/order-history">Order History</Link>
                    </li>
                    <li>
                      <Link to="#" onClick={signOutHandler}>
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
              {userInfo &&
                Object.keys(userInfo).length > 0 &&
                (userInfo.isAdmin || userInfo.isSeller) && (
                  <div className="dropdown">
                    <Link to="#">
                      Seller <i className="fa fa-caret-down"></i>
                    </Link>
                    <ul className="dropdown-content">
                      <li>
                        <Link to="/products-list/seller">Product</Link>
                      </li>
                      <li>
                        <Link to="/orders-list/seller">Orders</Link>
                      </li>
                    </ul>
                  </div>
                )}
              {userInfo &&
                Object.keys(userInfo).length > 0 &&
                userInfo.isAdmin && (
                  <div className="dropdown">
                    <Link to="#">
                      Admin <i className="fa fa-caret-down"></i>
                    </Link>
                    <ul className="dropdown-content">
                      <li>
                        <Link to="/dashboard">Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/products-list">Product</Link>
                      </li>
                      <li>
                        <Link to="/category-list">Category</Link>
                      </li>
                      <li>
                        <Link to="/orders-list">Orders</Link>
                      </li>
                      <li>
                        <Link to="/users-list">Users</Link>
                      </li>
                    </ul>
                  </div>
                )}
            </div>
          </header>

          <aside className={sideBarIsOpen ? "open " : ""}>
            <ul className="categories">
              <li>
                <strong>Categories</strong>
                <button
                  onClick={() => setSideBarIsOpen(false)}
                  className="close-sidebar"
                  type="button"
                >
                  <div className="fa fa-close"></div>
                </button>
              </li>
              {categoryLoading ? (
                <LoadingBox />
              ) : categoryError ? (
                <MessageBox variant="danger">{categoryError}</MessageBox>
              ) : (
                <>
                  {categories.length === 0 && (
                    <MessageBox>No Product Found</MessageBox>
                  )}
                  <ul>
                    {categories &&
                      categories.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            to={`/search/category/${cat.name}`}
                            onClick={() => setSideBarIsOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </ul>
          </aside>

          <Switch>
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/seller/:id" component={SellerScreen} />
            <Route path="/signin" component={SignScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/shipping" component={ShippingAddressScreen} />
            <Route path="/payment" component={PaymentMethodScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/order-history" component={OrderHistoryScreen} />
            <Route path="/search/name/:name?" exact component={SearchScreen} />
            <Route
              path="/search/category/:category"
              exact
              component={SearchScreen}
            />
            <Route
              path="/search/category/:category/name/:name"
              exact
              component={SearchScreen}
            />
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max"
              exact
              component={SearchScreen}
            />
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating"
              exact
              component={SearchScreen}
            />
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order"
              exact
              component={SearchScreen}
            />
            <Route
              path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/page-number/:pagenumber"
              exact
              component={SearchScreen}
            />
            <PrivateRoute path="/profile" component={ProfileScreen} />
            <PrivateRoute path="/map" component={MapScreen} />
            <SellerRoute
              path="/products-list/seller"
              component={ProductListScreen}
            />
            <SellerRoute
              path="/orders-list/seller"
              component={OrderListScreen}
            />
            <AdminRoute path="/dashboard" exact component={DashboardScreen} />
            <AdminRoute
              path="/products-list"
              exact
              component={ProductListScreen}
            />
            <AdminRoute
              path="/products-list/page/:pagenumber"
              exact
              component={ProductListScreen}
            />
            <AdminRoute
              path="/create-product"
              component={CreateProductScreen}
            />
            <AdminRoute
              path="/edit-product/:id"
              component={EditProductScreen}
            />
            <AdminRoute path="/category-list" component={CategoryListScreen} />
            <AdminRoute
              path="/create-category"
              component={CreateCategoryScreen}
            />
            <AdminRoute path="/orders-list" exact component={OrderListScreen} />
            <AdminRoute path="/users-list" component={UserListScreen} />
            <AdminRoute path="/edit-user/:id" component={EditUserScreen} />
            <Route path="/" exact component={HomeScreen} />
          </Switch>
        </BrowserRouter>

        <footer className="row center">All right reserved</footer>
      </div>
    </body>
  );
}

export default App;

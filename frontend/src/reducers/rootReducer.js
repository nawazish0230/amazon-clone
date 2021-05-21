import { combineReducers } from "redux";
import { productListReducer } from "./productReducers";
import { cartReducer } from "./cartReducer";
import { userReducer } from "./userReducer";
import { orderPayReducer, orderReducer } from "./orderReducer";
import { categoryReducer } from "./categoryReducers";

const rootReducer = combineReducers({
  user: userReducer,
  product: productListReducer,
  category: categoryReducer,
  cart: cartReducer,
  order: orderReducer,
  orderPay: orderPayReducer,
});

export default rootReducer;

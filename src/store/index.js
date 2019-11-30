import { createStore, compose } from "redux";

import RootReducer from "./reducers";
import Middleware from "../middleware";

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSIONS_COMPOSE__ || compose;
const store = createStore(RootReducer, composeEnhancers(Middleware));
window.store = store;
export default store;

import React from "react";
import ReactDOM from "react-dom";
import Main from "./pages/Main";
import Home from "./pages/Home/Home";
import Estimate from "./pages/Estimate";
import Login from "./pages/Login";
import baseURL from "./pages/baseURL";

const { Provider } = require("react-redux");
const store = require("./redux/configureStore.js").configure();

console.log(baseURL);

const Products = props => {
  return <div>Products</div>;
};

const PhoneList = props => {
  return <div>Phone List</div>;
};

let pageOptions = {
  home: Home,
  login: Login,
  estimate: Estimate,
  products: Products,
  phonelist: PhoneList
};

ReactDOM.render(
  <Provider store={store}>
    <Main pageOptions={pageOptions} baseURL={baseURL} />
  </Provider>,
  document.getElementById("app")
);

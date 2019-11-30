import { combineReducers, createStore, compose, applyMiddleware } from "redux";
var thunk = require("redux-thunk").default;
import { apiMiddleware } from "redux-api-middleware";
var {
  TaxReducer,
  LaborReducer,
  MaterialReducer,
  ExtraWorkReducer,
  EstimatorReducer,
  ProductsReducer,
  QuotesReducer,
  QuoteNumberReducer,
  DOMNodesReducer,
  DatabaseQuoteNumbersReducer
} = require("./reducers/reducers.js");
import Page from "../store/Page";
import Categories from "../store/Categories";
import Quotes from "../store/Quotes";
import Login from "../store/Login";
import Products from "../store/Products";

export var configure = (initialState = {}) => {
  var reducer = combineReducers({
    Page,
    Categories,
    Login,
    Quotes,
    Products,
    tax: TaxReducer,
    labor: LaborReducer,
    material: MaterialReducer,
    extraWork: ExtraWorkReducer,
    estimator: EstimatorReducer,
    products: ProductsReducer,
    quotes: QuotesReducer,
    quoteNumber: QuoteNumberReducer,
    shoppingCartDOMNodes: DOMNodesReducer,
    databaseQuoteNumbers: DatabaseQuoteNumbersReducer
  });

  initialState = {
    labor: 30,
    material: 30,
    extraWork: 40,
    tax: 9.5,
    estimator: "",
    products: [],
    shoppingCartDOMNodes: {
      products: {}
    },
    quotes: {},
    quoteNumber: null,
    databaseQuoteNumbers: []
  };
  var store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(apiMiddleware, thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  return store;
};

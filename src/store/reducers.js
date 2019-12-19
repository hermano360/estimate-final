import { combineReducers } from "redux";

import PageReducer from "./Page";
import TaxReducer from "./Tax";
import LaborReducer from "./Labor";
import MaterialReducer from "./Material";
import EmailReducer from "./Email";
import ExtraWorkReducer from "./ExtraWork";
import EstimatorReducer from "./Estimator";
import CategoriesReducer from "./Categories";
import ProductsReducer from "./Products";
import QuotesReducer from "./Quotes";
import QuoteNumberReducer from "./QuoteNumber";
import DOMNodesReducer from "./DOMNodes";
import DatabaseQuoteNumbersReducer from "./DatabaseQuoteNumbers";

import Estimate from "./Estimate";

const appReducers = {
  PageReducer,
  TaxReducer,
  LaborReducer,
  MaterialReducer,
  ExtraWorkReducer,
  EstimatorReducer,
  CategoriesReducer,
  ProductsReducer,
  QuotesReducer,
  QuoteNumberReducer,
  DOMNodesReducer,
  DatabaseQuoteNumbersReducer,
  Estimate,
  EmailReducer
};

const rootReducer = combineReducers({
  ...appReducers
});

export default rootReducer;

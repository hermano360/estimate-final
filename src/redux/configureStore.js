var redux = require('redux')
var thunk = require('redux-thunk').default
var {
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
  DatabaseQuoteNumbersReducer
} = require('./reducers/reducers.js')

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    page: PageReducer,
    tax: TaxReducer,
    labor: LaborReducer,
    material: MaterialReducer,
    extraWork: ExtraWorkReducer,
    estimator: EstimatorReducer,
    categories: CategoriesReducer,
    products: ProductsReducer,
    quotes: QuotesReducer,
    quoteNumber: QuoteNumberReducer,
    shoppingCartDOMNodes: DOMNodesReducer,
    databaseQuoteNumbers: DatabaseQuoteNumbersReducer
  })
  initialState = {
    page: 'login',
    labor: 30,
    material: 30,
    extraWork: 40,
    tax: 9.5,
    estimator: "",
    categories: [],
    products: [],
    shoppingCartDOMNodes: {
      products: {}
    },
    quotes: { },
    quoteNumber: null,
    databaseQuoteNumbers: []
  }
  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
  return store
}

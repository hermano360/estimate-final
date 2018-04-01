import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/Main'
import Home from './components/Home/Home'
import Estimate from './components/Estimate/Estimate'
import Login from './components/Login/Login'
const { Provider } = require('react-redux')
const store = require('./redux/configureStore.js').configure()

const Products = (props) => {
  return (
    <div>Products</div>
  )
}

const PhoneList = (props) => {
  return (
    <div>Phone List</div>
  )
}

let pageOptions = {
  home: Home,
  login: Login,
  estimate: Estimate,
  products: Products,
  phonelist: PhoneList
}

ReactDOM.render(
  <Provider store={store} >
    <Main pageOptions={pageOptions}/>
  </Provider>,
  document.getElementById('app')
)

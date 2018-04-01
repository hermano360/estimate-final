import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/Main'
import Home from './components/Home/Home'
import Estimate from './components/Estimate/Estimate'
import Login from './components/Login/Login'
import baseURL from './components/baseURL'



const { Provider } = require('react-redux')
const store = require('./redux/configureStore.js').configure()

console.log(baseURL)

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
    <Main pageOptions={pageOptions} baseURL={baseURL}/>
  </Provider>,
  document.getElementById('app')
)

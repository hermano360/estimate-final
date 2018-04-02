import React, {Component} from 'react'
var {connect} = require('react-redux')
import Loadable from 'react-loading-overlay'

import request from 'superagent'
import Home from './Home/Home'
import Estimate from './Estimate/Estimate'
import Login from './Login/Login'

import actions from '../redux/actions/actions'
import './Main.scss'

class PageContainer extends Component {
  state = {
    categoriesLoading: true,
    productsLoading: true,
    quotesLoading: true
  }

  shouldPropertyUpdate = (accessDate) => {
    const oneDay = 86400000
    return new Date().getTime() - accessDate > oneDay || accessDate === null
  }

  getCategories = () => {
    const {functions, data} = this.props
    const authToken = localStorage.getItem('authToken')
    const {baseURL} = data
    const {dispatch} = functions
    const timeCategoriesLastAccessed = JSON.parse(localStorage.getItem('categoriesAccessDate'))
    const existingCategories = JSON.parse(localStorage.getItem('categories'))
    let shouldUpdate = this.shouldPropertyUpdate(timeCategoriesLastAccessed)

    request.post(`${baseURL}/categories/custom`).send({authToken})
      .then((res) => {
        let customCategories = res.body
        if(shouldUpdate) {
          request.post(`${baseURL}/categories`)
          .then(response => {
            let categories = response.body
            localStorage.setItem('categoriesAccessDate',new Date().getTime())
            localStorage.setItem('categories', JSON.stringify(categories))
            dispatch(actions.loadCategories([...customCategories, ...categories]))
            this.setState({'categoriesLoading': false})
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          dispatch(actions.loadCategories([...customCategories, ...existingCategories]))
          this.setState({'categoriesLoading': false})
        }

      }).catch((err) => {
        console.log(err.response.text)
        localStorage.removeItem('authToken')
        dispatch(actions.changePage('login'))
        this.setState({'categoriesLoading': false})
      })

    this.setState({'categoriesLoading': false})

  }

  getQuotes = () => {
    const {functions, data} = this.props
    const authToken = localStorage.getItem('authToken')
    const {baseURL} = data
    const {dispatch} = functions

    request.post(`${baseURL}/quotes`).send({authToken})
      .then((res) => {
        let quotes = res.body
        dispatch(actions.loadQuotes(quotes))
        this.setState({'quotesLoading': false})
      }).catch((err) => {
        console.log(err.response.text)
        localStorage.removeItem('authToken')
        dispatch(actions.changePage('login'))
        this.setState({'quotesLoading': false})
      })
  }

  getProducts = () => {
    const {baseURL} = this.props.data
    const authToken = localStorage.getItem('authToken')
    const {dispatch} = this.props.functions

    const timeProductsLastAccessed = JSON.parse(localStorage.getItem('productsAccessDate'))
    const existingProducts = JSON.parse(localStorage.getItem('products'))

    let shouldUpdate = this.shouldPropertyUpdate(timeProductsLastAccessed) || existingProducts === null

    request.post(`${baseURL}/products/custom`).send({authToken})
      .then((res) => {
        let customProducts = res.body
        if(shouldUpdate) {
          request.post(`${baseURL}/products`)
          .then(response => {
            let products = response.body
            localStorage.setItem('productsAccessDate',new Date().getTime())
            localStorage.setItem('products', JSON.stringify(products))
            dispatch(actions.loadProducts([...customProducts, ...products]))
            this.setState({'productsLoading': false})
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          dispatch(actions.loadProducts([...customProducts, ...existingProducts]))
          this.setState({'productsLoading': false})
        }

      }).catch((err) => {
        console.log(err.response.text)
        localStorage.removeItem('authToken')
        dispatch(actions.changePage('login'))
        this.setState({'productsLoading': false})
      })
  }

  getCompleteData = () => {
    if(this.state.authToken !== null){
      this.getQuotes()
      this.getCategories()
      this.getProducts()
    } else {
      this.props.functions.dispatch(actions.changePage('login'))
    }

  }

  render(){
    const authToken = localStorage.getItem('authToken')

    const {categoriesLoading,productsLoading,quotesLoading} = this.state
    const {dispatch} = this.props.functions
    const {baseURL} = this.props.data
    const loading = categoriesLoading || productsLoading || quotesLoading

    const data = { loading, baseURL, authToken }
    const functions = {
      getCategories: this.getCategories,
      getQuotes: this.getQuotes,
      getProducts: this.getProducts,
      getCompleteData: this.getCompleteData,
      dispatch
    }
    return <this.props.component data={data} functions={functions} />
  }
}



export const Main = (props) =>  {
  const { page, baseURL, dispatch, pageOptions } = props
  const data = { baseURL,pageOptions }
  const functions = { dispatch }
  return (<PageContainer component={pageOptions[page]} data={data} functions={functions}/>)
}

export default connect(
  (state)=>{
    return { page: state.page }
  }
)(Main)

import React, {Component} from 'react'
var {connect} = require('react-redux')
import Loadable from 'react-loading-overlay'

import request from 'superagent'
import Home from './Home/Home'
import Estimate from './Estimate/Estimate'
import Login from './Login/Login'

import actions from '../redux/actions/actions'
import baseURL from './baseURL'
import './Main.scss'

class PageContainer extends Component {
  state = {
    categoriesLoading: true,
    productsLoading: true,
    quotesLoading: true,
  }

  getCategories = () => {
    const {categoriesLoading,productsLoading,quotesLoading} = this.state
    setTimeout(()=>{
      this.setState({'categoriesLoading': false})
      console.log('awesome')
      console.log(categoriesLoading && productsLoading && quotesLoading)
    }, 5000)
  }
  getQuotes = () => {
    this.setState({'quotesLoading': false})
  }
  getProducts = () => {
    this.setState({'productsLoading': false})
  }

  getCompleteData = () => {
    this.getQuotes()
    this.getCategories()
    this.getProducts()
  }

  render(){
    const {categoriesLoading,productsLoading,quotesLoading} = this.state
    const loading = categoriesLoading || productsLoading || quotesLoading
    const data = {
      loading,
      baseURL
    }
    const functions = {
      getCategories: this.getCategories,
      getQuotes: this.getQuotes,
      getProducts: this.getProducts,
      getCompleteData: this.getCompleteData
    }
    return <this.props.component data={data} functions={functions} />
  }
}

export class Main extends Component {

  retrieveExternalCategories(){
    const {dispatch} = this.props
    const currentTime = new Date().getTime()
    const timeCategoriesLastAccessed = localStorage.getItem('categoriesAccessDate')
    const oneDay = 86400000

    if(currentTime - timeCategoriesLastAccessed < oneDay && localStorage.getItem('categories')){
      dispatch(actions.loadCategories(JSON.parse(localStorage.getItem('categories'))))
      this.setState({
        categoriesReady: true
      })
    } else {
      request.get(`${baseURL.url}/categories`)
        .then((res) => {
          localStorage.setItem('categories', JSON.stringify(res.body))
          localStorage.setItem('categoriesAccessDate',new Date().getTime())
          dispatch(actions.loadCategories(res.body))
          this.setState({
            categoriesReady: true
          })
        }).catch((err) => { console.log(err) })
    }
  }

  retrieveExternalProducts(){
    const {dispatch} = this.props
    const currentTime = new Date().getTime()
    const timeProductsLastAccessed = localStorage.getItem('productsAccessDate')
    const oneDay = 86400000
    if(currentTime - timeProductsLastAccessed > oneDay || localStorage.getItem('products')===undefined){
      localStorage.getItem('authToken')
      request.post(`${baseURL.url}/products`).send({authToken})
        .then((res) => {
          console.log(res)
          localStorage.setItem('products', JSON.stringify(res.body))
          localStorage.setItem('productsAccessDate',new Date().getTime())
          dispatch(actions.loadProducts(res.body))
          this.setState({
            productsReady: true
          })
        }).catch((err) => { console.log(err) })
    } else {
      dispatch(actions.loadProducts(JSON.parse(localStorage.getItem('products'))))
      this.setState({
        productsReady: true
      })
    }
  }

  retrieveExternalQuotes(){
    const {dispatch} = this.props
    const currentTime = new Date().getTime()
    const timeProductsLastAccessed = localStorage.getItem('quotesAccessDate')
    const oneDay = 86400000
    request.get(`${baseURL.url}/quotes`)
      .then((res) => {
        localStorage.setItem('quotes', JSON.stringify(res.body))
        localStorage.setItem('quotesAccessDate',new Date().getTime())
        dispatch(actions.loadQuotes(res.body))
        dispatch(actions.loadDatabaseQuoteNumbers(res.body.map(quote=>quote.quoteNumber)))
        this.setState({
          quotesReady: true
        })
      }).catch((err) => { console.log(err) })

  }

  render () {
    const {pageOptions} = this.props
    const {page} = this.props
    return (<PageContainer component={pageOptions[page]} />)
  }
}

export default connect(
  (state)=>{
    return {
      page: state.page
    }
  }
)(Main)

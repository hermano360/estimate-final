import React, {Component} from 'react'
var {connect} = require('react-redux')
import Home from './Home/Home'
import Estimate from './Estimate/Estimate'
import actions from '../redux/actions/actions'
import request from 'superagent'
import './Main.scss'

class Main extends Component {

  retrieveExternalCategories(){
    const {dispatch} = this.props
    const currentTime = new Date().getTime()
    const timeCategoriesLastAccessed = localStorage.getItem('categoriesAccessDate')
    const oneDay = 86400000

    if(currentTime - timeCategoriesLastAccessed < oneDay && localStorage.getItem('categories')){
      dispatch(actions.loadCategories(JSON.parse(localStorage.getItem('categories'))))
    } else {
      request.get(`http://localhost:8000/categories`)
        .then((res) => {
          console.log(res)
          localStorage.setItem('categories', JSON.stringify(res.body))
          localStorage.setItem('categoriesAccessDate',new Date().getTime())
          dispatch(actions.loadCategories(res.body))
        }).catch((err) => { console.log(err) })
    }
  }

  retrieveExternalProducts(){

    const {dispatch} = this.props
    const currentTime = new Date().getTime()
    const timeProductsLastAccessed = localStorage.getItem('productsAccessDate')
    const oneDay = 86400000
    if(currentTime - timeProductsLastAccessed > oneDay || localStorage.getItem('products')===undefined){
      request.get(`http://localhost:8000/products`)
        .then((res) => {
          console.log(res)
          localStorage.setItem('products', JSON.stringify(res.body))
          localStorage.setItem('productsAccessDate',new Date().getTime())
          dispatch(actions.loadProducts(res.body))
        }).catch((err) => { console.log(err) })
    } else {
      dispatch(actions.loadProducts(JSON.parse(localStorage.getItem('products'))))
    }
  }

  retrieveExternalQuotes(){
    const {dispatch} = this.props
    const currentTime = new Date().getTime()
    const timeProductsLastAccessed = localStorage.getItem('quotesAccessDate')
    const oneDay = 86400000
    request.get(`http://localhost:8000/quotes`)
      .then((res) => {
        localStorage.setItem('quotes', JSON.stringify(res.body))
        localStorage.setItem('quotesAccessDate',new Date().getTime())
        dispatch(actions.loadQuotes(res.body))
        dispatch(actions.loadDatabaseQuoteNumbers(res.body.map(quote=>quote.quoteNumber)))
      }).catch((err) => { console.log(err) })

  }



  componentDidMount(){
    this.retrieveExternalCategories()
    this.retrieveExternalProducts()
    this.retrieveExternalQuotes()
  }

  renderCorrectPage(){
    const {page} = this.props
    switch(page){
      case "estimate":
        return <Estimate/>
        break
      case "phonelist":
        return (<div>Phonelist</div>)
        break
      case "products":
        return (<div>Products</div>)
        break
      default:
          return (<Home/>)
    }

  }
  render () {
    return (
      <div>
        {this.renderCorrectPage()}
      </div>
    )
  }
}

export default connect(
  (state)=>{
    return {
      page: state.page
    }
  }
)(Main)

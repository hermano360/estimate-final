import React, {Component} from 'react'
var {connect} = require('react-redux')
import Home from './Home/Home'
import Estimate from './Estimate/Estimate'
import actions from '../redux/actions/actions'
import request from 'superagent'
import Loadable from 'react-loading-overlay'
import './Main.scss'

class Main extends Component {
  constructor(e){
    super(e)
    this.state = {
      categoriesReady: false,
      productsReady: false,
      quotesReady:false
    }
  }

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
      request.get(`/categories`)
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
      request.get(`/products`)
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
    request.get(`/quotes`)
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
    const {quotesReady, productsReady, categoriesReady} = this.state
    const stillLoading = !(quotesReady && productsReady && categoriesReady)
    return (
      <div>
      <Loadable
        active={stillLoading}
        spinner
        text='Loading your content...'>
        <div>{this.renderCorrectPage()}</div>
      </Loadable>

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

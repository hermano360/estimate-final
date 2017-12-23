import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import actions from '../../../redux/actions/actions'
import 'react-select/dist/react-select.css';

import EstimateWorksheetItem from './EstimateWorksheetItem/EstimateWorksheetItem'
import './EstimateWorksheet.css'

class EstimateWorksheet extends Component {
  constructor(e){
    super(e)
  }

  generateCategorySelect(categories){
    return categories.map((category)=>{
      return {value: category.category, label: category.category}
    })
  }
  generateProductSelect(products){
    return products.map((product)=>{
      return {value: product.keycode, label: product.keycode}
    })
  }
  generateEstimateWorksheet(shoppingCart){
    return shoppingCart.map((shoppingCartItem,i)=>{
      const {keycode, group} = shoppingCartItem
      return (
        <EstimateWorksheetItem
          key={`${keycode}-${group}-${i}`}
          item={shoppingCartItem}
          itemNumber={i+1 }
          lastNumber={shoppingCart.length}
        />)
    })
  }

  handleCategorySelect(categorySelected){
    const {categories, products, quoteNumber, dispatch} = this.props

    // generates the list of keycodes associated with the category
    const desiredKeycodes = categories.filter((category)=>{
      return category.category === categorySelected
    })[0].products

    // combs through the products list to find the complete items
    const shoppingCartItems = products.filter((product)=>{
      return desiredKeycodes.includes(product.keycode)
    })

    dispatch(actions.addToShoppingCart(shoppingCartItems, quoteNumber, categorySelected))
  }

  handleProductSelect(productSelected){
    const {products, quoteNumber, dispatch} = this.props

    const shoppingCartItem = products.filter((product)=>{
      return product.keycode === productSelected
    })

    dispatch(actions.addToShoppingCart(shoppingCartItem, quoteNumber, ""))
  }



  render() {
    const {categories, products, shoppingCart} = this.props

    return (
      <div className="c-estimators-worksheet-body">
        <div className="c-estimators-worksheet-title">Estimators Worksheet</div>
        <span className="c-estimators-worksheet-select-container">
          <Select
            options={this.generateCategorySelect(categories)}
            style={{backgroundColor: 'black'}}
            onChange={(e) => { this.handleCategorySelect(e.value) }}
            placeholder='Choose Template'
            noResultsText='N/A'
            clearable={false}
            className='c-estimators-worksheet-categories-select c-estimators-worksheet-select'
          />
        </span>
        <span className="c-estimators-worksheet-select-container">
          <Select
            options={this.generateProductSelect(products)}
            onChange={(e) => { this.handleProductSelect(e.value) }}
            placeholder='Choose Product'
            noResultsText='N/A'
            clearable={false}
            className='c-estimators-worksheet-products-select c-estimators-worksheet-select'
          />
        </span>
        <div className="c-estimators-worksheet-list">
          <span className="c-estimators-worksheet-list-title">
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-no">#</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-code">Code</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-amt">Amt</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-units">Units</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-desc">Description</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-mtrl">Mtrl</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-lbr">Lbr</span>
            <span className="c-estimators-worksheet-list-header c-estimators-worksheet-list-x">x</span>
          </span>
          {this.generateEstimateWorksheet(shoppingCart)}
        </div>
      </div>
    );
  }
}

export default connect(
  (state)=>{
    return {
      categories: state.categories,
      products: state.products,
      quotes: state.quotes,
      quoteNumber: state.quoteNumber
    }
  }
)(EstimateWorksheet)

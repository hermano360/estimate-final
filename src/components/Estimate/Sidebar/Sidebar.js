import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import SimpleModal from '../../Common/SimpleModal'
import actions from '../../../redux/actions/actions'
import request from 'superagent'
import baseURL from '../../baseURL'

import './Sidebar.scss'

export class Sidebar extends Component {
  constructor(e){
    super(e)
    this.state = {
      estimateReady: false,
      shoppingListReady: false,
    }
    this.handleEstimate = this.handleEstimate.bind(this)
    this.handleShoppingList = this.handleShoppingList.bind(this)
    this.onHideModal = this.onHideModal.bind(this)
    this.handleAddProduct = this.handleAddProduct.bind(this)
  }
  generateTotal(quote){
    let total = 0
    quote.shoppingCart.forEach((item)=>{
      total += item.quantity *  parseFloat(item.labor.substr(1)) + item.quantity *  parseFloat(item.totalMaterial.substr(1))
    })
    return total.toFixed(2).toString()
  }
  removeEmptyItems(quote){
    return {
      ...quote,
      shoppingCart: [...quote.shoppingCart].filter((item)=>{
        return item.quantity !== 0
      })
    }
  }
  handleEstimate(estimateReady){
    const {quotes, quoteNumber, toggleShowModal} = this.props
    const quoteInformation = this.removeEmptyItems(quotes[quoteNumber])
    const total = this.generateTotal(quotes[quoteNumber])
    if(quoteInformation.shoppingCart.length > 0) {
      request
        .post(`${baseURL.url}/generateDocument`)
        .set('Content-Type', 'application/json')
        .send({
          quoteInformation,
          total
        }).then(res=>{
          this.setState({
            estimateReady: !estimateReady
          })
        })
        .catch(err=>{
          console.log(err)
        })
      } else {
        toggleShowModal()
      }
  }

  handleShoppingList(){
    const {quotes, quoteNumber} = this.props
    const {shoppingListReady} = this.state

    const total = this.generateTotal(quotes[quoteNumber])
    if(quotes[quoteNumber].shoppingCart.length > 0){
      request
        .post(`${baseURL.url}/shopping-list`)
        .set('Content-Type', 'application/json')
        .send({
          shoppingList: quotes[quoteNumber].shoppingCart,
          quoteNumber,
          total
          }).then(res=>{
          this.setState({
            shoppingListReady: !shoppingListReady
          })
        })
        .catch(err=>{
          console.log(err)
        })
    } else {
      toggleShowModal()
    }

  }
  handleDuplicate(){
    const {quotes, quoteNumber, availableQuoteNumbers, dispatch, toggleShowModal} = this.props
    const nextAvailableQuoteNumber = availableQuoteNumbers[availableQuoteNumbers.length-1]+1
    dispatch(actions.duplicateQuote(quotes[quoteNumber], nextAvailableQuoteNumber))
    dispatch(actions.setQuoteNumber(nextAvailableQuoteNumber))
    toggleShowModal()
  }
  handleNewQuote(){
    const {dispatch, availableQuoteNumbers, toggleShowModal} = this.props
    console.log(availableQuoteNumbers)
    let nextAvailableQuoteNumber = 1
    if(availableQuoteNumbers[0] !== undefined){
      nextAvailableQuoteNumber = availableQuoteNumbers[availableQuoteNumbers.length-1]+1
    }
    dispatch(actions.addNewQuote(nextAvailableQuoteNumber))
    dispatch(actions.setQuoteNumber(nextAvailableQuoteNumber))
    toggleShowModal()
  }
  handleWorkOrder(){
    console.log('work order')
  }

  firstTest = () => {
    return 'success!'
  }

  handleEmailBid(){
    const {toggleEmailFile,toggleShowModal} = this.props
    toggleShowModal()
    toggleEmailFile()
  }

  onHideModal(){
    const {toggleShowModal} = this.props
    toggleShowModal()
    this.setState({
      estimateReady: false
    })
  }
  handleAddProduct(){
    const {toggleAddProduct, toggleShowModal} = this.props
    toggleShowModal()
    toggleAddProduct()
  }

  render() {
    const {toggleShowModal, show} = this.props
    const {estimateReady, shoppingListReady} = this.state
    console.log(estimateReady)
    return (
      <SimpleModal open={show} toggle={this.onHideModal} >
        <div className="c-sidebar-header">Options</div>

        {!estimateReady && <div className="c-sidebar-item" onClick={()=>this.handleEstimate(estimateReady)}>Estimate</div>}
        {estimateReady && <a href='/downloadWordDocument' onClick={() => {
          console.log('herminio')
          this.setState({
            estimateReady: false
          })
        }}><div className="c-sidebar-item">Download</div></a>}
        <div className="c-sidebar-item" onClick={()=>this.handleDuplicate()}>Duplicate</div>
        <div className="c-sidebar-item" onClick={()=>this.handleNewQuote()}>New Quote</div>
        <div className="c-sidebar-item" onClick={()=>this.handleWorkOrder()}>Work Order</div>
        {!shoppingListReady && <div className="c-sidebar-item" onClick={()=>this.handleShoppingList()}>Shopping List</div>}
        {shoppingListReady && <a href='/downloadShoppingList' onClick={() => {
          this.setState({
            shoppingListReady: false
          })
        }}><div className="c-sidebar-item">Download</div></a>}


        <div className="c-sidebar-item" onClick={()=>this.handleEmailBid()}>Email Bid</div>
        <div className="c-sidebar-item" onClick={()=>this.handleAddProduct()}>Add Product</div>

        <Button className="c-sidebar-close" onClick={toggleShowModal}>Close</Button>
      </SimpleModal>

    );
  }
}

export default connect(
  (state)=>{
    return {
      quotes: state.quotes,
      quoteNumber: state.quoteNumber
    }
  }
)(Sidebar)

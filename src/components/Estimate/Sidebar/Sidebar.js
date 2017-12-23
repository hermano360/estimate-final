import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import actions from '../../../redux/actions/actions'
import request from 'superagent'

import './Sidebar.scss'

export class Sidebar extends Component {
  constructor(e){
    super(e)
    this.state = {
      estimateReady: false
    }
    this.handleEstimate = this.handleEstimate.bind(this)
    this.onHideModal = this.onHideModal.bind(this)
  }
  generateTotal(quote){
    let total = 0
    quote.shoppingCart.forEach((item)=>{
      total += item.quantity *  parseFloat(item.labor.substr(1)) + item.quantity *  parseFloat(item.totalMaterial.substr(1))
    })
    return total
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
    console.log(JSON.stringify(quoteInformation), total)
    if(quoteInformation.shoppingCart.length > 0) {
      console.log('api to be hit')
      request
        .post('http://localhost:8000/generateDocument')
        .set('Content-Type', 'application/json')
        .send({
          quoteInformation,
          total
        }).then(res=>{
          console.log(res)
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
  handleShoppingList(){
    console.log('shopping list')
  }
  handleEmailBid(){
    console.log('email bid')
  }
  onHideModal(){
    const {toggleShowModal} = this.props
    toggleShowModal()
    this.setState({
      estimateReady: false
    })
  }

  render() {
    const {toggleShowModal, show} = this.props
    const {estimateReady} = this.state

    return (
      <Modal show={show} onHide={this.onHideModal}  className="c-sidebar-modal" >
        <Modal.Header closeButton>
          <div className="c-sidebar-header">Options</div>
        </Modal.Header>
        <Modal.Body>
          {!estimateReady && <div className="c-sidebar-item" onClick={()=>this.handleEstimate(estimateReady)}>Estimate</div>}
          {estimateReady && <a href='http://localhost:8000/downloadWordDocument' onClick={() => {
            this.setState({
              estimateReady: false
            })
          }}><div className="c-sidebar-item">Download</div></a>}

          <div className="c-sidebar-item" onClick={()=>this.handleDuplicate()}>Duplicate</div>
          <div className="c-sidebar-item" onClick={()=>this.handleNewQuote()}>New Quote</div>
          <div className="c-sidebar-item" onClick={()=>this.handleWorkOrder()}>Work Order</div>
          <div className="c-sidebar-item" onClick={()=>this.handleShoppingList()}>Shopping List</div>
          <div className="c-sidebar-item" onClick={()=>this.handleEmailBid()}>Email Bid</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="c-sidebar-close" onClick={toggleShowModal}>Close</Button>
        </Modal.Footer>
      </Modal>
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

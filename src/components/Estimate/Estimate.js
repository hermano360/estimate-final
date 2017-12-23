import React, { Component } from 'react'
import { connect } from 'react-redux'
import TiArrowLeftOutline from 'react-icons/lib/ti/arrow-left-outline'
import TiArrowRightOutline from 'react-icons/lib/ti/arrow-right-outline'
import MdMenu from 'react-icons/lib/md/menu'
import ToggleButton from 'react-toggle'
import moment from 'moment'
import request from 'superagent'
import DateTimeField from 'react-bootstrap-datetimepicker'


import EstimateWorksheet from './EstimateWorksheet/EstimateWorksheet'
import Sidebar from './Sidebar/Sidebar'

import logo from '../../assets/images/ezestimator_logo.png'
import actions from '../../redux/actions/actions'

import "react-toggle/style.css"
import 'react-datepicker/dist/react-datepicker.css';
import './Estimate.scss'

export class Estimate extends Component {
  constructor(props){
    super(props)
    this.state = {
      showTotal: false,
      showSidebar: false,
      availableQuoteNumbers: []
    }
    this.toggleShowModal = this.toggleShowModal.bind(this)
    this.incrementQuoteNumber = this.incrementQuoteNumber.bind(this)
    this.decrementQuoteNumber = this.decrementQuoteNumber.bind(this)
    this.saveQuoteToDatabase = this.saveQuoteToDatabase.bind(this)
  }

  toggleShowModal(){
    const {showSidebar} = this.state
    this.setState({
      showSidebar: !showSidebar
    })
  }

  generateTotal(quote){
    let total = 0
    quote.shoppingCart.forEach((item)=>{
      total += item.quantity *  parseFloat(item.labor.substr(1)) + item.quantity *  parseFloat(item.totalMaterial.substr(1))
    })
    return total
  }

  findAvailableQuoteNumbers(quotes){
    if(quotes){
        return Object.keys(quotes).map(quote=>Number(quote)).sort((a, b) => a - b)
    }
    return []
  }

  findNextAvailableQuoteNumber(quotes){
    const availableQuoteNumbers = Object.keys(quotes).sort()
    console.log(availableQuoteNumbers)
    return Number(availableQuoteNumbers[availableQuoteNumbers.length-1]) + 1
  }

  incrementQuoteNumber(){
    const {quoteNumber, dispatch, quotes} = this.props
    const availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)
    const currentQuoteNumberPosition = availableQuoteNumbers.indexOf(quoteNumber)
    if(currentQuoteNumberPosition !== -1 && currentQuoteNumberPosition + 1 < availableQuoteNumbers.length){
      dispatch(actions.setQuoteNumber(Number(availableQuoteNumbers[currentQuoteNumberPosition + 1])))
    }

  }
  decrementQuoteNumber(){
    const {quoteNumber, dispatch, quotes} = this.props
    const availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)
    const currentQuoteNumberPosition = availableQuoteNumbers.indexOf(quoteNumber)
    if(currentQuoteNumberPosition !== -1 && currentQuoteNumberPosition > 0){
      dispatch(actions.setQuoteNumber(Number(availableQuoteNumbers[currentQuoteNumberPosition - 1])))
    }
  }

  componentWillMount(){
    const {quotes, dispatch} = this.props
    const availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)
    if(availableQuoteNumbers.length > 0) {
      dispatch(actions.setQuoteNumber(availableQuoteNumbers[0]))
    } else {
      dispatch(actions.addNewQuote(1))
      dispatch(actions.setQuoteNumber(1))
    }

  }

  renderCurrentQuote(quotes, quoteNumber){
    return quotes[quoteNumber]
  }

  redirectToComponent(component){
    const {dispatch} = this.props
    dispatch(actions.changePage(component))
  }
  saveQuoteToDatabase(){
    const {quotes, quoteNumber,dispatch} = this.props
    console.log(quotes[quoteNumber])
    request
      .post('http://localhost:8000/quotes')
      .send(quotes[quoteNumber])
      .then(res=> {
        dispatch(actions.loadQuotes(res.body))
        dispatch(actions.loadDatabaseQuoteNumbers(res.body.map(quote=>quote.quoteNumber)))
      })
      .catch(err=> console.log(err))
  }
  saveButtonWording(databaseQuoteNumbers, quoteNumber){
    if(databaseQuoteNumbers.indexOf(quoteNumber) === -1){
      return 'Create'
    } else {
      return 'Save'
    }
  }

  render() {
    const {dispatch, estimator, quotes, quoteNumber, shoppingCartDOMNodes, databaseQuoteNumbers} = this.props
    const {showTotal, showSidebar} = this.state
    let availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)

    const currentDate = moment().format('MM-DD-YYYY')
    console.log(currentDate)
    const currentQuote = this.renderCurrentQuote(quotes, quoteNumber)

    return (
      <div className="c-estimate-body">
        <Sidebar show={showSidebar} toggleShowModal={this.toggleShowModal} availableQuoteNumbers={availableQuoteNumbers}/>
        <div className="c-estimate-action-button c-estimate-sidebar"
          onClick={this.toggleShowModal}>
          <MdMenu/>
        </div>
        <div className="c-estimate-header">
          <div className="c-estimate-next-quote">
            <TiArrowLeftOutline onClick={this.decrementQuoteNumber} />
            <div className="c-estimate-next-quote-page">#{quoteNumber}</div>
            <TiArrowRightOutline onClick={this.incrementQuoteNumber}/>
          </div>
          <div className="c-estimate-logo-container">
            <img src={logo} alt='Estimate Logo' className="c-estimate-logo"/>
          </div>
          <ToggleButton className="c-estimate-show-total" checked={showTotal}
            icons={{checked: null, unchecked: null}}
            onChange={() => this.setState({showTotal: !showTotal})} />
        </div>
        <div className="c-estimate-input-body">
          <input type="text" className="c-estimate-input c-estimate-input-half"
            placeholder="First Name" value={currentQuote.customerFirstName}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'customerFirstName', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['firstName'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('firstName', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['lastName'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-half"
            placeholder="Last Name" value={currentQuote.customerLastName}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'customerLastName', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['lastName'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('lastName', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['address'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-full"
            placeholder="Street Address" value={currentQuote.address}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'address', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['address'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('address', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['city'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-third"
            placeholder="City" value={currentQuote.city}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'city', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['city'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('city', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['state'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-third"
            placeholder="State" value={currentQuote.state}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'state', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['state'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('state', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['zipcode'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-third"
            placeholder="ZIP" value={currentQuote.zipcode}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'zipcode', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['zipcode'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('zipcode', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['phone'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-half"
            placeholder="Phone" value={currentQuote.phone}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'phone', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['phone'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('phone', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['email'].focus() } }}/>
          <input type="text" className="c-estimate-input c-estimate-input-half"
            placeholder="Email" value={currentQuote.email}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'email', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['email'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('email', input))}}}
            onKeyPress={(e) => { if (e.charCode === 13) { shoppingCartDOMNodes['scopeOfWork'].focus() } }}/>
          <select className='c-estimate-estimator c-estimate-input c-estimate-input-half'
            value={currentQuote.estimator} onChange={(e)=>{dispatch(actions.changeEstimator(e.target.value))}}>
            <option value="">-Estimator-</option>
            <option value="Arnold Corona">Arnold Corona</option>
            <option value="Gary Banks">Gary Banks</option>
            <option value="John Chavez">John Chavez</option>
            <option value="John Gutierrez">John Gutierrez</option>
            <option value="Bob Leon">Bob Leon</option>
            <option value="Ricardo Rivera">Ricardo Rivera</option>
            <option value="Mike Rogers">Mike Rogers</option>
            <option value="Cameron Sterling">Cameron Sterling</option>
          </select>
          <div className="c-estimate-input-half dateDiv">
            <DateTimeField mode="date" dateTime={currentDate} format= "MM-DD-YYYY" inputFormat= "MM/DD/YYYY" onChange={(e)=>{console.log(e,'now')}}/>
          </div>
          <textarea className="c-estimate-input c-estimate-input-textarea"
            placeholder="Scope of Work" value={currentQuote.scopeOfWork}
            onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'scopeOfWork', e.target.value))}
            ref = {input => { if (shoppingCartDOMNodes['scopeOfWork'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('scopeOfWork', input))}}}
            onKeyPress={e =>  {if(e.charCode === 13)  {shoppingCartDOMNodes['products'][1]===undefined ? shoppingCartDOMNodes['firstName'].focus() : shoppingCartDOMNodes['products'][1].focus()}} }/>
        </div>
        <EstimateWorksheet shoppingCart={currentQuote.shoppingCart}/>
          <div className="c-estimate-action-button c-estimate-back" onClick={()=>this.redirectToComponent('')}>Back</div>
        <div className="c-estimate-action-button c-estimate-save"
          onClick={this.saveQuoteToDatabase}
        >{this.saveButtonWording(databaseQuoteNumbers, quoteNumber)}</div>
        <div className={`c-estimate-action-button c-estimate-total ${showTotal ? '' : 'hidden'}`} >
        Total
        <br/>
        ${this.generateTotal(quotes[quoteNumber]).toFixed(2)}
        </div>
      </div>
    );
  }
}

export default connect(
  (state)=>{
    return {
      estimator: state.estimator,
      quotes: state.quotes,
      quoteNumber: state.quoteNumber,
      shoppingCartDOMNodes: state.shoppingCartDOMNodes,
      databaseQuoteNumbers: state.databaseQuoteNumbers
    }
  }
)(Estimate)

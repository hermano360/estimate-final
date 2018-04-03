import React, { Component } from 'react'
import { connect } from 'react-redux'
import TiArrowLeftOutline from 'react-icons/lib/ti/arrow-left-outline'
import TiArrowRightOutline from 'react-icons/lib/ti/arrow-right-outline'
import MdMenu from 'react-icons/lib/md/menu'
import ToggleButton from 'react-toggle'
import request from 'superagent'
import DateTimeField from 'react-bootstrap-datetimepicker'
import Loadable from 'react-loading-overlay'

import EstimateWorksheet from './EstimateWorksheet/EstimateWorksheet'

import EmailFile from './EmailFile/EmailFile'
import AddProduct from './AddProduct/AddProduct'
import RemoveQuote from './RemoveQuote/RemoveQuote'
import Sidebar from './Sidebar/Sidebar'
import SignatureBox from './SignatureBox/SignatureBox'

import baseURL from '../baseURL'
import logo from '../../assets/images/ezestimator_logo.png'
import actions from '../../redux/actions/actions'

import "react-toggle/style.css"
import 'react-datepicker/dist/react-datepicker.css';
import './Estimate.scss'

export class Estimate extends Component {
  state = {
      showTotal: false,
      showSidebar: false,
      showMaterialInfo: false,
      removeQuoteModal: false,
      showEmailFile: false,
      showAddProduct: false,
      availableQuoteNumbers: [],
      currentDate: "",
      loadingSave: false,
      sendingEmail: false,
      shoppingCartInMaterialInfo: {}
    }

  toggleShowMaterial = showMaterialInfo => this.setState({showMaterialInfo})
  toggleShowSidebarModal = showSidebar => this.setState({showSidebar})
  toggleShowModal = showSidebar => this.setState({showSidebar})
  toggleRemoveQuote = removeQuoteModal => this.setState({removeQuoteModal})
  toggleAddProduct = showAddProduct => this.setState({showAddProduct})

  generateTotal(quote){
    const {labor, material, tax} = this.props
    let total = 0
    quote.shoppingCart.forEach((item)=>{
      total += item.quantity *  parseFloat(item.labor.substr(1)) * (1 + labor/100)  + item.quantity *  parseFloat(item.totalMaterial.substr(1)) * (1 + material/100)
    })
    return total * (1 + tax/100)
  }


  findAvailableQuoteNumbers = quotes => {
    return quotes ? Object.keys(quotes).map(quote=>Number(quote)).sort((a, b) => a - b) : []
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

  getCurrentDate = (stateDate, quotesDate) => {
    return stateDate === '' ? quotesDate === "" ? this.formatDate(new Date()) : quotesDate : stateDate
  }

  incrementQuoteNumber = () => {
    const {quoteNumber, dispatch, quotes} = this.props
    const availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)
    const currentQuoteNumberPosition = availableQuoteNumbers.indexOf(quoteNumber)
    if(currentQuoteNumberPosition !== -1 && currentQuoteNumberPosition + 1 < availableQuoteNumbers.length){
      dispatch(actions.setQuoteNumber(Number(availableQuoteNumbers[currentQuoteNumberPosition + 1])))
    }
    this.setState({
      currentDate: ""
    })

  }
  decrementQuoteNumber = () => {
    const {quoteNumber, dispatch, quotes} = this.props
    const availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)
    const currentQuoteNumberPosition = availableQuoteNumbers.indexOf(quoteNumber)
    if(currentQuoteNumberPosition !== -1 && currentQuoteNumberPosition > 0){
      dispatch(actions.setQuoteNumber(Number(availableQuoteNumbers[currentQuoteNumberPosition - 1])))
    }
    this.setState({
      currentDate: ""
    })
  }



  redirectToComponent(component){
    const {dispatch} = this.props
    dispatch(actions.changePage(component))
  }

  formatDate = (date) => {
    const month = date.getMonth()
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month < 10 ? 0 : ''}${month+1}-${day < 10 ? 0 : ''}${day}-${year}`
  }

  chooseEstimator = (quotesEstimator, localEstimator) => {
    return quotesEstimator === '' ?  localEstimator === null || localEstimator === '' ? '' : localEstimator : quotesEstimator
  }

  render(){
    const {showSidebar, removeQuoteModal, showTotal, showMaterialInfo, loadingSave, showAddProduct} = this.state
    const {quotes, shoppingCartDOMNodes, dispatch, data, databaseQuoteNumbers, functions} = this.props
    const availableQuoteNumbers = this.findAvailableQuoteNumbers(quotes)
    const quoteNumber = this.props.quoteNumber || availableQuoteNumbers[0]
    const currentQuote = quotes[quoteNumber]

    let loading = data.loading || loadingSave
    const estimator = this.chooseEstimator(quotes[quoteNumber].estimator, localStorage.getItem('estimator'))
    const currentDate = this.getCurrentDate(this.state.currentDate, quotes[quoteNumber].date)
    const grandTotal = this.generateTotal(quotes[quoteNumber]).toFixed(2)


    return (
      <Loadable active={loading} spinner text={`Loading`}>
        <div className="c-estimate-body">
          <Sidebar
            grandTotal={grandTotal}
            show={showSidebar}
            toggleShowModal={() => this.toggleShowSidebarModal(!showSidebar)}
            availableQuoteNumbers={availableQuoteNumbers}
            toggleEmailFile={this.toggleEmailFile}
            toggleAddProduct={this.toggleAddProduct}
            baseURL={data.baseURL}
            authToken={data.authToken}
          />
          <RemoveQuote show={removeQuoteModal} toggleRemoveQuote={()=> this.toggleRemoveQuote(!removeQuoteModal)} />

          {/* <EmailFile show={showEmailFile} sendEmail={this.sendEmail} toggleEmailFile={this.toggleEmailFile} name={`${currentQuote.customerFirstName} ${currentQuote.customerLastName}`}/> */}
          <AddProduct
            show={showAddProduct}
            toggleAddProduct={()=> this.toggleAddProduct(!showAddProduct)}
            getProducts={functions.getProducts}
            baseURL={data.baseURL}
            authToken={data.authToken}
          />
          {/* <SignatureBox /> */}
          <div className="c-estimate-action-button c-estimate-sidebar"
            onClick={() => this.toggleShowSidebarModal(!showSidebar)}>
            <MdMenu/>
          </div>
          <div className="c-estimate-header">
            <div className="c-estimate-next-quote">
              <TiArrowLeftOutline onClick={this.decrementQuoteNumber} />
              <div className="c-estimate-next-quote-page">#{quoteNumber}</div>
              <TiArrowRightOutline onClick={this.incrementQuoteNumber}/>
            </div>
            <div className="c-estimate-remove-quote" onClick={()=> this.toggleRemoveQuote(!removeQuoteModal)}>Remove Quote</div>
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
              value={estimator} onChange={(e)=>{dispatch(actions.editQuoteAttribute(quoteNumber,'estimator', e.target.value))}}>
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
              <DateTimeField mode="date" dateTime={currentDate}
              format= "MM-DD-YYYY" inputFormat= "MM/DD/YYYY" onChange={this.handleChangeDate}/>
            </div>
            <textarea className="c-estimate-input c-estimate-input-textarea"
              placeholder="Scope of Work" value={currentQuote.scopeOfWork}
              onChange={(e)=>dispatch(actions.editQuoteAttribute(quoteNumber,'scopeOfWork', e.target.value))}
              ref = {input => { if (shoppingCartDOMNodes['scopeOfWork'] === undefined && input !== null) {dispatch(actions.setShoppingCartNode('scopeOfWork', input))}}}
              onKeyPress={e =>  {if(e.charCode === 13)  {shoppingCartDOMNodes['products'][1]===undefined ? shoppingCartDOMNodes['firstName'].focus() : shoppingCartDOMNodes['products'][1].focus()}} }/>
          </div>
          <EstimateWorksheet retrieveProducts={()=>console.log('idk')} showMaterialInfo={showMaterialInfo} toggleShowMaterial={() => this.toggleShowMaterial(!showMaterialInfo)} shoppingCart={currentQuote.shoppingCart} renderMaterialInfo={this.renderMaterialInfo}/>
          <div className="c-estimate-action-button c-estimate-back" onClick={()=>this.redirectToComponent('home')}>Back</div>
          <div className="c-estimate-action-button c-estimate-save"
            onClick={()=> this.saveQuoteToDatabase(currentDate, estimator)}
          >Save</div>
          <div className={`c-estimate-action-button c-estimate-total ${showTotal ? '' : 'hidden'}`} >
          Total
          <br/>
          ${grandTotal}
          </div>
        </div>
      </Loadable>
        )
    }





  toggleEmailFile = () => {
    const {showEmailFile} = this.state
    this.setState({
      showEmailFile: !showEmailFile
    })
  }






  saveQuoteToDatabase = (currentDate, estimator) => {
    const {quotes, quoteNumber,dispatch, data} = this.props
    const {baseURL, authToken} = data

    this.setState({loadingSave: true})

    request
      .post(`${baseURL}/quotes/save`)
      .send({
        quote: {...quotes[quoteNumber], date: currentDate, estimator },
        authToken
      })
      .then(res=> {
        this.setState({loadingSave: false})
        console.log(res)
      })
      .catch(err=> console.log(err))


    //
    // let estimator = localStorage.getItem('estimator')
    // let quoteToBeSaved = quotes[quoteNumber]
    //
    // if(currentDate === ""){
    //   if(quoteToBeSaved.date === ""){
    //     quoteToBeSaved = formatDate(new Date())
    //   }
    // } else {
    //   quoteToBeSaved.date = currentDate
    // }
    //
    // if(quoteToBeSaved.estimator === ""){
    //   if(estimator !== undefined && estimator !== ''){
    //     quoteToBeSaved.estimator = estimator
    //   }
    // }
    // this.setState({
    //   loadingSave: true
    // })


  }


  handleChangeDate = e => {
    const {dispatch, quoteNumber} = this.props

    const regex = /([0-9]{2})-([0-9]{2})-([0-9]{4})/g;
    let month = Number(e.replace(regex,"$1"))
    let day = Number(e.replace(regex,"$2"))
    let year = Number(e.replace(regex,"$3"))

    if(month > 0 && month < 13 && day > 0 && day < 32 && year > 2000 && year < 3000){
      dispatch(actions.editQuoteAttribute(quoteNumber,'date', e))
      this.setState({
        currentDate: e
      })
    }
  }




  sendEmail(fileToBeSent, finalName, recipientEmail){
    this.toggleEmailFile()
    this.setState({
      loadingSave: true,
      sendingEmail: true
    })
    const fileName = fileToBeSent === 'estimate' ? `ProBuildersEstimate.docx` : `ProBuildersShoppingList.docx`

    request
      .post(`${baseURL.url}/emailFile`)
      .set('Content-Type', 'application/json')
      .send({
        dirPath: fileName,
        name: finalName,
        email: recipientEmail
      }).then(res=>{
          console.log(res)
          this.setState({
            loadingSave: false,
            sendingEmail: false
          })
      })
      .catch(err=>{
        console.log(err)
      })
  }

}

export default connect(
  state => {
    return {
      estimator: state.estimator,
      quotes: state.quotes,
      quoteNumber: state.quoteNumber,
      shoppingCartDOMNodes: state.shoppingCartDOMNodes,
      databaseQuoteNumbers: state.databaseQuoteNumbers,
      labor: state.labor,
      material: state.material,
      tax: state.tax
    }
  }
)(Estimate)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import actions from '../../../redux/actions/actions'
import Loadable from 'react-loading-overlay'
import request from 'superagent'
import moment from 'moment'

import baseURL from '../../baseURL'

import './AddProduct.scss'

export class AddProduct extends Component {
  constructor(e){
    super(e)
    this.state = {
      sku: '',
      skuError: false,
      url: '',
      store: '',
      productEntry: {},
      loadingProduct: false
    }
    this.handleSKUChange = this.handleSKUChange.bind(this)
    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleStoreChange = this.handleStoreChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleSKUChange(e){
    this.setState({
      sku: e.target.value
    })
  }
  handleURLChange(e){
    this.setState({
      url: e.target.value
    })
  }
  handleStoreChange(e){
    this.setState({
      store: e.target.value
    })
  }

  handleToggle(){
    const {toggleAddProduct} = this.props
    this.setState({
      sku: '',
      skuError: false,
      url: '',
      store: '',
      productEntry: {},
      loadingProduct: false
    })
    toggleAddProduct()
  }


  handleSubmit(){
    const {sku, url, store} = this.state
    this.setState({
      loadingProduct: true
    })

    if(sku !== "") {
      request
      .post(`${baseURL.url}/searchSKU`)
      .send({sku, url, store})
      .then(res => {
      console.log(res.body)
      this.setState({
        productEntry: res.body,
        loadingProduct: false
      }, ()=>{console.log(this.state)})
    }
    )
      .catch(err => console.log(err))
    }
  }


  render() {
    const {dispatch, show, toggleAddProduct} = this.props
    const {sku, skuError, store, productEntry, loadingProduct} = this.state
    const name = 'hello'

    return (
      <Modal show={show} onHide={this.handleToggle} className="c-emailfile-modal" >
      <Loadable
        active={loadingProduct}
        spinner
        text={`Obtaining Information from ${store}`}>
        <Modal.Header closeButton>
          <div className="c-emailfile-header">Add Product</div>
        </Modal.Header>
        <Modal.Body>

        <div>Store Select</div>
        <select className='c-settings-estimator' value={store} onChange={this.handleStoreChange}>
          <option value="">-Select-</option>
          <option value="Home Depot">Home Depot</option>
        </select>
        {!skuError && store!=="" && (<div>
          <div>Search By SKU</div>
          <input type="text" className={`c-emailfile-options-input`}
            placeholder="SKU Number" value={sku}
            onChange={this.handleSKUChange}/>
        </div>)}

        {/*skuError && (<div>
          <div>Search By URL</div>
          <input type="text" className={`c-emailfile-options-input`}
            placeholder="Name of Recipient" value={name}
            onChange={this.handleURLChange}/>
          </div>)*/}
          {Object.keys(productEntry).length > 0 && (
            <div className="c-addproduct-body">
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property">Supplier</div>
                <div className="c-addproduct-value">{store} - {productEntry.brand}</div>
              </div>
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property">Cost</div>
                <div className="c-addproduct-value">${productEntry.priceDollars} {productEntry.uom}</div>
              </div>
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property">SKU</div>
                <div className="c-addproduct-value">{productEntry.sku}</div>
              </div>
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property">Model #</div>
                <div className="c-addproduct-value">{productEntry.model}</div>
              </div>
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property">Internet #</div>
                <div className="c-addproduct-value">{productEntry.internet}</div>
              </div>
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property full">Product Name</div>
                <div className="c-addproduct-value full">{productEntry.title}</div>
              </div>
              <div className="c-addproduct-picture">
                <img src={productEntry.mainImg} className="c-addproduct-picture-frame"/>
              </div>
              <div className="c-addproduct-pair">
                <div className="c-addproduct-property">Date Accessed</div>
                <div className="c-addproduct-value">{moment(productEntry.dateAccessed).format('MM-DD-YYYY')}</div>
              </div>
            </div>
          )}


        </Modal.Body>
        <Modal.Footer>
        {sku!=="" && Object.keys(productEntry).length===0 && <div className="c-addproduct-submit" onClick={this.handleSubmit}>Submit</div>}
        {sku!=="" && Object.keys(productEntry).length>0 &&<div className="c-addproduct-submit" onClick={this.handleToggle}>Add Product</div>}
        </Modal.Footer>
        </Loadable>
      </Modal>

    );
  }
}

export default connect(
  (state)=>{
    return {
      quoteNumber: state.quoteNumber
    }
  }
)(AddProduct)

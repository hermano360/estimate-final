import React, { Component } from 'react'
import { connect } from 'react-redux'
import SimpleModal from '../../Common/SimpleModal'
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
      group: '',
      supplier:'',
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
  handleStoreChange = (e) => {
    this.setState({
      store: e.target.value
    })
  }
  handleSupplierChange = (e) => {
    this.setState({
      supplier: e.target.value
    })
  }
  handleGroupChange = e => {
    this.setState({
      group: e.target.value
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

  renderGroupOptions = () => {
    let groups = []
    let allProducts = JSON.parse(localStorage.getItem('products'))
    allProducts.forEach(product => {
    if(!groups.includes(product.group)){
            groups.push(product.group)
        }
    })

    return groups
    .map(group => {
      return group === '' ? '' : group[0].toUpperCase() + group.slice(1)
    })
    .filter((group,i) => {
      return group !== '' && groups.indexOf(group) === i
    })
    .sort()
    .map(group => {
      return (
        <option key={group }value={group}>{group}</option>
      )
    })


  }


  render() {
    const {dispatch, show, toggleAddProduct} = this.props
    const {sku, skuError, store, productEntry, loadingProduct, supplier, group} = this.state

    return (
      <SimpleModal open={show} toggle={this.handleToggle} className="c-addproduct-modal" >
        <Loadable
          active={loadingProduct}
          spinner
          text={`Obtaining Information from ${store}`}>
          <div className="c-addproduct-body">
            <div className="c-addproduct-header">Add Product</div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Desired Key Code</div>
              <input type="text" className="c-addproduct-value"/>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Specifications</div>
              <textarea className="c-addproduct-value" rows="4" onChange={(e)=>console.log(e.target.value)}>
              </textarea>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Unit of Measure</div>
              <input type="text" className="c-addproduct-value"/>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Material Cost</div>
              <input type="text" className="c-addproduct-value"/>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Labor Cost</div>
              <input type="text" className="c-addproduct-value"/>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Add to Existing Group?</div>
              <select className="c-addproduct-value" value={group} onChange={this.handleGroupChange}>
                <option value="">-Select-</option>
                {this.renderGroupOptions()}
              </select>
            </div>
            <div className="c-addproduct-group">
              <div className="c-addproduct-prop">Supplier</div>
              <select className="c-addproduct-value" value={supplier} onChange={this.handleSupplierChange}>
                <option value="">-Select-</option>
                <option value="Home Depot">Home Depot</option>
                <option value="Lowes">Lowes</option>
                <option value="Ferguson">Ferguson</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </Loadable>
      </SimpleModal>
    )
  }
}

export default connect(
  (state)=>{
    return {
      quoteNumber: state.quoteNumber
    }
  }
)(AddProduct)

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import SimpleModal from '../../Common/SimpleModal'
import actions from '../../../redux/actions/actions'
import Loadable from 'react-loading-overlay'
import request from 'superagent'

import baseURL from '../../baseURL'

import './AddTemplate.scss'
import 'react-select/dist/react-select.css';

export class AddTemplate extends Component {
  state = {
    loading: false,
    editExisting: false,
    templateName: '',
    productList: [],
    customProductList: [],
    showAddProduct: false,
    templateSortOrder: ''
  }
  handleToggle = () => {
    const {toggleAddTemplate} = this.props
    this.setState({
      editExisting: false,
      templateName: '',
      productList: [],
      customProductList: [],
      showAddProduct: false,
      templateSortOrder: ''
    })
    toggleAddTemplate()
  }

  toggleExisting = () => {
    this.setState(({editExisting}) => {
      return {
        editExisting: !editExisting,
      }
    })
  }

  checkIfExistingTemplate = (templateList, input) => {
    let productList = []
    templateList.forEach(template => {
      if(template.category === input){
        if(template._id){
          this.setState({productList: template.products})
        } else {
          this.setState({customProductList: template.products})
        }

      }
    })
    this.setState({
      showAddProduct: true
    })

  }

  generateTemplates = (templates) => {
    return templates.map(template => {
      return {value: template.category, label: template.category}
    })
  }
  generateProducts = (products) => {
    return products.map(product => {
      return {value: product.keycode, label: product.keycode}
    })
  }

  extractTemplateNamesFromTemplateList = (templateList) => {
    return templateList.map(template => {
      return template.category
    })
  }

  addProductToList = (product) => {
    this.setState(({customProductList}) => {
      let newCustomList = customProductList.filter(existingProduct => {
        return existingProduct !== product
      }).slice(-2)
      return {
        customProductList: [...newCustomList, product]
      }
    })
  }

  removeItemFromCustomList = (product) => {
    this.setState(({customProductList}) => {
      return {
        customProductList: customProductList.filter(existingProduct => existingProduct !== product)
      }
    })
  }

  submitValues = () => {
    const {baseURL, authToken, getCategories} = this.props
    const {templateName, templateSortOrder, customProductList} = this.state
    request
      .post(`${baseURL}/categories/custom/add`)
      .send({
        authToken,
        template: {
          category: templateName,
          sortOrder:templateSortOrder,
          products: customProductList
        }
      })
      .then(res => {
        this.handleToggle()
        getCategories()
        console.log(res)
      })
      .catch(err => {
        this.handleToggle()
        console.log(err)
      })

  }






  render() {
    const {show, toggleAddTemplate, getProducts, categories, products} = this.props
    const {loading, editExisting, templateName, productList, customProductList, showAddProduct, templateSortOrder} = this.state

    return (
      <SimpleModal open={show} toggle={this.handleToggle} className="c-addtemplate-modal" >
        <Loadable
          active={loading}
          spinner
          text={`Uploading Template`}>
          <div className="c-addtemplate-body">
            <div className="c-addtemplate-header">Add Template</div>
            {/*<div className="c-addtemplate-existing">
              <div className={`c-addtemplate-existing-radio ${editExisting && 'checked'}`}  onClick={this.toggleExisting}></div>
              <div className="c-addtemplate-existing-label">Edit Existing Template?</div>
            </div>*/}
            <div className="c-addtemplate-form">
              <input
                type="text"
                onChange={(e) => this.setState({templateName: e.target.value})}
                onBlur={e=>this.checkIfExistingTemplate(categories,e.target.value)}
                value={templateName}
                placeholder='Template Name'
                className='c-addtemplate-form-template-name'
              />
              {templateName !== '' && <input
                type="number"
                onChange={(e) => this.setState({templateSortOrder: e.target.value})}
                value={templateSortOrder}
                placeholder='Sort Order'
                className='c-addtemplate-form-template-sort-order'
              />}

              {/* {productList.length > 0 && (
                <div className='c-addtemplate-form-template-products-main'>
                  <div className='c-addtemplate-form-template-products-main-title'>
                    General Products
                  </div>
                  <div className='c-addtemplate-form-template-products-main-body'>
                    {productList.map((product,i) => {
                      return <div key={i} className='c-addtemplate-form-template-products-main-item'>{product}</div>
                    })}
                  </div>
                </div>
                )
              } */}


              {customProductList.length > 0 && (
                <div className='c-addtemplate-form-template-products-custom'>
                  <div className='c-addtemplate-form-template-products-custom-title'>
                    Custom Products
                  </div>
                  <div className='c-addtemplate-form-template-products-custom-body'>
                    {customProductList.map((product,i) => {
                      return <div key={i} className='c-addtemplate-form-template-products-custom-item' onClick={()=>this.removeItemFromCustomList(product)}>{product}</div>
                    })}
                  </div>

                </div>
                )
              }

              {showAddProduct && <Select
                options={this.generateProducts(products)}
                onChange={({value}) => this.addProductToList(value)}
                onInputChange={console.log}
                placeholder='Add Product'
                noResultsText=''
                clearable={false}
                className='c-addtemplate-form-template-name-add-product'
              />}
            </div>

              {customProductList.length > 0 && <div className='c-addtemplate-form-submit' onClick={this.submitValues}>Submit</div>}
            </div>

        </Loadable>
      </SimpleModal>
    )
  }
}

export default connect(
  (state)=>{
    return {
      categories: state.categories,
      products: state.products,
    }
  }
)(AddTemplate)

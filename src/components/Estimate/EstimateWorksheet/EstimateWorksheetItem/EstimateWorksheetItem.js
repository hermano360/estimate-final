import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import FaClose from 'react-icons/lib/fa/close'

import actions from '../../../../redux/actions/actions'
import './EstimateWorksheetItem.css'

class EstimateWorksheetItem extends Component {
  constructor(e){
    super(e)
    this.state = {
      focus: false
    }
    this.toggleTextAreaFocus = this.toggleTextAreaFocus.bind(this)
  }

  toggleTextAreaFocus(){
    const {focus} = this.state
    this.setState({
      focus: !focus
    })
  }

  findNextAvailableNodePosition(CartNodes, current){
      const {products} = CartNodes
      const productKeys = Object.keys(products).sort()
      const currentIndex = productKeys.indexOf(current)
      if(currentIndex < productKeys.length - 1){
        return currentIndex + 1
      } else {
        return -1
      }
  }



  render() {
    const {item, itemNumber, quoteNumber, dispatch, lastNumber, shoppingCartDOMNodes} = this.props
    const totalMaterial = item.totalMaterial.slice(1)
    const labor = item.labor.slice(1)
    const {focus} = this.state
    // const nextNode = this.findNextAvailableNodePosition(shoppingCartDOMNodes, itemNumber)

    return (
      <div className={`c-estimators-worksheet-items ${focus ? 'c-estimators-worksheet-items-focus' : ''}`}>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-no">{itemNumber}</span>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-code">{item.keycode}</span>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-amt">
            <input type="text" className="c-estimators-worksheet-list-item-amt-input"
              defaultValue={item.quantity}
              onChange={(quantity)=>{dispatch(actions.updateItemQuantity(itemNumber, quoteNumber, quantity.target.value))}}
              ref = {input => {
                if(shoppingCartDOMNodes['products'][itemNumber]!==input && input !== null) {
                  dispatch(actions.setProductShoppingCartNode(itemNumber, input))
                }}}
              onKeyPress={e =>  {if(e.charCode === 13)  { itemNumber === lastNumber ? shoppingCartDOMNodes['firstName'].focus() : shoppingCartDOMNodes['products'][itemNumber+1].focus()}}}
              onFocus={()=>shoppingCartDOMNodes['products'][itemNumber].select()}/>
          </span>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-units">{item.uom}</span>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-desc">
            <textarea
              className="c-estimators-worksheet-list-item-desc-input"
              defaultValue={item.specifications}
              onFocus={this.toggleTextAreaFocus}
              onBlur={this.toggleTextAreaFocus}
            />
          </span>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-mtrl">${parseFloat(item.quantity*totalMaterial).toFixed(2)}</span>
          <span className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-lbr">${parseFloat(item.quantity*labor).toFixed(2)}</span>
          <span
            className="c-estimators-worksheet-list-item c-estimators-worksheet-list-item-x"
            onClick={() =>{
              dispatch(actions.removeFromShoppingCart(itemNumber, quoteNumber))

            }}>
            <FaClose />
          </span>
      </div>
    );
  }
}

export default connect(
  (state)=>{
    return {
      quoteNumber: state.quoteNumber,
      shoppingCartDOMNodes: state.shoppingCartDOMNodes
    }
  }
)(EstimateWorksheetItem)

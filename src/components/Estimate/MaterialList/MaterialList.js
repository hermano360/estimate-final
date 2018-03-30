import React, { Component } from 'react'
import { connect } from 'react-redux'
import TiArrowLeftOutline from 'react-icons/lib/ti/arrow-left-outline'
import TiArrowRightOutline from 'react-icons/lib/ti/arrow-right-outline'
import {Modal, Button} from 'react-bootstrap'
import SimpleModal from '../../Common/SimpleModal'
import actions from '../../../redux/actions/actions'

import './MaterialList.scss'

export class MaterialList extends Component {
  incrementItemNumber(shoppingCart, itemNumber){
    const {changeItemNumber} = this.props
    if(itemNumber < shoppingCart.length){
      changeItemNumber(itemNumber + 1)
    } else {
      changeItemNumber(1)
    }
  }
  decrementItemNumber(shoppingCart, itemNumber){
    const {changeItemNumber} = this.props
    if(itemNumber > 1){
      changeItemNumber(itemNumber - 1)
    } else {
      changeItemNumber(shoppingCart.length)
    }
  }
  removeItemNumber(itemNumber, shoppingCart){
    const {dispatch, quoteNumber, changeItemNumber} = this.props
    if(itemNumber === shoppingCart.length){
      changeItemNumber(itemNumber - 1)
    }
    dispatch(actions.removeFromShoppingCart(itemNumber, quoteNumber))
  }

  render() {
    const {show, toggleShowMaterial, itemNumber, shoppingCart, dispatch, quoteNumber} = this.props
    let renderedItem = shoppingCart[itemNumber-1]

    return (
      <SimpleModal open={show} toggle={toggleShowMaterial} className="c-materiallist-modal" >

          <div className="c-materiallist-header">Material/Labor Cost List</div>


          <div className="c-materiallist-pair">
            <div className="c-materiallist-property">Supplier</div>
            <div className="c-materiallist-value">{renderedItem.supplier}</div>
          </div>
          <div className="c-materiallist-pair">
            <div className="c-materiallist-property">Keycode</div>
            <div className="c-materiallist-value">{renderedItem.keycode}</div>
          </div>
          <div className="c-materiallist-pair">
            <div className="c-materiallist-property">SKU</div>
            <div className="c-materiallist-value">{renderedItem.sku}</div>
          </div>
          <div className="c-materiallist-pair">
            <div className="c-materiallist-property">Total Material</div>
            <div className="c-materiallist-value">{renderedItem.totalMaterial}</div>
          </div>
          <div className="c-materiallist-pair">
            <div className="c-materiallist-property">UOM</div>
            <div className="c-materiallist-value">{renderedItem.uom}</div>
          </div>
          <div className="c-materiallist-pair">
            <div className="c-materiallist-property">Labor</div>
            <div className="c-materiallist-value">{renderedItem.labor}</div>
          </div>
          <div className="c-materiallist-pair">
            <div className="c-materiallist-property full">Specifications</div>
            <div className="c-materiallist-value full">{renderedItem.specifications}</div>
          </div>
          <div className="c-materiallist-picture">
            <div className="c-materiallist-picture-frame"></div>
          </div>
          <div className="c-materiallist-nav">
            <div className="c-materiallist-nav-opt prev" onClick={()=>this.decrementItemNumber(shoppingCart, itemNumber)}>
              <TiArrowLeftOutline />
            </div>
            <div className="c-materiallist-remove" onClick={()=>this.removeItemNumber(itemNumber, shoppingCart)}>Remove</div>
            <div className="c-materiallist-nav-opt next" onClick={()=>this.incrementItemNumber(shoppingCart, itemNumber)}>
              <TiArrowRightOutline />
            </div>
          </div>

          <Button className="c-materiallist-close" onClick={toggleShowMaterial}>Close</Button>

      </SimpleModal>
    );
  }
}

export default connect(
  (state)=>{
    return {
      quoteNumber: state.quoteNumber
    }
  }
)(MaterialList)

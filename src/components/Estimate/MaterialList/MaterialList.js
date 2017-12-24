import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import actions from '../../../redux/actions/actions'
import request from 'superagent'

import './MaterialList.scss'

export class MaterialList extends Component {
  constructor(e){
    super(e)
    this.state = {
    }
  }

  render() {
    const {quotes,quoteNumber} = this.props
    console.log(quotes[quoteNumber].shoppingCart)

//     group
// :
// "Bathroom faucets"
// keycode
// :
// "Bfaucet1"
// labor
// :
// "$60.00"
// quantity
// :
// "7"
// sku
// :
// "84503"
// specifications
// :
// "Supply Labor And Material For Installation of Moen Adler Chrome 1-handle WaterSense® Bathroom Faucet (Drain Included)  At New Addition Include Supply Flex Lines. *" widespread additional $65.00 lto install ."
// supplier
// :
// "Lowes"
// template
// :
// "Bath2"
// totalMaterial
// :
// "$64.50"
// uom
// :
// "ea"
//
// <div>{quotes[quoteNumber].shoppingCart[0].supplier}</div>
// <div>{quotes[quoteNumber].shoppingCart[0].keycode}</div>
// <div>{quotes[quoteNumber].shoppingCart[0].sku}</div>
// <div>{quotes[quoteNumber].shoppingCart[0].uom}</div>
// <div>{quotes[quoteNumber].shoppingCart[0].totalMaterial}</div>
// <div>{quotes[quoteNumber].shoppingCart[0].labor}</div>
// <div>{quotes[quoteNumber].shoppingCart[0].specifications}</div>
    return (
      <Modal show={true} onHide={()=>console.log('close')}  className="c-materiallist-modal" >
        <Modal.Header closeButton>
          <div className="c-materiallist-header">Material/Labor Cost List</div>
        </Modal.Header>
        <Modal.Body>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property">Supplier</div>
          <div className="c-materiallist-value">{quotes[quoteNumber].shoppingCart[0].supplier}</div>
        </div>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property">Supplier</div>
          <div className="c-materiallist-value">{quotes[quoteNumber].shoppingCart[0].keycode}</div>
        </div>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property">Supplier</div>
          <div className="c-materiallist-value">{quotes[quoteNumber].shoppingCart[0].sku}</div>
        </div>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property">Supplier</div>
          <div className="c-materiallist-value">{quotes[quoteNumber].shoppingCart[0].totalMaterial}</div>
        </div>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property">Supplier</div>
          <div className="c-materiallist-value">{quotes[quoteNumber].shoppingCart[0].uom}</div>
        </div>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property">Supplier</div>
          <div className="c-materiallist-value">{quotes[quoteNumber].shoppingCart[0].labor}</div>
        </div>
        <div className="c-materiallist-pair">
          <div className="c-materiallist-property full">Supplier</div>
          <div className="c-materiallist-value full">{quotes[quoteNumber].shoppingCart[0].specifications}</div>
        </div>
        <div className="c-materiallist-picture">
          <div className="c-materiallist-picture-frame"></div>

        </div>


          </Modal.Body>
        <Modal.Footer>
          <Button className="c-materiallist-close" onClick={()=>console.log('close')}>Close</Button>
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
)(MaterialList)

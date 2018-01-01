import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import actions from '../../../redux/actions/actions'

import SignaturePad from 'react-signature-pad'
import './SignatureBox.scss'
import request from 'superagent'
import baseURL from '../../baseURL'

export class SignatureBox extends Component {
  constructor(e){
    super(e)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(){
    request
    .post(`${baseURL.url}/save_sig`)
    .send({
      imgBase64: this.refs.mySignature.toDataURL().replace(/^data:image\/png;base64,/, "")
    })
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  render() {
    const {show, toggleShowMaterial, itemNumber, shoppingCart, dispatch, quoteNumber} = this.props

    return (
      <Modal show={false} onHide={()=>console.log('')} className="c-materiallist-modal" >
        <Modal.Header closeButton>
          <div className="c-materiallist-header">Signature Box</div>
        </Modal.Header>
        <Modal.Body>
          <SignaturePad clearButton="true" ref="mySignature" />
          <div onClick={this.handleClick} >hi</div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
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
)(SignatureBox)

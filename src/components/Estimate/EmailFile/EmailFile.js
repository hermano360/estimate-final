import React, { Component } from 'react'
import { connect } from 'react-redux'
import TiArrowLeftOutline from 'react-icons/lib/ti/arrow-left-outline'
import TiArrowRightOutline from 'react-icons/lib/ti/arrow-right-outline'
import {Modal, Button} from 'react-bootstrap'
import actions from '../../../redux/actions/actions'

import './EmailFile.scss'

export class EmailFile extends Component {
  constructor(e){
    super(e)
    this.state = {
      fileToBeSent: '',
      recipientName: '',
      recipientEmail: ''
    }
  }

  render() {
    const {dispatch, show, toggleShowMaterial} = this.props

    return (
      <Modal show={show} onHide={toggleShowMaterial} className="c-emailfile-modal" >
        <Modal.Header closeButton>
          <div className="c-emailfile-header">Email File</div>
        </Modal.Header>
        <Modal.Body>
          <div>Send Estimate or Shopping List?</div>
          <div>Name of Recipient</div>
          <div>Email of Recipient</div>
          <div>Send</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="c-emailfile-close" onClick={()=>console.log('close')}>Close</Button>
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
)(EmailFile)

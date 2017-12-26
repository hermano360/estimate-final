import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import actions from '../../../redux/actions/actions'
import request from 'superagent'

import './RemoveQuote.scss'

export class Sidebar extends Component {
  removeQuoteFromDatabase(){
    console.log('remove quote from database')
  }
  render() {
    const {toggleRemoveQuote, show} = this.props
    return (
      <Modal show={show} onHide={toggleRemoveQuote}  className="c-remove-quote-modal" >
        <Modal.Body className="c-remove-quote-body">
          <div className="c-remove-quote-body-text">Are You Sure You Want to Delete this Quote?</div>
          <div className="c-remove-quote-body-options">
            <div className="c-remove-quote-body-options cancel" onClick={toggleRemoveQuote}>Cancel</div>
            <div className="c-remove-quote-body-options yes" onClick={this.removeQuoteFromDatabase}>Yes</div>
          </div>
        </Modal.Body>
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
)(Sidebar)

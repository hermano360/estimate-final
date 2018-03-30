import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import SimpleModal from '../../Common/SimpleModal'
import actions from '../../../redux/actions/actions'
import Loadable from 'react-loading-overlay'
import request from 'superagent'
import baseURL from '../../baseURL'

import './RemoveQuote.scss'

export class Sidebar extends Component {
  constructor(e){
    super(e)
    this.state = {
      loadingSave: false
    }
    this.removeQuoteFromDatabase = this.removeQuoteFromDatabase.bind(this)
  }

  findAvailableQuoteNumber(quoteNumber, quoteNumbers){
    let currentIndex = quoteNumbers.indexOf(quoteNumber.toString())
    console.log(currentIndex)
    if(currentIndex === 0){
      return quoteNumbers[1]
    } else {
      return quoteNumbers[currentIndex-1]
    }
  }

  removeQuoteFromDatabase(){
    const {quotes, quoteNumber, dispatch, toggleRemoveQuote} = this.props

    this.setState({
      loadingSave: true
    })

    const previouslyAvailableQuoteNumbers = Object.keys(quotes)
    const nextQuoteNumber = this.findAvailableQuoteNumber(quoteNumber, previouslyAvailableQuoteNumbers)
    request
      .post(`${baseURL.url}/remove-quote`)
      .send({quoteNumber})
      .then(res=> {
        const availableQuoteNumbers = res.body.map((quote)=>quote.quoteNumber)
        dispatch(actions.setQuoteNumber(nextQuoteNumber))
        dispatch(actions.loadDatabaseQuoteNumbers(availableQuoteNumbers))
        dispatch(actions.loadQuotes(res.body))
        dispatch(actions.loadDatabaseQuoteNumbers(res.body.map(quote=>quote.quoteNumber)))
        this.setState({
          loadingSave: false
        })
        toggleRemoveQuote()
      })
      .catch(err=> console.log(err))
  }
  render() {
    const {toggleRemoveQuote, show} = this.props
    const {loadingSave} = this.state
    return (
      <Loadable
        active={loadingSave}
        spinner
        text='Saving Quote Information...'>
      <SimpleModal open={show} toggle={toggleRemoveQuote}  className="c-remove-quote-modal" >
        <div className="c-remove-quote-body">
          <div className="c-remove-quote-body-text">Are You Sure You Want to Delete this Quote?</div>
          <div className="c-remove-quote-body-options">
            <div className="c-remove-quote-body-options cancel" onClick={toggleRemoveQuote}>Cancel</div>
            <div className="c-remove-quote-body-options yes" onClick={this.removeQuoteFromDatabase}>Yes</div>
          </div>
        </div>
      </SimpleModal>
      </Loadable>
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

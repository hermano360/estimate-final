import React, { Component } from 'react'
import { connect } from 'react-redux'
import TiArrowLeftOutline from 'react-icons/lib/ti/arrow-left-outline'
import TiArrowRightOutline from 'react-icons/lib/ti/arrow-right-outline'
import Loadable from 'react-loading-overlay'
import actions from '../../../redux/actions/actions'
import SimpleModal from '../../Common/SimpleModal'
import request from 'superagent'

import './EmailFile.scss'

export class EmailFile extends Component {
  constructor(e){
    super(e)
    this.state = {
      fileToBeSent: '',
      recipientName: '',
      recipientEmail: '',
      nameError: false,
      emailError: false,
      fileError: false,
      loadingEmail: false
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleFileSelect = this.handleFileSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleNameChange(recipientName){
    this.setState({
      recipientName,
      nameError: false
    })
  }
  handleEmailChange(recipientEmail){
    this.setState({
      recipientEmail,
      emailError: false
    })
  }
  handleFileSelect(fileToBeSent){
    this.setState({
      fileToBeSent,
      fileError: false
    })
  }

  handleSubmit(){
    const {fileToBeSent, recipientName, recipientEmail} = this.state
    const {name, baseURL, toggleLoading, toggleEmailFile} = this.props
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let errorObject = {}
    let finalName = recipientName === '' ? name : recipientName

    if(fileToBeSent === ''){
      errorObject.fileError = true
    }
    if(finalName === '' ){
      errorObject.nameError = true
    }
    if(recipientEmail === '' || !emailRegex.test(recipientEmail)){
      errorObject.emailError = true
    }
    if(Object.keys(errorObject).length > 0){
      this.setState(errorObject)
    } else {

    toggleLoading()

    request
      .post(`${baseURL}/email/${fileToBeSent}`)
      .set('Content-Type', 'application/json')
      .send({
        name: finalName,
        email: recipientEmail
      }).then(res=>{
        toggleLoading()
        toggleEmailFile()
          console.log(res)
          this.setState({
            fileToBeSent: '',
            recipientName: '',
            recipientEmail: '',
            loadingEmail: false
          })
      })
      .catch(err=>{
        toggleLoading()
        console.log(err)
      })

    }
  }

  render() {
    const {loadingEmail}  = this.state
    const {dispatch, show, toggleEmailFile} = this.props
    let name = this.props.name.trim()
    const {recipientName, recipientEmail,fileToBeSent, fileError, nameError, emailError} = this.state

    if(recipientName !==''){
      name = recipientName
    }

    return (

      <SimpleModal open={show} toggle={toggleEmailFile} className="c-emailfile-modal" >
            <div className="c-emailfile-header">Email File</div>

            <div className="c-emailfile-options-files-title">Which File?</div>
            <div className="c-emailfile-options-files">
              <div className={`c-emailfile-options-files-opt ${fileError ? 'invalid' : ''} ${fileToBeSent === 'estimate' ? 'selected' : ''}`}
                onClick={()=>this.handleFileSelect('estimate')}>
                Estimate
              </div>
               <div className={`c-emailfile-options-files-opt ${fileError ? 'invalid' : ''} ${fileToBeSent === 'shoppinglist' ? 'selected' : ''}`}
                onClick={()=>this.handleFileSelect('shoppinglist')}>
                Shopping List
              </div>
            </div>
            <div className="c-emailfile-options-files-title">Name</div>
            <input type="text" className={`c-emailfile-options-input ${nameError ? 'invalid' : ''}`}
              placeholder="Name of Recipient" value={name}
              onChange={(e)=>this.handleNameChange(e.target.value)}/>
            <div className="c-emailfile-options-files-title">Email</div>
            <input type="text" className={`c-emailfile-options-input ${emailError ? 'invalid' : ''}`}
              placeholder="Email of Recipient" value={recipientEmail}
                onChange={(e)=>this.handleEmailChange(e.target.value)}/>
            <div className="c-emailfile-options-send" onClick={this.handleSubmit}>Send</div>
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
)(EmailFile)

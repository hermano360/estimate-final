import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Modal, Button} from 'react-bootstrap'
import NumericInput from 'react-numeric-input'

import actions from '../../../redux/actions/actions'
import './Settings.css'



class Settings extends Component {
  constructor(e){
    super(e)
    this.handleChangeTax = this.handleChangeTax.bind(this)
    this.handleChangeExtraWork = this.handleChangeExtraWork.bind(this)
    this.handleChangeLabor = this.handleChangeLabor.bind(this)
    this.handleChangeEstimator = this.handleChangeEstimator.bind(this)
  }

  componentWillMount(){
    const {dispatch} = this.props
    if(localStorage.getItem('tax') === undefined || localStorage.getItem('tax') === null){
      this.handleChangeTax(9.5)
    } else {
      dispatch(actions.changeTax(parseFloat(localStorage.getItem('tax'))))
    }
    if(localStorage.getItem('labor')=== undefined || localStorage.getItem('labor')=== null){
      this.handleChangeLabor(30)
    } else {
      dispatch(actions.changeLabor(parseFloat(localStorage.getItem('labor'))))
    }
    if(localStorage.getItem('extraWork')=== undefined || localStorage.getItem('extraWork')=== null){
      this.handleChangeExtraWork(40)
    } else {
      dispatch(actions.changeExtraWork(parseFloat(localStorage.getItem('extraWork'))))
    }
    if(localStorage.getItem('estimator') !== undefined && localStorage.getItem('estimator') !== null){
      dispatch(actions.changeEstimator(localStorage.getItem('estimator')))
    }
  }

  handleChangeTax(value){
    const {dispatch} = this.props
    localStorage.setItem('tax', value)
    dispatch(actions.changeTax(value))
  }
  handleChangeExtraWork(value){
    const {dispatch} = this.props
    localStorage.setItem('extraWork', value)
    dispatch(actions.changeExtraWork(value))
  }
  handleChangeLabor(value){
    const {dispatch} = this.props
    localStorage.setItem('labor', value)
    dispatch(actions.changeLabor(value))
  }
  handleChangeEstimator(value){
    const {dispatch} = this.props
    localStorage.setItem('estimator', value.target.value)
    dispatch(actions.changeEstimator(value.target.value))
  }

  render() {
    const {labor, tax, extraWork, showModal, estimator, toggleSettingsModal, dispatch} = this.props
    return (

      <Modal show={showModal} onHide={toggleSettingsModal} className="c-settings-modal">
        <Modal.Header closeButton>
          <div className='c-settings-title'>Settings</div>
        </Modal.Header>
        <Modal.Body>
          <div className='c-settings-label'>Estimator</div>
          <select className='c-settings-estimator' value={estimator} onChange={this.handleChangeEstimator}>
            <option value="">-Select-</option>
            <option value="Arnold Corona">Arnold Corona</option>
            <option value="Gary Banks">Gary Banks</option>
            <option value="John Chavez">John Chavez</option>
            <option value="John Gutierrez">John Gutierrez</option>
            <option value="Bob Leon">Bob Leon</option>
            <option value="Ricardo Rivera">Ricardo Rivera</option>
            <option value="Mike Rogers">Mike Rogers</option>
            <option value="Cameron Sterling">Cameron Sterling</option>
          </select>
          <div className='c-settings-label'>Labor %</div>
          <NumericInput min={0} max={100} value={labor} step={5}  mobile onChange={this.handleChangeLabor} />
          <div className='c-settings-label'>Extra Work %</div>
          <NumericInput min={0} max={100} value={extraWork} step={5}  mobile onChange={this.handleChangeExtraWork} />
          <div className='c-settings-label'>Tax %</div>
          <NumericInput min={7} max={15} value={tax} step={0.1} mobile onChange={this.handleChangeTax} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={toggleSettingsModal}>Close</Button>
        </Modal.Footer>
      </Modal>

    );
  }
}

export default connect(
  (state)=>{
    return {
      labor: state.labor,
      tax: state.tax,
      extraWork: state.extraWork,
      estimator: state.estimator
    }
  }
)(Settings)

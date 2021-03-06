import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button} from 'react-bootstrap'
import NumericInput from 'react-numeric-input'
import {LargeModal} from '../../Common/SimpleModal.js'
import actions from '../../../redux/actions/actions'
import './Settings.scss'



class Settings extends Component {
  state = {
    fontSize: "small"
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
    if(localStorage.getItem('material')=== undefined || localStorage.getItem('material')=== null){
      this.handleChangeMaterial(30)
    } else {
      dispatch(actions.changeMaterial(parseFloat(localStorage.getItem('material'))))
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
  handleChangeMaterial(value){
    const {dispatch} = this.props
    localStorage.setItem('material', value)
    dispatch(actions.changeMaterial(value))
  }
  handleChangeEstimator(value){
    const {dispatch} = this.props
    localStorage.setItem('estimator', value.target.value)
    dispatch(actions.changeEstimator(value.target.value))
  }
  updateFontSize = e => {
    this.setState({fontSize: e.target.value})
  }

  render() {
    const {labor, tax, extraWork, showModal, estimator, toggleSettingsModal, dispatch, material} = this.props
    const {fontSize} = this.state
    return (
      <LargeModal open={showModal} toggle={toggleSettingsModal}>
        <div className="c-settings-box">
          <div className="c-settings-box-image-container">
            <div className="c-settings-box-image-header">Settings</div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Estimator</div>
              <select className='c-settings-estimator c-settings-input' value={estimator} onChange={this.handleChangeEstimator.bind(this)}>
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
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Company Name</div>
              <input type="text" className='c-settings-input' />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Address</div>
              <input type="text" className='c-settings-input' />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>City</div>
              <input type="text" className='c-settings-input' />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>State</div>
              <input type="text" className='c-settings-input' />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Zipcode</div>
              <input type="text" className='c-settings-input' />
            </div>
            <div className="c-settings-box-image-header">Company Markup</div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Labor %</div>
              <NumericInput min={0} max={100} value={labor} step={5}  mobile onChange={this.handleChangeLabor.bind(this)} />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Material %</div>
              <NumericInput min={0} max={100} value={material} step={5}  mobile onChange={this.handleChangeMaterial.bind(this)} />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Extra Work %</div>
              <NumericInput min={0} max={100} value={extraWork} step={5}  mobile onChange={this.handleChangeExtraWork.bind(this)} />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Tax %</div>
              <NumericInput min={7} max={15} value={tax} step={0.1} mobile onChange={this.handleChangeTax.bind(this)} />
            </div>
            <div className="c-settings-box-image-item">
              <div className='c-settings-label'>Font Size</div>
              <div className='c-settings-font-size'>
                <div className='c-settings-font-size-label small'>A</div>
                <input type="radio" value="small" className='c-settings-input' checked={fontSize === 'small'} onChange={this.updateFontSize}/>
                <div className='c-settings-font-size-label medium'>A</div>
                <input type="radio" value="medium" className='c-settings-input' checked={fontSize === 'medium'} onChange={this.updateFontSize}/>
                <div className='c-settings-font-size-label large'>A</div>
                <input type="radio" value="large" className='c-settings-input' checked={fontSize === 'large'} onChange={this.updateFontSize}/>
              </div>
            </div>
          </div>
        </div>
      </LargeModal>
    );
  }
}

export default connect(
  (state)=>{
    return {
      labor: state.labor,
      material: state.material,
      tax: state.tax,
      extraWork: state.extraWork,
      estimator: state.estimator
    }
  }
)(Settings)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../../assets/images/ezestimator_logo.png'
import GoGear from 'react-icons/lib/go/gear'
import Settings from './Settings/Settings'
import actions from '../../redux/actions/actions'
import { Button } from 'react-bootstrap'

import './Home.scss'



class Home extends Component {
  constructor(e){
    super(e)
    this.state={
      showModal: false
    }
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this)
  }

  toggleSettingsModal(){
    const {showModal} = this.state
    this.setState({
      showModal: !showModal
    })
  }
  redirectToComponent(component){
    const {dispatch} = this.props
    this.toggleSettingsModal()
    dispatch(actions.changePage(component))
  }

  render() {
    const {showModal} = this.state
    return (
      <div className="c-home-body">
        <Settings showModal={showModal} toggleSettingsModal={this.toggleSettingsModal}/>
        <div className="c-home-gear" onClick={this.toggleSettingsModal}>
          <div className="c-home-gear-icon"><GoGear/></div>
          <div className="c-home-gear-text">Settings</div>
        </div>
        <img src={logo} alt='Estimate Logo' className="c-home-logo"/>
        <div className="c-home-button-group">
          <Button bsSize="large" className="c-home-button c-home-button-top" onClick={()=>this.redirectToComponent('estimate')}>Estimate</Button>
          <Button bsSize="large" className="c-home-button c-home-button-bottom" onClick={()=>this.redirectToComponent('products')}>Products</Button>
          <Button bsSize="large" className="c-home-button c-home-button-bottom" onClick={()=>this.redirectToComponent('phonelist')}>Phone List</Button>
        </div>
      </div>
    );
  }
}

export default connect(
  (state)=>{
    return {
      page: state.page
    }
  }
)(Home)

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Button, ControlLabel, FormControl } from 'react-bootstrap'
import request from 'superagent'

import actions from '../../redux/actions/actions'
import logo from '../../assets/images/ezestimator_logo.png'

export class Login extends Component {
  constructor(e){
    super(e)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleUserName = (e) => {
    this.setState({
      username: e.target.value,
      error: false
    })
  }
  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
      error: false
    })
  }
  handleSubmit(){
    const {username, password} = this.state
    const {dispatch} = this.props
    const {baseURL} = this.props.data
    const {getCompleteData} = this.props.functions
    request
      .post(`${baseURL}/authenticate`)
      .send({username, password})
      .then(res=>{
        localStorage.setItem('authToken', res.text)
        getCompleteData()
        dispatch(actions.changePage('home'))
      }) .catch(err=>{
        console.log(err)
      })
  }

  render(){
    const {username, password, error} = this.state
    return (
      <div className="c-home-body">
        <img src={logo} alt='Estimate Logo' className="c-home-logo"/>
        <form>
          <ControlLabel>Name</ControlLabel>
          <FormControl value={username} onChange={this.handleUserName.bind(this)} style={{textAlign: 'center'}}/>
          <ControlLabel>Password</ControlLabel>
          <FormControl value={password} type="password" onChange={this.handlePassword.bind(this)} style={{textAlign: 'center'}}/>
          {error && <div style={{color: 'red'}}>error</div>}
        <Button onClick={this.handleSubmit.bind(this)}>Submit</Button>
      </form>
      </div>
    )
  }
}

export default connect(
  (state)=>{
    return {

    }
  }
)(Login)

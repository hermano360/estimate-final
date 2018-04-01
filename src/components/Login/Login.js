import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Button, ControlLabel, FormControl } from 'react-bootstrap'
import request from 'superagent'

import actions from '../../redux/actions/actions'
import logo from '../../assets/images/ezestimator_logo.png'

export class Login extends Component {

  state = {
    username: '',
    password: ''
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

  handleSubmit = () => {
    const {username, password} = this.state
    const {dispatch} = this.props.functions
    const {baseURL} = this.props.data

    request.post(`${baseURL}/authenticate`).send({username, password})
      .then(res=>{
        localStorage.setItem('authToken', JSON.parse(res.text))
        this.redirectToHome()
      }).catch(err => {
        console.log(err)
      })
  }

  redirectToHome = () => {
    const {getCompleteData, dispatch} = this.props.functions
    getCompleteData()
    dispatch(actions.changePage('home'))
  }

  componentDidMount(){
    const {dispatch} = this.props.functions
    if(localStorage.getItem('authToken') !== null){
      this.redirectToHome()
    }
  }

  render(){
    const {username, password, error} = this.state
    return (
      <div className="c-home-body">
        <img src={logo} alt='Estimate Logo' className="c-home-logo"/>
        <form>
          <ControlLabel>Name</ControlLabel>
          <FormControl value={username} onChange={this.handleUserName} style={{textAlign: 'center'}}/>
          <ControlLabel>Password</ControlLabel>
          <FormControl value={password} type="password" onChange={this.handlePassword} style={{textAlign: 'center'}}/>
          {error && <div style={{color: 'red'}}>error</div>}
        <Button onClick={this.handleSubmit}>Submit</Button>
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

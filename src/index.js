import React from 'react'
import ReactDOM from 'react-dom'
import Main from './components/Main'

const { Provider } = require('react-redux')
// const actions = require('./actions/actions.js')
const store = require('./redux/configureStore.js').configure()


ReactDOM.render(
  <Provider store={store} >
    <Main />
  </Provider>,
  document.getElementById('app')
)

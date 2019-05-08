import './index.css'
import 'papercss/dist/paper.min.css'
import { ConnectedApp } from './App'
import { createStore } from './state/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <Provider store={createStore()}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()

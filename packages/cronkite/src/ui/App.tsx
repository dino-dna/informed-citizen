import './App.css'
import { Router } from '@reach/router'
import Nav from './Nav'
import React from 'react'
import Routable from './components/Routableable'
import { connect } from 'react-redux'
import Home, { HomeProps } from './Home'

export class App extends React.PureComponent<HomeProps> {
  render () {
    return (
      <div className='layout--container'>
        <Nav />
        <Router>
          <Routable default props={this.props} render={Home} />
          <Routable
            path='about'
            render={() => (
              <div className='layout--body' style={{ margin: '80px auto 0' }}>
                cool beans
              </div>
            )}
          />
        </Router>
      </div>
    )
  }
}

export const ConnectedApp = connect(
  state => state,
  dispatch => ({ dispatch })
)(App)

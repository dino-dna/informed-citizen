import './App.css'
import { Router } from '@reach/router'
import Nav from './Nav'
import React from 'react'
import Routable from './components/Routableable'
import { connect } from 'react-redux'
import Home, { HomeProps } from './Home'
import { Patreon } from './patreon'

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
              <div className='layout--body'>
                <h2>About</h2>
                <p>
                  Informed Citizen is an open source project, run by the community. See our{' '}
                  <Patreon label='Patreon' /> and{' '}
                  <a href='https://github.com/dino-dna/informed-citizen'>GitHub</a> for more.
                </p>
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

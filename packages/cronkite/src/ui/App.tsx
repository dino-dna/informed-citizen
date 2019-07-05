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
                  Developing and running Informed Citizen costs time and money. Any amount of money
                  you donate goes directly to funding this project, and this project alone.
                  <br />
                  <br />
                  <b>Thank you!</b>
                </p>
                <h3>FAQ</h3>
                <h4>Why was my article rated the way it was?</h4>
                <p>
                  Machines are assessing the articles here, and the assessments use
                  math/numeric-methods to explain the contents. Computers aren't as smart as you or
                  me. They are, however, much faster and tend to pick up on little things we may
                  not.
                  <br />
                  <br />
                  <b>We make no guarantees to the accurracy of our claims.</b>
                </p>
                <h4>Can article X be re-evaluated?</h4>
                <p>
                  At the current time, no. However, if you're interested in supporting
                  re-evaluation, please feel free to get engaged with the project and support the
                  feature!
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

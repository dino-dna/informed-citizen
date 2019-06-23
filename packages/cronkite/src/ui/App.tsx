import './App.css'
import { Router } from '@reach/router'
import AnalyzeArticleRequestForm from './components/AnalyzeArticleRequestForm'
import Nav from './Nav'
import React from 'react'
import Routable from './components/Routableable'
import { Store } from './types'
import { connect } from 'react-redux'
import ArticleAnalysisCard from './components/ArticleAnalysisCard'
import { Ripple } from 'react-css-spinners'

const App: React.FC = _props => {
  const props = _props as Store.All & Store.WithDispatch
  return (
    <div className='layout--container'>
      <Nav />
      <Router>
        <Routable
          default
          render={() => {
            return (
              <div className='layout--body'>
                <AnalyzeArticleRequestForm
                  disabled={!!props.analysis.loading}
                  style={{ margin: '80px auto 0' }}
                  onAnalzye={(url: string) => {
                    props.dispatch({
                      type: 'REQUEST_ANALYSIS',
                      payload: { url }
                    })
                  }}
                />
                {!!props.analysis.loading && (
                  <Ripple style={{ marginTop: 20, marginBottom: 100 }} />
                )}
                {!!props.analysis.value && (
                  <ArticleAnalysisCard
                    style={{ marginTop: 20, marginBottom: 100 }}
                    analysis={props.analysis.value}
                  />
                )}
                {!!props.analysis.error && (
                  <div
                    style={{ marginTop: 20 }}
                    className='alert alert-danger'
                    children={props.analysis.error}
                  />
                )}
              </div>
            )
          }}
        />
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

export const ConnectedApp = connect(
  state => state,
  dispatch => ({ dispatch })
)(App)

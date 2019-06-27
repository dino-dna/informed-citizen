import './App.css'
import { Router } from '@reach/router'
import AnalyzeArticleRequestForm from './components/AnalyzeArticleRequestForm'
import Nav from './Nav'
import React, { useState } from 'react'
import Routable from './components/Routableable'
import { Store } from './types'
import { connect } from 'react-redux'
import ArticleAnalysisCard from './components/ArticleAnalysisCard'
import { Ripple } from 'react-css-spinners'

export class App extends React.PureComponent<
  Store.All & Store.WithDispatch,
  { url: string }
> {
  constructor (props: any) {
    super(props)
    this.state = { url: '' }
  }
  onAnalyze = (url: string) => {
    this.props.dispatch({
      type: 'REQUEST_ANALYSIS',
      payload: { url }
    })
  }
  onChangeUrl = (url: string) => {
    this.setState({ url })
  }
  render () {
    const {
      props,
      onAnalyze,
      onChangeUrl,
      state: { url }
    } = this
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
                    onAnalzye={onAnalyze}
                    onChangeUrl={onChangeUrl}
                    url={url}
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
}

export const ConnectedApp = connect(
  state => state,
  dispatch => ({ dispatch })
)(App)

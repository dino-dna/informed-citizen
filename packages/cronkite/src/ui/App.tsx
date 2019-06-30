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
                    disabled={!!props.analysisResult.loading}
                    style={{ margin: '80px auto 0' }}
                    onAnalzye={onAnalyze}
                    onChangeUrl={onChangeUrl}
                    url={url}
                  />
                  {!!props.analysisResult.loading && (
                    <Ripple style={{ marginTop: 20, marginBottom: 100 }} />
                  )}
                  {!!props.analysisResult.value && (
                    <ArticleAnalysisCard
                      url={url}
                      style={{ marginTop: 20, marginBottom: 100 }}
                      analysisReport={props.analysisResult.value}
                    />
                  )}
                  {!!props.analysisResult.error && (
                    <div
                      style={{ marginTop: 20 }}
                      className='alert alert-danger'
                      children={props.analysisResult.error}
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

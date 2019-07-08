import React from 'react'
import AnalyzeArticleRequestForm from './components/AnalyzeArticleRequestForm'
import ArticleAnalysisCard from './components/ArticleAnalysisCard'
import { Ripple } from 'react-css-spinners'
import { Store } from './types'
import { Patreon } from './patreon'

export type HomeProps = Store.All & Store.WithDispatch

class Home extends React.PureComponent<HomeProps, { url: string }> {
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
    const props = this.props
    const {
      onAnalyze,
      onChangeUrl,
      state: { url }
    } = this
    return (
      <div className='layout--body'>
        <AnalyzeArticleRequestForm
          disabled={!!props.analysisResult.loading}
          className='app__form'
          onAnalzye={onAnalyze}
          onChangeUrl={onChangeUrl}
          url={url}
        />
        <div className='analysis-container'>
          {!!props.analysisResult.loading && <Ripple />}
          {!!props.analysisResult.value && (
            <ArticleAnalysisCard
              url={url}
              analysisReport={props.analysisResult.value}
              scrollIntoView={props.analysisResult.scrollIntoView}
            />
          )}
          {!!props.analysisResult.error && (
            <div
              style={{ marginTop: 20 }}
              className='alert alert-danger'
              children={props.analysisResult.error}
            />
          )}
          <br />
          <Patreon />
        </div>
      </div>
    )
  }
}

export default Home

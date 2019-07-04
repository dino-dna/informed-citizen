import React from 'react'
import AnalyzeArticleRequestForm from './components/AnalyzeArticleRequestForm'
import ArticleAnalysisCard from './components/ArticleAnalysisCard'
import { Ripple } from 'react-css-spinners'
import { Store } from './types'

export type HomeProps = Store.All & Store.WithDispatch

class Home extends React.PureComponent<HomeProps, { url: string }> {
  analysisCardEl: React.RefObject<HTMLDivElement>

  constructor (props: any) {
    super(props)
    this.state = { url: '' }
    this.analysisCardEl = React.createRef()
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
  componentDidUpdate () {
    if (this.props.analysisResult.scrollIntoView) {
      if (!this.analysisCardEl || !this.analysisCardEl.current) {
        return
      }
      this.analysisCardEl.current.scrollIntoView({ behavior: 'smooth' })
    }
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
        <div style={{ margin: '20px auto 100px', display: 'flex', justifyContent: 'center' }}>
          {!!props.analysisResult.loading && <Ripple />}
          {!!props.analysisResult.value && (
            <ArticleAnalysisCard
              ref={this.analysisCardEl}
              url={url}
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
      </div>
    )
  }
}

export default Home

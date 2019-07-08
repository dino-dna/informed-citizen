import React from 'react'
import { AnalysisResult } from '../../common'
import './ArticleAnalysisCard.css'
import ScoringThumb from './ScoringThumb'
import { DESIRED_DOMAIN_CATEGORIES, getMetrics, getGeneralAnalysisClaim } from '../util/analysis'

interface Props extends React.HTMLProps<HTMLDivElement> {
  url: string
  analysisReport: AnalysisResult
  scrollIntoView: boolean
}

class ArticleAnalysisCard extends React.Component<Props> {
  analysisCardEl: React.RefObject<HTMLDivElement>
  constructor (props: any) {
    super(props)
    this.analysisCardEl = React.createRef()
  }
  componentDidUpdate () {
    if (this.props.scrollIntoView) {
      if (!this.analysisCardEl || !this.analysisCardEl.current) {
        return
      }
      this.analysisCardEl.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  render () {
    const { analysisReport, className = '', url, scrollIntoView, ...rest } = this.props
    const { analysis, title } = analysisReport
    const {
      content: { decision: contentDecision, score: contentScore },
      title: { decision: titleDecision, score: titleScore },
      domain: { category }
    } = analysis
    const { isGoodDomain, netScore, isBiased, isContentUnsure } = getMetrics(analysis)
    return (
      <div
        className={`${className} article_analysis_card--container`}
        {...rest}
        ref={this.analysisCardEl}
      >
        <h4 className='article_analysis_card__header' children='Analysis' />
        <div
          className='article_analysis_card__claim'
          children={
            <React.Fragment>
              <ScoringThumb score={netScore} style={{ height: 36, width: 36 }} />
              {getGeneralAnalysisClaim({
                contentDecision,
                isBiased,
                isContentUnsure,
                asReact: true
              })}
            </React.Fragment>
          }
        />
        <br />
        <span className='truncate-oneliner'>
          <span className='article_analysis_card__analyzed_url_label' children='title:' />
          <a
            children={title}
            key={title}
            className='article_analysis_card__analyzed_url'
            href={url}
            target='blank'
          />
        </span>
        <br />
        <table className='article_analysis_card__table'>
          <tbody>
            <tr>
              <th>section</th>
              <th>impartialness</th>
              <th>decision</th>
            </tr>
            <tr>
              <td>content</td>
              <td style={{ color: contentScore > 0.8 ? 'green' : 'red' }}>
                {(contentScore * 100).toFixed(0)}%
              </td>
              <td>{contentDecision}</td>
            </tr>
            <tr>
              <td>title</td>
              <td style={{ color: titleScore > 0.8 ? 'green' : 'red' }}>
                {(titleScore * 100).toFixed(0)}%
              </td>
              <td>{titleDecision}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ScoringThumb score={isGoodDomain ? 1 : 0} style={{ height: 18, width: 18, margin: 8 }} />
          {isGoodDomain ? (
            <span style={{ padding: 4 }}>the article domain is {category}</span>
          ) : (
            <span style={{ color: 'red', padding: 4 }}>
              the article domain is not one of {toListVerbiage(DESIRED_DOMAIN_CATEGORIES)}. it is{' '}
              {category}.
            </span>
          )}
        </div>
      </div>
    )
  }
}

function toListVerbiage (list: typeof DESIRED_DOMAIN_CATEGORIES) {
  if (list.length <= 1) return list[0] || ''
  if (list.length === 2) return `${list[0]} or ${list[1]}`
  const first = [...list]
  const last = first.pop()
  return `${first.join(', ')}, or ${last}`
}

export default ArticleAnalysisCard
